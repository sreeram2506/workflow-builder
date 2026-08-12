import { CdkDrag, CdkDragEnd, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import { iconPathForType } from '../../core/domain/node-visuals';
import {
  PALETTE_CATEGORIES,
  PALETTE_ITEMS,
  filterPaletteItems,
  type PaletteCategory,
  type PaletteCategoryId,
  type PaletteItem,
} from '../../core/domain/palette.catalog';
import { screenToWorld } from '../../core/domain/viewport.math';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { CANVAS_DROP_LIST_ID, PALETTE_DROP_LIST_ID } from './palette-dnd.ids';

/** Shared CDK drop-list ids for palette ↔ canvas connection. */
export { CANVAS_DROP_LIST_ID, PALETTE_DROP_LIST_ID } from './palette-dnd.ids';

@Component({
  selector: 'wb-left-sidebar',
  standalone: true,
  imports: [FormsModule, CdkDropList, CdkDrag],
  template: `
    <div class="nodes-library-root" [class.is-collapsed]="collapsed()">
      <button
        type="button"
        class="library-chip"
        (click)="collapsedChange.emit(false)"
        aria-label="Open Nodes Library"
        [attr.tabindex]="collapsed() ? 0 : -1"
        [attr.aria-hidden]="!collapsed()"
      >
        <span class="chip-label">Nodes Library</span>
      </button>

      <aside class="library-panel" aria-label="Nodes Library" [attr.aria-hidden]="collapsed()">
        <header class="library-header">
          <h2>Nodes Library</h2>
          <button
            type="button"
            class="icon-btn"
            (click)="collapsedChange.emit(true)"
            aria-label="Collapse Nodes Library"
            title="Collapse"
            [attr.tabindex]="collapsed() ? -1 : 0"
          >
            ×
          </button>
        </header>

        @if (catalogError()) {
          <p class="catalog-banner" role="status">{{ catalogError() }}</p>
        }
        @if (catalogLoading()) {
          <p class="catalog-banner" role="status">Loading tasks…</p>
        }

        <div class="search-row">
          <label class="sr-only" for="palette-search">Search nodes</label>
          <input
            id="palette-search"
            type="search"
            class="search-input"
            placeholder="Search nodes…"
            [ngModel]="searchInput()"
            (ngModelChange)="onSearchInput($event)"
            autocomplete="off"
          />
          @if (searchInput()) {
            <button type="button" class="clear-btn" (click)="clearSearch()" aria-label="Clear search">
              Clear
            </button>
          }
        </div>

        <div
          class="library-list"
          role="list"
          cdkDropList
          [id]="paletteListId"
          [cdkDropListData]="dragProxy"
          [cdkDropListSortingDisabled]="true"
          [cdkDropListEnterPredicate]="rejectEnter"
        >
          @for (cat of categories(); track cat.id) {
            @if (itemsForCategory(cat.id); as catItems) {
              @if (catItems.length > 0) {
                <section class="category">
                  <button
                    type="button"
                    class="category-toggle"
                    [attr.aria-expanded]="!isCollapsed(cat.id)"
                    (click)="toggleCategory(cat.id)"
                  >
                    <span class="chevron" [class.collapsed]="isCollapsed(cat.id)" aria-hidden="true">▾</span>
                    {{ cat.label }}
                    <span class="cat-count">{{ catItems.length }}</span>
                  </button>
                  @if (!isCollapsed(cat.id)) {
                    <div class="category-items">
                      @for (item of catItems; track item.key) {
                        <div
                          class="node-card"
                          role="listitem"
                          tabindex="0"
                          cdkDrag
                          [cdkDragData]="item.key"
                          (cdkDragStarted)="onDragStarted()"
                          (cdkDragEnded)="onDragEnded($event, item)"
                          (click)="onItemActivate(item, $event)"
                          (keydown)="onItemKeydown(item, $event)"
                          [attr.aria-label]="'Add ' + item.label + ' node'"
                        >
                          <div class="node-icon" [attr.data-icon]="item.type" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                              <path [attr.d]="iconPath(item.type)" />
                            </svg>
                          </div>
                          <div class="node-text">
                            <div class="node-title">{{ item.label }}</div>
                            <div class="node-desc">{{ item.description }}</div>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </section>
              }
            }
          }
          @if (filteredItems().length === 0 && !catalogLoading()) {
            <p class="empty-hint">No nodes match “{{ debouncedQuery() }}”.</p>
          }
        </div>

        <footer class="library-footer">
          <button
            type="button"
            class="templates-btn"
            disabled
            title="Coming in later phase"
            aria-label="Templates (coming later)"
          >
            Templates
          </button>
        </footer>
      </aside>
    </div>
  `,
  styles: `
    .nodes-library-root {
      --wb-lib-ease: cubic-bezier(0.32, 0.72, 0, 1);
      --wb-lib-duration: 280ms;
      position: absolute;
      top: 88px;
      left: 16px;
      bottom: 16px;
      z-index: 5;
      width: 280px;
      max-width: min(300px, calc(100% - 32px));
      pointer-events: none;
    }
    .nodes-library-root.is-collapsed {
      width: max-content;
    }
    .library-chip {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.55rem 0.9rem;
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      background: var(--wb-bg-elevated);
      color: var(--wb-text);
      box-shadow: var(--wb-shadow-soft);
      cursor: pointer;
      font-weight: 600;
      pointer-events: all;
      opacity: 0;
      transform: translateX(-8px);
      transition:
        opacity 160ms ease,
        transform var(--wb-lib-duration) var(--wb-lib-ease);
      z-index: 1;
    }
    .nodes-library-root.is-collapsed .library-chip {
      opacity: 1;
      transform: translateX(0);
      transition-delay: 90ms;
    }
    .nodes-library-root:not(.is-collapsed) .library-chip {
      pointer-events: none;
      transition-delay: 0ms;
    }
    .library-panel {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 12px;
      box-shadow: var(--wb-shadow-soft);
      overflow: hidden;
      pointer-events: all;
      transform: translate3d(0, 0, 0);
      opacity: 1;
      transition:
        transform var(--wb-lib-duration) var(--wb-lib-ease),
        opacity 180ms ease;
      will-change: transform;
    }
    .nodes-library-root.is-collapsed .library-panel {
      transform: translate3d(calc(-100% - 20px), 0, 0);
      opacity: 0;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .library-chip,
      .library-panel {
        transition: none;
      }
    }
    .library-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 0.9rem 0.65rem;
      flex-shrink: 0;
    }
    h2 { margin: 0; font-size: 1rem; font-weight: 700; }
    .icon-btn {
      width: 28px; height: 28px; border: 1px solid var(--wb-border);
      border-radius: 6px; background: transparent; color: var(--wb-text); cursor: pointer;
    }
    .catalog-banner {
      margin: 0 0.75rem 0.5rem;
      padding: 0.45rem 0.55rem;
      border-radius: 8px;
      border: 1px solid var(--wb-border);
      background: color-mix(in srgb, var(--wb-danger, #c44) 12%, transparent);
      color: var(--wb-text-muted);
      font-size: 0.72rem;
      line-height: 1.35;
    }
    .search-row { display: flex; gap: 0.4rem; padding: 0 0.75rem 0.65rem; flex-shrink: 0; }
    .search-input {
      flex: 1; min-width: 0; padding: 0.45rem 0.6rem; border: 1px solid var(--wb-border);
      border-radius: 8px; background: var(--wb-bg-canvas); color: var(--wb-text); font-size: 0.85rem;
    }
    .clear-btn {
      border: 1px solid var(--wb-border); border-radius: 8px; background: transparent;
      color: var(--wb-text-muted); padding: 0 0.55rem; font-size: 0.75rem; cursor: pointer;
    }
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }
    .library-list {
      flex: 1 1 auto; min-height: 0; overflow: auto; padding: 0.25rem 0.75rem 0.5rem;
      display: flex; flex-direction: column; gap: 0.35rem;
    }
    .category-toggle {
      display: flex; align-items: center; gap: 0.35rem; width: 100%; padding: 0.35rem 0.15rem;
      border: none; background: transparent; color: var(--wb-text-muted); font-size: 0.72rem;
      font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer;
    }
    .chevron { display: inline-block; transition: transform 0.12s ease; font-size: 0.65rem; }
    .chevron.collapsed { transform: rotate(-90deg); }
    .cat-count { margin-left: auto; opacity: 0.7; font-weight: 600; }
    .category-items { display: flex; flex-direction: column; gap: 0.55rem; padding-bottom: 0.35rem; }
    .node-card {
      display: flex; gap: 0.7rem; align-items: flex-start; padding: 0.65rem 0.7rem;
      border: 1px solid var(--wb-border); border-radius: 10px; background: var(--wb-bg-elevated);
      flex-shrink: 0; cursor: grab; outline: none;
    }
    .node-card:focus-visible {
      border-color: var(--wb-accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--wb-accent) 35%, transparent);
    }
    .node-icon {
      width: 36px; height: 36px; border-radius: 8px; background: var(--wb-icon-well);
      color: var(--wb-accent); display: grid; place-items: center; flex-shrink: 0;
    }
    .node-title { font-weight: 700; font-size: 0.92rem; line-height: 1.2; }
    .node-desc { margin-top: 0.15rem; font-size: 0.78rem; color: var(--wb-text-muted); line-height: 1.35; }
    .empty-hint { margin: 0.75rem 0.25rem; font-size: 0.82rem; color: var(--wb-text-muted); }
    .library-footer { padding: 0.65rem 0.75rem 0.85rem; flex-shrink: 0; border-top: 1px solid var(--wb-border); }
    .templates-btn {
      width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--wb-border); border-radius: 10px;
      background: var(--wb-bg-elevated); color: var(--wb-text-muted); font-weight: 600; cursor: not-allowed;
    }
    .cdk-drag-preview { box-sizing: border-box; border-radius: 10px; box-shadow: var(--wb-shadow-soft); opacity: 0.92; }
    .cdk-drag-placeholder { opacity: 0.35; }
  `,
})
export class LeftSidebarComponent {
  private readonly facade = inject(WorkflowFacade);
  private readonly catalogApi = inject(EnsoTaskCatalogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly search$ = new Subject<string>();

  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();

  readonly paletteListId = PALETTE_DROP_LIST_ID;
  readonly canvasListId = CANVAS_DROP_LIST_ID;
  readonly dragProxy: string[] = [];
  readonly rejectEnter = (): boolean => false;

  readonly searchInput = signal('');
  readonly debouncedQuery = signal('');
  readonly catalogLoading = signal(true);
  readonly catalogError = signal<string | null>(null);
  readonly categories = signal<PaletteCategory[]>([...PALETTE_CATEGORIES]);
  readonly allItems = signal<PaletteItem[]>([...PALETTE_ITEMS]);
  readonly filteredItems = signal<PaletteItem[]>([...PALETTE_ITEMS]);
  readonly collapsedCategories = signal<Record<string, boolean>>({});

  private dragActive = false;

  constructor() {
    this.search$.pipe(debounceTime(150), takeUntilDestroyed(this.destroyRef)).subscribe((q) => {
      this.debouncedQuery.set(q);
      this.filteredItems.set(filterPaletteItems(this.allItems(), q));
    });

    this.catalogApi
      .loadCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.catalogLoading.set(false);
        this.catalogError.set(result.error);
        this.categories.set(result.categories);
        this.allItems.set(result.items);
        this.filteredItems.set(filterPaletteItems(result.items, this.debouncedQuery()));
        const collapsed: Record<string, boolean> = {};
        for (const cat of result.categories) {
          collapsed[cat.id] = false;
        }
        this.collapsedCategories.set(collapsed);
      });
  }

  onSearchInput(value: string): void {
    this.searchInput.set(value);
    this.search$.next(value);
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.search$.next('');
  }

  itemsForCategory(id: PaletteCategoryId): PaletteItem[] {
    return this.filteredItems().filter((i) => i.categoryId === id);
  }

  iconPath(type: PaletteItem['type']): string {
    return iconPathForType(type);
  }

  isCollapsed(id: PaletteCategoryId): boolean {
    return !!this.collapsedCategories()[id];
  }

  toggleCategory(id: PaletteCategoryId): void {
    this.collapsedCategories.update((cur) => ({ ...cur, [id]: !cur[id] }));
  }

  onDragStarted(): void {
    this.dragActive = true;
  }

  onDragEnded(event: CdkDragEnd, item: PaletteItem): void {
    try {
      const dragged = Math.hypot(event.distance.x, event.distance.y) >= 5;
      if (dragged) {
        const ev = event.event;
        const clientX = 'clientX' in ev ? ev.clientX : 0;
        const clientY = 'clientY' in ev ? ev.clientY : 0;
        const canvas = document.getElementById(CANVAS_DROP_LIST_ID);
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const over =
            rect.width > 0 &&
            rect.height > 0 &&
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom;
          if (over) {
            const screen = { x: clientX - rect.left, y: clientY - rect.top };
            this.facade.createNodeFromPaletteItem(
              item,
              screenToWorld(screen, this.facade.viewport()),
            );
          }
        }
      }
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Drag create error');
    } finally {
      queueMicrotask(() => {
        this.dragActive = false;
      });
    }
  }

  onItemActivate(item: PaletteItem, event: MouseEvent): void {
    if (this.dragActive) {
      return;
    }
    event.preventDefault();
    this.facade.createNodeAtViewportCenterFromItem(item);
  }

  onItemKeydown(item: PaletteItem, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.facade.createNodeAtViewportCenterFromItem(item);
    }
  }
}
