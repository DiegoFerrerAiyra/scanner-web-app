import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, retry, Subject, takeUntil, timer } from 'rxjs';
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
  private buffer: (IBroadcastTrade | RemoveEvent)[] = [];

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket$ = webSocket<WsEvent>({
      url: environment.WS_URL,
      deserializer: (e: MessageEvent<string>): WsEvent => {
        try {
          return JSON.parse(e.data) as unknown as WsEvent;
        } catch {
          return [] as IBroadcastTrade[];
        }
      }
    });

    this.socket$
      .pipe(
        retry({ delay: (_err, n) => timer(Math.min(2 ** n * 1000, 30000)) }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (msg: WsEvent) => this.handleMessage(msg),
        error: (err: unknown) => {
          // eslint-disable-next-line no-console
          console.error('[WS error]', (err as { toString?: () => string })?.toString?.() ?? err);
        }
      });
  }

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

  private handleMessage(msg: WsEvent): void {
    if (this.isSnapshotMessage(msg)) {
      this.applySnapshot(msg);
      return;
    }

    if (this.isWsEventArray(msg)) {
      const arr = msg;
      arr.sort((a, b) => (Number((a as IBroadcastTrade | RemoveEvent).seq ?? 0) - Number((b as IBroadcastTrade | RemoveEvent).seq ?? 0)));
      for (const e of arr) this.applyEvent(e);
      return;
    }

    if (this.isRemoveEvent(msg) || this.isBroadcastTrade(msg)) {
      if (!this.snapshotApplied) {
        this.buffer.push(msg);
        return;
      }
      this.applyEvent(msg);
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

    if (this.buffer.length) {
      this.buffer.sort((a, b) => Number((a.seq ?? 0)) - Number((b.seq ?? 0)));
      for (const e of this.buffer) {
        const seq = Number(e.seq ?? 0);
        if (seq > this.lastSeq) this.applyEvent(e);
      }
      this.buffer = [];
    }
  }

  private applyEvent(evt: IBroadcastTrade | RemoveEvent): void {
    const seq = Number((evt.seq ?? 0));
    if (seq && seq <= this.lastSeq) return;
    if (seq && this.lastSeq && seq > this.lastSeq + 1) {
      this.requestReplay();
    }

    if (this.isRemoveEvent(evt)) {
      this.rows.delete(evt.symbol);
      this.emit();
      this.lastSeq = Math.max(this.lastSeq, seq);
      return;
    }

    if (this.isBroadcastTrade(evt)) {
      const row = this.toScanner(evt);
      this.rows.set(row.symbol, row);
      this.emit();
      this.lastSeq = Math.max(this.lastSeq, seq);
    }
  }

  private toScanner(tr: IBroadcastTrade): IMicroCapsScanner {
    return {
      symbol: tr.symbol,
      price: Number(tr.price),
      gap: Number(tr.gap_pct ?? 0),
      volume: Number(tr.volume_today ?? 0),
      marketCap: Number(tr.market_cap ?? 0)
    };
  }

  private emit(): void {
    const positives = Array.from(this.rows.values()).filter(r => r.gap > 0);
    this.state$.next(positives);
  }

  private requestReplay(): void {
    try {
      this.socket$?.next({ type: 'replay', from_seq: this.lastSeq } as unknown as WsEvent);
    } catch { }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
