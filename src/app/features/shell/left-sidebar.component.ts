import { CdkDrag, CdkDragEnd, CdkDropList } from '@angular/cdk/drag-drop';
import {
  Component,
  DestroyRef,
  HostListener,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import type { CatalogLoadMode, CatalogLoadOptions } from '../../core/data/catalog.types';
import {
  accentTokenForType,
  iconPathForType,
  initialsFromLabel,
  labelUsesTwoLines,
  logicShapeKind,
} from '../../core/domain/node-visuals';
import type { NodeType } from '../../core/domain/workflow.models';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  filterPaletteItems,
  type PaletteCategory,
  type PaletteCategoryId,
  type PaletteItem,
} from '../../core/domain/palette.catalog';
import { featuredLogicItems, sanitizeHostPaletteItems } from '../../core/domain/palette-host.helpers';
import {
  SIDEBAR_WIDTH_LEFT_DEFAULT,
  clampSidebarWidth,
} from '../../core/domain/sidebar-width';
import { screenToWorld } from '../../core/domain/viewport.math';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { UiConfigService } from '../../core/ui-config';
import type { DefaultAgentCard } from '../../core/ui-config/ui-features.types';
import {
  CANVAS_DROP_LIST_ID,
  FEATURED_PALETTE_DROP_LIST_ID,
  PALETTE_DROP_LIST_ID,
} from './palette-dnd.ids';

/** Shared CDK drop-list ids for palette ↔ canvas connection. */
export {
  CANVAS_DROP_LIST_ID,
  FEATURED_PALETTE_DROP_LIST_ID,
  PALETTE_DROP_LIST_ID,
} from './palette-dnd.ids';

