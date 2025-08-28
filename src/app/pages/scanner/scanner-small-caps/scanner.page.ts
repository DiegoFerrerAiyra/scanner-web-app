import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil, auditTime, shareReplay } from 'rxjs';
import { ScannerApi } from '@modules/scanner/scanner-small-caps/scanner.api';
import { MicrocapsService } from '@core/apis/microcaps.service';
import { IMicroCapsScanner } from './models/interfaces/searchUsers.interface';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'mdk-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
  providers: [ScannerApi],
  changeDetection: ChangeDetectionStrategy.OnPush, // render only on input/observable changes
})
export class ScannerComponent implements OnInit {

  //#region DEPENDENCIES
  private readonly microCapsService = inject(MicrocapsService);
  //#endregion

  //#region STREAMS (UI-coalesced)
  /**
   * UI-friendly stream: coalesce emissions to ~60fps.
   * auditTime(16) emits the latest value within ~16ms windows, avoiding excessive re-renders.
   */
  public readonly microCapsView$ = this.microCapsService.microCaps$.pipe(
    auditTime(16),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  //#endregion

  //#region PROPERTIES
  public expandedRows: expandedRows = {};
  public isExpanded = false;

  private destroy$ = new Subject<void>();
  private lastSnapshot = new Map<string, string>();   // compact signature per row
  private flashing = new Set<string>();               // symbols currently flashing
  private timers = new Map<string, any>();            // timeouts per symbol
  //#endregion

  //#region LIFECYCLE
  ngOnInit(): void {
    // Subscribe only to compute diffs/flash; template binds to microCapsView$ via async pipe.
    this.microCapsView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows: IMicroCapsScanner[] | null | undefined) => {
        if (!rows || rows.length === 0) return;

        for (const r of rows) {
          const key = r.symbol;
          // Build a small signature based on fields we want to detect changes for.
          // Keep numbers as-is to avoid string formatting overhead in hot path.
          const sig = `${r.price}|${r.gap}|${r.volume}`;

          const prev = this.lastSnapshot.get(key);
          if (prev !== undefined && prev !== sig) {
            this.triggerFlash(key);
          }
          this.lastSnapshot.set(key, sig);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clear any pending timeouts to avoid leaks
    for (const t of this.timers.values()) {
      clearTimeout(t);
    }
    this.timers.clear();
  }
  //#endregion

  //#region FLASH LOGIC
  /** Returns true if the given symbol is currently flashing. */
  isFlashing(symbol: string): boolean {
    return this.flashing.has(symbol);
  }

  /** Triggers a short flash on the given symbol row. */
  private triggerFlash(symbol: string): void {
    // Clear previous timer if a new update comes in quickly
    const prevTimer = this.timers.get(symbol);
    if (prevTimer) clearTimeout(prevTimer);

    this.flashing.add(symbol);
    const timer = setTimeout(() => {
      this.flashing.delete(symbol);
      this.timers.delete(symbol);
    }, 800); // match your CSS animation duration

    this.timers.set(symbol, timer);
  }
  //#endregion

  //#region NGFOR TRACKBY
  /** Track rows by symbol so Angular only updates changed rows. */
  trackBySymbol = (_: number, r: IMicroCapsScanner) => r.symbol;
  //#endregion
}
