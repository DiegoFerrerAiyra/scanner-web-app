import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, bufferTime, filter, map, retry, Subject, takeUntil, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IBroadcastTrade,
  IMicroCapsScanner,
  RemoveEvent,
  SnapshotMessage,
  WsEvent
} from '@pages/scanner/scanner-small-caps/models/interfaces/searchUsers.interface';

@Injectable({ providedIn: 'root' })
export class MicrocapsService implements OnDestroy {
  private socket$!: WebSocketSubject<WsEvent>;

  private readonly state$ = new BehaviorSubject<IMicroCapsScanner[]>([]);
  public readonly microCaps$ = this.state$.asObservable();

  private readonly destroy$ = new Subject<void>();

  private rows = new Map<string, IMicroCapsScanner>();
  private lastSeq = 0;
  private snapshotApplied = false;

  /** Mensajes que llegan antes del snapshot */
  private preSnapshotBuffer: (IBroadcastTrade | RemoveEvent)[] = [];

  /** Cola caliente: bachea y colapsa por símbolo */
  private readonly incoming$ = new Subject<IBroadcastTrade | RemoveEvent>();

  constructor() {
    this.connect();

    // BACHEO + COLAPSO (ajustá 60–100ms si querés más/menos “vivo”)
    this.incoming$
      .pipe(
        bufferTime(100),
        filter(buf => buf.length > 0),
        map(buf => {
          buf.sort((a, b) => Number(a.seq ?? 0) - Number(b.seq ?? 0));
          const lastBySymbol = new Map<string, IBroadcastTrade | RemoveEvent>();
          for (const e of buf) lastBySymbol.set(e.symbol, e);
          return Array.from(lastBySymbol.values());
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(batch => this.applyBatch(batch));
  }

  private connect(): void {
    this.socket$ = webSocket<WsEvent>({
      url: environment.WS_URL,
      deserializer: (e: MessageEvent<string>): WsEvent => {
        try { return JSON.parse(e.data) as WsEvent; }
        catch { return [] as IBroadcastTrade[]; }
      }
    });

    this.socket$
      .pipe(
        retry({ delay: (_err, n) => timer(Math.min(2 ** n * 1000, 30000)) }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (msg: WsEvent) => this.handleMessage(msg),
        error: (err: unknown) => console.error('[WS error]', (err as any)?.toString?.() ?? err),
      });
  }

  // -------- type guards --------
  private isSnapshotMessage(x: unknown): x is SnapshotMessage {
    if (typeof x !== 'object' || x === null) return false;
    const m = x as Record<string, unknown>;
    return m['type'] === 'snapshot' && typeof m['snapshot_seq'] === 'number' && Array.isArray(m['items']);
  }
  private isRemoveEvent(x: unknown): x is RemoveEvent {
    if (typeof x !== 'object' || x === null) return false;
    const m = x as Record<string, unknown>;
    return m['type'] === 'remove' && typeof m['symbol'] === 'string';
  }
  private isBroadcastTrade(x: unknown): x is IBroadcastTrade {
    if (typeof x !== 'object' || x === null) return false;
    const m = x as Record<string, unknown>;
    return typeof m['symbol'] === 'string'
      && typeof m['price'] === 'number'
      && typeof m['volume_today'] === 'number'
      && typeof m['market_cap'] === 'number';
  }
  private isWsEventArray(x: unknown): x is (IBroadcastTrade | RemoveEvent)[] {
    return Array.isArray(x);
  }
  // ------------------------------

  private handleMessage(msg: WsEvent): void {
    if (this.isSnapshotMessage(msg)) {
      this.applySnapshot(msg);
      return;
    }

    if (this.isWsEventArray(msg)) {
      // Empujar todo a la cola (ordenado) — sin pedir replay acá
      msg.sort((a, b) => Number(a.seq ?? 0) - Number(b.seq ?? 0));
      for (const e of msg) {
        if (!this.snapshotApplied) this.preSnapshotBuffer.push(e);
        else this.incoming$.next(e);
      }
      return;
    }

    if (this.isRemoveEvent(msg) || this.isBroadcastTrade(msg)) {
      if (!this.snapshotApplied) {
        this.preSnapshotBuffer.push(msg);
      } else {
        // Sin pedir replay aquí; el batch lo maneja
        this.incoming$.next(msg);
      }
    }
  }

  private applySnapshot(snap: SnapshotMessage): void {
    this.rows.clear();
    for (const t of snap.items) {
      this.rows.set(t.symbol, this.toScanner(t));
    }
    this.emit();
    this.snapshotApplied = true;
    this.lastSeq = Number(snap.snapshot_seq || 0);

    if (this.preSnapshotBuffer.length) {
      this.preSnapshotBuffer
        .sort((a, b) => Number(a.seq ?? 0) - Number(b.seq ?? 0))
        .forEach(e => { if ((e.seq ?? 0) > this.lastSeq) this.incoming$.next(e); });
      this.preSnapshotBuffer = [];
    }
  }

  private applyBatch(batch: (IBroadcastTrade | RemoveEvent)[]): void {
    if (batch.length === 0) return;

    // Orden por si el buffer juntó desordenados
    batch.sort((a, b) => Number(a.seq ?? 0) - Number(b.seq ?? 0));

    // Chequeo de gap UNA sola vez por batch
    const firstSeq = Number(batch[0].seq ?? 0);
    if (this.lastSeq && firstSeq > this.lastSeq + 1) {
      this.requestReplay();
      // Igual aplicamos el batch para no perder updates
    }

    let changed = false;
    let maxSeqSeen = this.lastSeq;

    for (const evt of batch) {
      const seq = Number(evt.seq ?? 0);
      if (seq && seq <= this.lastSeq) continue;

      if (this.isRemoveEvent(evt)) {
        if (this.rows.delete(evt.symbol)) changed = true;
        if (seq) maxSeqSeen = Math.max(maxSeqSeen, seq);
        continue;
      }

      if (this.isBroadcastTrade(evt)) {
        const r = this.toScanner(evt);
        this.rows.set(r.symbol, r);
        changed = true;
        if (seq) maxSeqSeen = Math.max(maxSeqSeen, seq);
      }
    }

    // Avanza lastSeq una sola vez
    this.lastSeq = maxSeqSeen;
    if (changed) this.emit();
  }

  private toScanner(tr: IBroadcastTrade): IMicroCapsScanner {
    return {
      symbol: tr.symbol,
      price: +tr.price,
      gap: +(tr.gap_pct ?? 0),
      volume: +(tr.volume_today ?? 0),
      marketCap: +(tr.market_cap ?? 0),
    };
  }

  private emit(): void {
    // mantienes tu filtro de gap > 0 (si lo querés)
    const positives = Array.from(this.rows.values()).filter(r => r.gap > 0);
    this.state$.next(positives);
  }

  private requestReplay(): void {
    try {
      this.socket$?.next({ type: 'replay', from_seq: this.lastSeq } as unknown as WsEvent);
    } catch {}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.socket$) this.socket$.complete();
  }
}