@Component({
  selector: 'wb-left-sidebar',
  standalone: true,
  imports: [FormsModule, CdkDropList, CdkDrag],
  template: `
    <div
      class="nodes-library-root"
      [class.is-collapsed]="collapsed()"
      [style.width.px]="collapsed() ? null : panelWidth()"
      [style.top.px]="facade.chromeInsetTop()"
      data-testid="nodes-library-root"
    >
      <aside class="library-panel" [attr.aria-label]="libraryTitle()">
        <header class="library-header">
          <h2>{{ libraryTitle() }}</h2>
          <button
            type="button"
            class="icon-btn header-toggle"
            (click)="collapsedChange.emit(!collapsed())"
            [attr.aria-expanded]="!collapsed()"
            [attr.aria-label]="collapsed() ? 'Expand ' + libraryTitle() : 'Collapse ' + libraryTitle()"
            [attr.title]="'Toggle ' + libraryTitle()"
            data-testid="nodes-library-chip"
          >
            <svg class="chip-icon" viewBox="3 4 18 16" aria-hidden="true" focusable="false">
              <rect
                x="3.5"
                y="4.5"
                width="17"
                height="15"
                rx="2.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path fill="none" stroke="currentColor" stroke-width="1.5" d="M9.5 4.5V19.5" />
            </svg>
          </button>
        </header>

        @if (!collapsed()) {
          <hr class="panel-rule" />
          <div class="library-body">
            @if (catalogError()) {
              <p class="catalog-banner" role="status">{{ catalogError() }}</p>
            }
            @if (catalogLoading()) {
              <p class="catalog-banner" role="status">
                {{ paletteScope() === 'solution' ? 'Loading agents…' : 'Loading tasks…' }}
              </p>
            }
            @if (catalogEmptyRemote() && !catalogLoading()) {
              <p class="empty-hint" data-testid="palette-empty-remote">
                {{
                  paletteScope() === 'solution'
                    ? 'No agents from the catalog yet.'
                    : 'No skills from the catalog yet.'
                }}
              </p>
            } @else if (!catalogEmptyRemote()) {
            <!-- Featured logic shapes: solution + agent skills -->
            @if (logicShapeItems(); as featuredItems) {
            @if (featuredItems.length) {
            <div
              class="featured-strip"
              cdkDropList
              [id]="featuredListId"
              [cdkDropListData]="featuredDragProxy"
              [cdkDropListSortingDisabled]="true"
              [cdkDropListEnterPredicate]="rejectEnter"
            >
            <div class="logic-shapes-row" role="list" aria-label="Logic shapes">
              @for (item of featuredItems; track item.key) {
                <div
                  class="logic-shape-btn"
                  role="listitem"
                  tabindex="0"
                  cdkDrag
                  [cdkDragData]="item.key"
                  [cdkDragDisabled]="facade.editorMode() === 'view'"
                  (cdkDragStarted)="onDragStarted()"
                  (cdkDragEnded)="onDragEnded($event, item)"
                  (click)="onItemActivate(item, $event)"
                  (keydown)="onItemKeydown(item, $event)"
                  [attr.aria-label]="'Add ' + item.label + ' node'"
                  [style.--accent]="accentFor(item.type)"
                  [title]="item.label"
                  [attr.data-testid]="
                    featuredLogicType(item.type)
                      ? 'logic-shape-' + item.type
                      : 'logic-shape-' + item.key
                  "
                >
                  @if (showIconImg(item)) {
                    <img
                      class="palette-icon-img featured"
                      [src]="item.iconUrl || ''"
                      alt=""
                      draggable="false"
                      data-testid="palette-icon-img"
                      (error)="onPaletteIconError(item)"
                    />
                  } @else if (item.iconPath) {
                    <svg class="shape-preview" viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                      <path [attr.d]="item.iconPath" />
                    </svg>
                  } @else if (shapeKind(item.type); as kind) {
                    <svg class="shape-preview" viewBox="0 0 100 100" width="40" height="40">
                      @switch (kind) {
                        @case ('rhombus') {
                          <polygon
                            class="preview-fill"
                            points="50,6 94,50 50,94 6,50"
                            stroke-linejoin="round"
                          />
                          <g
                            class="preview-glyph"
                            transform="translate(50 50)"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M0 10 L0 -17" />
                            <path d="M0 -17 l-3.6 4.2 M0 -17 l3.6 4.2" />
                            <path d="M0 0 L-17 0" />
                            <path d="M-17 0 l4.2 -3.2 M-17 0 l4.2 3.2" />
                            <path d="M0 0 L17 0" />
                            <path d="M17 0 l-4.2 -3.2 M17 0 l-4.2 3.2" />
                          </g>
                        }
                        @case ('router') {
                          <polygon
                            class="preview-fill"
                            points="18,8 82,8 96,50 82,92 18,92 4,50"
                            stroke-linejoin="round"
                          />
                          <g
                            class="preview-glyph"
                            transform="translate(50 50) scale(1.05)"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M-13 0 H0" />
                            <path d="M0 0 L12 -11" />
                            <path d="M0 0 L12 11" />
                            <path d="M12 -11 l-5.2 0.7 M12 -11 l-0.7 5.2" />
                            <path d="M12 11 l-0.7 -5.2 M12 11 l-5.2 -0.7" />
                          </g>
                        }
                        @case ('repeater') {
                          <rect
                            class="preview-fill"
                            x="4"
                            y="4"
                            width="92"
                            height="92"
                            rx="20"
                            ry="20"
                          />
                          <g
                            class="preview-glyph"
                            transform="translate(50 50) scale(1.05)"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M-11 7 A13 13 0 0 1 7.5 -10.6" stroke-linecap="butt" />
                            <path d="M7.5 -10.6 l-4.2 -3.2 M7.5 -10.6 l-4.2 3.2" />
                            <g transform="rotate(180)">
                              <path d="M-11 7 A13 13 0 0 1 7.5 -10.6" stroke-linecap="butt" />
                              <path d="M7.5 -10.6 l-4.2 -3.2 M7.5 -10.6 l-4.2 3.2" />
                            </g>
                          </g>
                        }
                      }
                    </svg>
                  }
                  <span class="logic-shape-label">{{ item.label }}</span>
                </div>
              }
            </div>
            </div>
            }
            }

            @if (paletteScope() === 'solution') {
              @if (defaultAgentItems().length) {
                <div
                  class="blank-agent-row"
                  role="list"
                  aria-label="Default agents"
                  data-testid="default-agent-strip"
                  cdkDropList
                  [id]="blankAgentListId"
                  [cdkDropListData]="blankAgentDragProxy"
                  [cdkDropListSortingDisabled]="true"
                  [cdkDropListEnterPredicate]="rejectEnter"
                >
                  @for (item of defaultAgentItems(); track item.key) {
                    <div
                      class="node-card blank-agent-card"
                      role="listitem"
                      tabindex="0"
                      cdkDrag
                      [cdkDragData]="item.key"
                      [cdkDragDisabled]="facade.editorMode() === 'view'"
                      (cdkDragStarted)="onDragStarted()"
                      (cdkDragEnded)="onDragEnded($event, item)"
                      (click)="onItemActivate(item, $event)"
                      (keydown)="onItemKeydown(item, $event)"
                      [attr.aria-label]="'Add ' + item.label + ' node'"
                      [attr.data-testid]="'default-agent-card-' + item.key"
                    >
                      <div class="node-icon" [attr.data-icon]="item.type" aria-hidden="true">
                        @if (showIconImg(item)) {
                          <img
                            class="palette-icon-img"
                            [src]="item.iconUrl || ''"
                            alt=""
                            draggable="false"
                            data-testid="palette-icon-img"
                            (error)="onPaletteIconError(item)"
                          />
                        } @else {
                          <span class="palette-initials" data-testid="palette-initials">{{
                            initialsFor(item)
                          }}</span>
                        }
                      </div>
                      <div class="node-text" [class.no-desc]="!item.description.trim()">
                        <div
                          class="node-title"
                          [class.wrap-2]="labelWraps(item.label)"
                          [attr.title]="item.label"
                        >
                          {{ item.label }}
                        </div>
                        @if (item.description.trim()) {
                          <div class="node-desc" [attr.title]="item.description">{{ item.description }}</div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <div class="search-row">
                <label class="sr-only" for="palette-search-agents">Search agents</label>
                <input
                  id="palette-search-agents"
                  type="search"
                  class="search-input"
                  placeholder="Search agents…"
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

              @if (solutionAgentItems().length) {
                <h3 class="library-section-title" data-testid="solution-agents-heading">Agents</h3>
                <div
                  class="library-list"
                  role="list"
                  aria-label="Solution agents"
                  cdkDropList
                  [id]="paletteListId"
                  [cdkDropListData]="dragProxy"
                  [cdkDropListSortingDisabled]="true"
                  [cdkDropListEnterPredicate]="rejectEnter"
                >
                  @for (item of solutionAgentItems(); track item.key) {
                    <div
                      class="node-card"
                      role="listitem"
                      tabindex="0"
                      cdkDrag
                      [cdkDragData]="item.key"
                      [cdkDragDisabled]="facade.editorMode() === 'view'"
                      (cdkDragStarted)="onDragStarted()"
                      (cdkDragEnded)="onDragEnded($event, item)"
                      (click)="onItemActivate(item, $event)"
                      (keydown)="onItemKeydown(item, $event)"
                      [attr.aria-label]="'Add ' + item.label + ' agent'"
                      [attr.data-testid]="'solution-agent-' + item.key"
                    >
                      <div class="node-icon" [attr.data-icon]="item.type" aria-hidden="true">
                        @if (showIconImg(item)) {
                          <img
                            class="palette-icon-img"
                            [src]="item.iconUrl || ''"
                            alt=""
                            draggable="false"
                            data-testid="palette-icon-img"
                            (error)="onPaletteIconError(item)"
                          />
                        } @else {
                          <span class="palette-initials" data-testid="palette-initials">{{
                            initialsFor(item)
                          }}</span>
                        }
                      </div>
                      <div class="node-text" [class.no-desc]="!item.description.trim()">
                        <div
                          class="node-title"
                          [class.wrap-2]="labelWraps(item.label)"
                          [attr.title]="item.label"
                        >
                          {{ item.label }}
                        </div>
                        @if (item.description.trim()) {
                          <div class="node-desc" [attr.title]="item.description">{{ item.description }}</div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              @if (!catalogLoading() && !solutionAgentItems().length) {
                <p class="empty-hint">No agents loaded yet.</p>
              }
            } @else {
              <div class="search-row">
                <label class="sr-only" for="palette-search">Search skills</label>
                <input
                  id="palette-search"
                  type="search"
                  class="search-input"
                  placeholder="Search skills…"
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
                                [cdkDragDisabled]="facade.editorMode() === 'view'"
                                (cdkDragStarted)="onDragStarted()"
                                (cdkDragEnded)="onDragEnded($event, item)"
                                (click)="onItemActivate(item, $event)"
                                (keydown)="onItemKeydown(item, $event)"
                                [attr.aria-label]="'Add ' + item.label + ' node'"
                                [attr.data-testid]="'skill-palette-' + item.key"
                              >
                                <div class="node-icon" [attr.data-icon]="item.type" aria-hidden="true">
                                  @if (showIconImg(item)) {
                                    <img
                                      class="palette-icon-img"
                                      [src]="item.iconUrl || ''"
                                      alt=""
                                      draggable="false"
                                      data-testid="palette-icon-img"
                                      (error)="onPaletteIconError(item)"
                                    />
                                  } @else {
                                    <span class="palette-initials" data-testid="palette-initials">{{
                                      initialsFor(item)
                                    }}</span>
                                  }
                                </div>
                                <div class="node-text" [class.no-desc]="!item.description.trim()">
                                  <div
                                    class="node-title"
                                    [class.wrap-2]="labelWraps(item.label)"
                                    [attr.title]="item.label"
                                  >
                                    {{ item.label }}
                                  </div>
                                  @if (item.description.trim()) {
                                    <div class="node-desc" [attr.title]="item.description">{{ item.description }}</div>
                                  }
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
                  <p class="empty-hint">No skills match “{{ debouncedQuery() }}”.</p>
                }
              </div>
            }
            }
          </div>
        }
      </aside>
      @if (!collapsed()) {
        <div
          class="resize-grip"
          role="separator"
          aria-orientation="vertical"
          [attr.aria-label]="'Resize ' + libraryTitle()"
          title="Drag to resize"
          (pointerdown)="onResizeStart($event)"
        ></div>
      }
    </div>
  `,
  styles: `
    /* Match app.workflowbuilder.io sidebar: collapsed = min-content/auto; expanded = 100%/fixed width */
    .nodes-library-root {
      position: absolute;
      top: 88px; /* overridden by [style.top.px] from chrome inset */
      left: 16px;
      bottom: 16px;
      z-index: 5;
      width: auto;
      pointer-events: none;
    }
    .nodes-library-root:not(.is-collapsed) {
      /* width from [style.width.px] / panelWidth */
      max-width: none;
    }
    .nodes-library-root.is-collapsed {
      bottom: auto;
    }
    .resize-grip {
      position: absolute;
      top: 0;
      right: -4px;
      bottom: 0;
      width: 8px;
      cursor: col-resize;
      pointer-events: all;
      z-index: 6;
    }
    .resize-grip::after {
      content: '';
      position: absolute;
      top: 20%;
      bottom: 20%;
      left: 3px;
      width: 2px;
      border-radius: 1px;
      background: color-mix(in srgb, var(--wb-border) 80%, transparent);
      opacity: 0;
      transition: opacity 120ms ease;
    }
    .resize-grip:hover::after,
    .nodes-library-root.is-resizing .resize-grip::after {
      opacity: 1;
      background: var(--wb-accent);
    }
    .library-panel {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      height: min-content;
      width: auto;
      box-sizing: border-box;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 12px;
      box-shadow: var(--wb-shadow-soft);
      overflow: hidden;
      pointer-events: all;
      padding: 0.75rem 0;
    }
    .nodes-library-root:not(.is-collapsed) .library-panel {
      height: 100%;
      width: 100%;
    }
    .library-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0 1rem;
      flex-shrink: 0;
      width: 100%;
      box-sizing: border-box;
    }
    .panel-rule {
      margin: 1.25rem 0 0;
      border: none;
      border-top: 1px solid var(--wb-border);
      width: 100%;
    }
    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
      line-height: 1.4;
    }
    .chip-icon {
      width: 14px;
      height: 14px;
      display: block;
      color: var(--wb-text);
    }
    .icon-btn {
      width: 24px;
      height: 24px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: var(--wb-text);
      cursor: pointer;
      display: grid;
      place-content: center;
      padding: 0;
      flex-shrink: 0;
    }
    .icon-btn.header-toggle:hover {
      border-color: var(--wb-border);
    }
    .library-body {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      padding: 1.25rem 1rem 0;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: hidden;
    }
    .featured-strip {
      flex-shrink: 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    /* Keep library slots occupied while dragging (copy onto canvas, never remove). */
    .featured-strip .cdk-drag-placeholder,
    .library-list .cdk-drag-placeholder {
      opacity: 1;
      background: transparent;
      border: 1px dashed var(--wb-border);
      box-sizing: border-box;
    }
    .featured-strip .cdk-drag-animating,
    .library-list .cdk-drag-animating {
      transition: none !important;
    }
    .logic-shapes-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.4rem;
      margin: 0 0 0.5rem;
      flex-shrink: 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .blank-agent-row {
      flex-shrink: 0;
      width: 100%;
      margin: 0 0 0.75rem;
      box-sizing: border-box;
    }
    .blank-agent-card {
      width: 100%;
    }
    .logic-shape-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      min-width: 0;
      max-width: 100%;
      padding: 0.4rem 0.2rem 0.35rem;
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      background: var(--wb-bg-elevated);
      color: var(--accent, var(--wb-accent));
      cursor: grab;
      box-sizing: border-box;
      outline: none;
      user-select: none;
      touch-action: none;
    }
    .logic-shapes-row .cdk-drag-placeholder {
      min-height: 4.25rem;
      border-radius: 10px;
    }
    .logic-shape-btn:hover {
      border-color: var(--wb-accent);
    }
    .logic-shape-btn:focus-visible {
      outline: 2px solid var(--wb-accent);
      outline-offset: 2px;
    }
    .logic-shape-label {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--wb-text);
      line-height: 1.2;
    }
    .catalog-banner {
      margin: 0 0 0.5rem;
      padding: 0.45rem 0.55rem;
      border-radius: 8px;
      border: 1px solid var(--wb-border);
      background: color-mix(in srgb, var(--wb-danger, #c44) 12%, transparent);
      color: var(--wb-text-muted);
      font-size: 0.72rem;
      line-height: 1.35;
    }
    .search-row { display: flex; gap: 0.4rem; padding: 0 0 0.65rem; flex-shrink: 0; }
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
      flex: 1 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0.25rem 0 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .library-section-title {
      margin: 0.45rem 0 0.15rem;
      padding: 0 0.15rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--wb-text-muted);
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
      display: flex;
      gap: 0.7rem;
      align-items: center;
      padding: 0.65rem 0.7rem;
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      background: var(--wb-bg-elevated);
      flex-shrink: 0;
      cursor: grab;
      outline: none;
      min-width: 0;
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      min-height: 3.1rem;
    }
    .node-card:focus-visible {
      border-color: var(--wb-accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--wb-accent) 35%, transparent);
    }
    .node-icon {
      width: 36px; height: 36px; border-radius: 8px; background: var(--wb-icon-well);
      color: var(--wb-accent); display: grid; place-items: center; flex-shrink: 0;
    }
    .palette-initials {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.02em;
      line-height: 1;
      color: var(--wb-accent);
      user-select: none;
    }
    .palette-icon-img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      display: block;
      pointer-events: none;
    }
    .palette-icon-img.featured {
      width: 40px;
      height: 40px;
    }
    .shape-preview {
      display: block;
      overflow: visible;
      flex-shrink: 0;
    }
    .preview-fill {
      fill: var(--wb-bg-elevated);
      stroke: var(--wb-border);
      stroke-width: 4;
    }
    .preview-glyph {
      color: var(--accent, var(--wb-accent));
    }
    .node-text { min-width: 0; flex: 1 1 auto; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
    .node-text.no-desc {
      justify-content: center;
      min-height: 36px;
    }
    .node-title {
      font-weight: 700;
      font-size: 0.92rem;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
    .node-title.wrap-2 {
      white-space: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
    }
    .node-text.no-desc .node-title {
      /* Vertically centered name when description is absent (agent cards). */
      margin: 0;
    }
    .node-desc {
      margin-top: 0.15rem;
      font-size: 0.78rem;
      color: var(--wb-text-muted);
      line-height: 1.35;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-word;
    }
    .empty-hint { margin: 0.75rem 0.25rem; font-size: 0.82rem; color: var(--wb-text-muted); }
    .cdk-drag-preview { box-sizing: border-box; border-radius: 10px; box-shadow: var(--wb-shadow-soft); opacity: 0.92; }
    .cdk-drag-placeholder { opacity: 0.35; }
  `,
})
export class LeftSidebarComponent {
  private readonly catalogApi = inject(EnsoTaskCatalogService);
  private readonly uiConfig = inject(UiConfigService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly search$ = new Subject<string>();
  private readonly catalogReload$ = new Subject<CatalogLoadMode>();
  readonly facade = inject(WorkflowFacade);

  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();
  readonly panelWidth = input(SIDEBAR_WIDTH_LEFT_DEFAULT);
  readonly panelWidthChange = output<number>();
  /**
   * solution = Agents Library (logic + default agents + catalog agents).
   * agent = Skills Library (logic + catalog for nested agent canvas).
   */
  readonly paletteScope = input<'solution' | 'agent'>('solution');
  /** Agent id when paletteScope is agent (route context). */
  readonly agentNodeId = input<string | null>(null);
  /** Unbound = omit (Enso/adapter). `[]` = empty-remote. */
  readonly palettes = input<PaletteItem[] | undefined>();
  /** Solution only. Unbound = JSON/provider. Present (incl. `[]`) replaces Blank Agent. */
  readonly defaultAgents = input<DefaultAgentCard[] | undefined>();

  libraryTitle(): string {
    return this.paletteScope() === 'agent' ? 'Skills Library' : 'Agents Library';
  }

  readonly paletteListId = PALETTE_DROP_LIST_ID;
  readonly featuredListId = FEATURED_PALETTE_DROP_LIST_ID;
  readonly blankAgentListId = 'wb-blank-agent-palette-list';
  readonly canvasListId = CANVAS_DROP_LIST_ID;
  /** Stable empty arrays so CDK never mutates the real catalog during drag. */
  readonly dragProxy: string[] = [];
  readonly featuredDragProxy: string[] = [];
  readonly blankAgentDragProxy: string[] = [];
  readonly rejectEnter = (): boolean => false;

  readonly searchInput = signal('');
  readonly debouncedQuery = signal('');
  readonly catalogLoading = signal(true);
  readonly catalogError = signal<string | null>(null);
  readonly catalogEmptyRemote = signal(false);
  readonly categories = signal<PaletteCategory[]>([]);
  readonly allItems = signal<PaletteItem[]>([]);
  readonly filteredItems = signal<PaletteItem[]>([]);
  readonly collapsedCategories = signal<Record<string, boolean>>({});
  readonly failedIconKeys = signal<ReadonlySet<string>>(new Set());

  private dragActive = false;
  private resizing = false;
  private resizeStartX = 0;
  private resizeStartWidth = SIDEBAR_WIDTH_LEFT_DEFAULT;

  @HostListener('document:pointermove', ['$event'])
  onDocPointerMove(event: PointerEvent): void {
    if (!this.resizing) {
      return;
    }
    const dx = event.clientX - this.resizeStartX;
    this.panelWidthChange.emit(
      clampSidebarWidth(this.resizeStartWidth + dx, window.innerWidth),
    );
  }

  @HostListener('document:pointerup')
  onDocPointerUp(): void {
    this.resizing = false;
  }

  onResizeStart(event: PointerEvent): void {
    if (this.collapsed()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.resizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartWidth = this.panelWidth();
  }

  constructor() {
    this.search$.pipe(debounceTime(150), takeUntilDestroyed(this.destroyRef)).subscribe((q) => {
      this.debouncedQuery.set(q);
      this.filteredItems.set(filterPaletteItems(this.allItems(), q));
    });
    this.catalogReload$
      .pipe(
        switchMap((mode) => {
          this.catalogLoading.set(true);
          const options: CatalogLoadOptions = { mode };
          const palettes = this.palettes();
          if (palettes !== undefined) {
            options.hostPalettes = palettes;
          }
          if (this.paletteScope() === 'solution') {
            const defaults = this.defaultAgents();
            if (defaults !== undefined) {
              options.hostDefaultAgents = defaults;
            }
          }
          return this.catalogApi.loadCatalog(options);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.catalogLoading.set(false);
        this.catalogError.set(result.error);
        this.catalogEmptyRemote.set(result.emptyRemote);
        this.failedIconKeys.set(new Set());
        this.categories.set(result.categories.filter((c) => c.id !== 'logic'));
        this.allItems.set(result.items);
        this.filteredItems.set(filterPaletteItems(result.items, this.debouncedQuery()));
        const collapsed: Record<string, boolean> = {};
        for (const cat of result.categories) {
          collapsed[cat.id] = false;
        }
        this.collapsedCategories.set(collapsed);
      });
    effect(() => {
      const scope = this.paletteScope();
      const palette = this.uiConfig.features().palette;
      void palette.solution.types;
      void palette.solution.defaultAgents;
      void palette.agent.types;
      void this.palettes();
      void this.defaultAgents();
      const mode: CatalogLoadMode = scope === 'solution' ? 'solution-agents' : 'agent-skills';
      untracked(() => this.catalogReload$.next(mode));
    });
  }

  /**
   * Solution Agents list: AIAgent cards only (excludes default-agent strip).
   * Properties schemas live on these rows (or optional `[properties]` by paletteKey).
   */
  solutionAgentItems(): PaletteItem[] {
    return this.filteredItems().filter(
      (i) => i.type === BLANK_AGENT_TYPE && i.origin !== 'default-agent',
    );
  }

  featuredLogicType(type: NodeType): boolean {
    return (FEATURED_PALETTE_TYPES as readonly string[]).includes(type);
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
    const featured = new Set<string>(FEATURED_PALETTE_TYPES);
    return this.filteredItems().filter(
      (i) =>
        i.categoryId === id &&
        !featured.has(i.type) &&
        i.type !== BLANK_AGENT_TYPE &&
        i.categoryId !== 'logic',
    );
  }

  defaultAgentItems(): PaletteItem[] {
    return this.allItems().filter((i) => i.origin === 'default-agent');
  }

  cardIconPath(item: PaletteItem): string {
    return item.iconPath || iconPathForType(item.type);
  }

  initialsFor(item: PaletteItem): string {
    return initialsFromLabel(item.label);
  }

  labelWraps(label: string): boolean {
    return labelUsesTwoLines(label);
  }

  hostPalettesPresent(): boolean {
    const palettes = this.palettes();
    return palettes !== undefined && sanitizeHostPaletteItems(palettes).length > 0;
  }

  showIconImg(item: PaletteItem): boolean {
    return !!item.iconUrl && !this.failedIconKeys().has(item.key);
  }

  onPaletteIconError(item: PaletteItem): void {
    this.failedIconKeys.update((cur) => {
      const next = new Set(cur);
      next.add(item.key);
      return next;
    });
  }

  shapeKind(type: NodeType) {
    return logicShapeKind(type);
  }

  accentFor(type: NodeType): string {
    return accentTokenForType(type);
  }

  /** Condition / Router / Repeater plus host node cards (e.g. Action) in the same shapes row. */
  logicShapeItems(): PaletteItem[] {
    const base = featuredLogicItems(this.allItems(), this.hostPalettesPresent());
    if (!this.hostPalettesPresent()) {
      return base;
    }
    const featured = new Set<string>(FEATURED_PALETTE_TYPES);
    const hostNodes = this.allItems().filter(
      (i) =>
        i.origin !== 'default-agent' &&
        i.type !== BLANK_AGENT_TYPE &&
        !featured.has(i.type),
    );
    return [...base, ...hostNodes];
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
      // Palette is copy-on-create — always restore the source slot after drag.
      event.source.reset();
      const el = event.source.element.nativeElement as HTMLElement;
      el.style.transform = '';
      el.classList.remove('cdk-drag-dragging');
      queueMicrotask(() => {
        this.dragActive = false;
        event.source.reset();
        el.style.transform = '';
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
