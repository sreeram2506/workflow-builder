import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { getAtPath, setAtPath } from '../../core/domain/config-path';
import {
  coerceDynamicValue,
  collectEnsoTaskFields,
  displayDynamicValue,
  writeEnsoFieldValue,
  type DynamicFieldSpec,
} from '../../core/domain/enso-task-form';
import {
  NODE_STATUS_OPTIONS,
  configurationFieldsFor,
  controlKeyForPath,
  type XpmsFieldDescriptor,
} from '../../core/domain/properties.schema';
import type {
  NodeStatus,
  WorkflowEdge,
  WorkflowNode,
} from '../../core/domain/workflow.models';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

type PanelMode = 'empty' | 'node' | 'edge';

@Component({
  selector: 'wb-right-sidebar',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="properties-root" [class.is-collapsed]="collapsed()">
      <button
        type="button"
        class="properties-chip"
        (click)="collapsedChange.emit(false)"
        aria-label="Open Properties"
        [attr.tabindex]="collapsed() ? 0 : -1"
        [attr.aria-hidden]="!collapsed()"
      >
        <span>Properties</span>
        <span class="chip-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.4" />
            <path d="M5.5 2v12" stroke="currentColor" stroke-width="1.4" />
          </svg>
        </span>
      </button>

      <aside
        class="properties-panel"
        aria-label="Properties"
        [attr.aria-hidden]="collapsed()"
      >
          <header class="properties-header">
            <div>
              <h2>Properties</h2>
              <p class="subtitle">{{ headerSubtitle }}</p>
            </div>
            <div class="header-actions">
              @if (mode !== 'empty' && facade.editorMode() === 'edit') {
                <button
                  type="button"
                  class="icon-btn danger"
                  (click)="onDelete()"
                  aria-label="Delete selected"
                  title="Delete"
                  [attr.tabindex]="collapsed() ? -1 : 0"
                >
                  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                    <path
                      d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                    />
                  </svg>
                </button>
              }
              <button
                type="button"
                class="icon-btn"
                (click)="collapsedChange.emit(true)"
                aria-label="Collapse Properties"
                title="Collapse"
                [attr.tabindex]="collapsed() ? -1 : 0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.4" />
                  <path d="M5.5 2v12" stroke="currentColor" stroke-width="1.4" />
                </svg>
              </button>
            </div>
          </header>

          <div class="properties-body">
            @if (mode === 'empty' || !form) {
              <p class="empty">Select a node or connection to edit properties.</p>
            } @else if (mode === 'edge') {
              <form [formGroup]="form" (ngSubmit)="onSaveEdge()">
                <section class="section">
                  <h3>Connection</h3>
                  <label class="field">
                    <span class="field-label">Id</span>
                    <input type="text" formControlName="id" readonly />
                  </label>
                  <label class="field">
                    <span class="field-label">Source</span>
                    <input type="text" formControlName="source" readonly />
                  </label>
                  <label class="field">
                    <span class="field-label">Target</span>
                    <input type="text" formControlName="target" readonly />
                  </label>
                  <label class="field">
                    <span class="field-label">Label</span>
                    <input type="text" formControlName="label" />
                  </label>
                </section>
                @if (facade.editorMode() === 'edit') {
                  <footer class="properties-footer">
                    <button type="submit" class="save-btn" [disabled]="!canSave" aria-label="Save properties">
                      Save
                    </button>
                  </footer>
                }
              </form>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSaveNode()">
                <section class="section">
                  <h3>General</h3>
                  <label class="field">
                    <span class="field-label">Label</span>
                    <input type="text" formControlName="label" />
                    @if (form.controls['label'].invalid && form.controls['label'].touched) {
                      <span class="field-error">Label is required</span>
                    }
                  </label>
                  <label class="field">
                    <span class="field-label">Subtitle</span>
                    <input type="text" formControlName="subtitle" />
                  </label>
                  <label class="field">
                    <span class="field-label">Status</span>
                    <select formControlName="status">
                      @for (opt of statusOptions; track opt) {
                        <option [value]="opt">{{ opt }}</option>
                      }
                    </select>
                  </label>
                </section>

                @if (ensoFields.length > 0) {
                  <section class="section" formGroupName="enso">
                    <h3>Configuration</h3>
                    @for (field of ensoFields; track field.path) {
                      <label class="field">
                        <span class="field-label">{{ field.label }}</span>
                        @if (field.kind === 'textarea' || field.kind === 'json') {
                          <textarea rows="4" [formControlName]="ensoControlKey(field)"></textarea>
                        } @else if (field.kind === 'boolean') {
                          <select [formControlName]="ensoControlKey(field)">
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        } @else {
                          <input type="text" [formControlName]="ensoControlKey(field)" />
                        }
                      </label>
                    }
                  </section>
                } @else {
                  <section class="section" formGroupName="configuration">
                    <h3>Configuration</h3>
                    @for (field of configFields; track field.config_path) {
                      <label class="field">
                        <span class="field-label">{{ field.name }}</span>
                        @if (field.description) {
                          <span class="field-help">{{ field.description }}</span>
                        }
                        <select [formControlName]="controlKey(field)">
                          @for (opt of field.options; track $index) {
                            <option [value]="stringOption(opt)">{{ stringOption(opt) }}</option>
                          }
                        </select>
                      </label>
                    }
                  </section>
                }

                @if (facade.editorMode() === 'edit') {
                  <footer class="properties-footer">
                    <button type="submit" class="save-btn" [disabled]="!canSave" aria-label="Save properties">
                      Save
                    </button>
                  </footer>
                }
              </form>
            }
          </div>
      </aside>
    </div>
  `,
  styles: `
    .properties-root {
      --wb-props-ease: cubic-bezier(0.32, 0.72, 0, 1);
      --wb-props-duration: 280ms;
      position: absolute;
      top: 88px;
      right: 16px;
      bottom: 16px;
      z-index: 5;
      width: 300px;
      max-width: min(320px, calc(100% - 32px));
      pointer-events: none;
    }
    .properties-root.is-collapsed {
      width: max-content;
    }
    .properties-chip {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      background: var(--wb-bg-elevated);
      color: var(--wb-text);
      box-shadow: var(--wb-shadow-soft);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.92rem;
      pointer-events: all;
      opacity: 0;
      transform: translateX(8px);
      transition:
        opacity 160ms ease,
        transform var(--wb-props-duration) var(--wb-props-ease);
      z-index: 1;
    }
    .properties-root.is-collapsed .properties-chip {
      opacity: 1;
      transform: translateX(0);
      transition-delay: 90ms;
    }
    .properties-root:not(.is-collapsed) .properties-chip {
      pointer-events: none;
      transition-delay: 0ms;
    }
    .chip-icon { display: grid; place-items: center; opacity: 0.85; }
    .properties-panel {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 300px;
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
        transform var(--wb-props-duration) var(--wb-props-ease),
        opacity 180ms ease;
      will-change: transform;
    }
    .properties-root.is-collapsed .properties-panel {
      transform: translate3d(calc(100% + 20px), 0, 0);
      opacity: 0;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .properties-chip,
      .properties-panel {
        transition: none;
      }
    }
    .properties-header {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: flex-start;
      padding: 0.85rem 0.9rem 0.7rem;
      border-bottom: 1px solid var(--wb-border);
      flex-shrink: 0;
    }
    .properties-header > div:first-child {
      flex: 1;
      min-width: 0;
    }
    .header-actions {
      display: inline-flex;
      gap: 0.35rem;
      flex-shrink: 0;
    }
    h2 { margin: 0; font-size: 1rem; font-weight: 700; }
    .subtitle { margin: 0.2rem 0 0; font-size: 0.75rem; color: var(--wb-text-muted); }
    .icon-btn {
      width: 28px; height: 28px; display: grid; place-items: center;
      border: 1px solid var(--wb-border); border-radius: 6px;
      background: transparent; color: var(--wb-text); cursor: pointer; flex-shrink: 0;
    }
    .icon-btn.danger {
      color: var(--wb-danger);
      border-color: color-mix(in srgb, var(--wb-danger) 45%, var(--wb-border));
    }
    .icon-btn.danger:hover {
      background: color-mix(in srgb, var(--wb-danger) 14%, transparent);
    }
    .properties-body {
      flex: 1 1 auto; min-height: 0; overflow: auto;
      padding: 0.75rem 0.9rem 1rem; display: flex; flex-direction: column; gap: 1rem;
    }
    .empty { margin: 0; font-size: 0.85rem; color: var(--wb-text-muted); line-height: 1.4; }
    .section h3 {
      margin: 0 0 0.55rem; font-size: 0.75rem; text-transform: uppercase;
      letter-spacing: 0.04em; color: var(--wb-text-muted);
    }
    .field { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.65rem; }
    .field-label { font-size: 0.78rem; color: var(--wb-text-muted); }
    .field-help { font-size: 0.7rem; color: var(--wb-text-muted); opacity: 0.9; }
    .field-error { font-size: 0.7rem; color: var(--wb-danger); }
    input, select, textarea {
      width: 100%; border: 1px solid var(--wb-border); border-radius: 8px;
      background: var(--wb-bg-app); color: var(--wb-text); padding: 0.5rem 0.6rem;
      font: inherit; resize: vertical; box-sizing: border-box;
    }
    input:disabled, select:disabled, textarea:disabled { opacity: 0.7; cursor: not-allowed; }
    input[readonly] { opacity: 0.85; }
    .properties-footer { margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--wb-border); }
    .save-btn {
      width: 100%; padding: 0.55rem 0.75rem; border: 1px solid var(--wb-border);
      border-radius: 8px; background: var(--wb-bg-app); color: var(--wb-text);
      font: inherit; font-weight: 600; cursor: pointer;
    }
    .save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  `,
})
export class RightSidebarComponent {
  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();

  readonly facade = inject(WorkflowFacade);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusOptions = NODE_STATUS_OPTIONS;

  mode: PanelMode = 'empty';
  form: FormGroup | null = null;
  configFields: XpmsFieldDescriptor[] = [];
  ensoFields: DynamicFieldSpec[] = [];
  headerSubtitle = 'Select a node or connection';
  canSave = false;

  private boundNodeId: string | null = null;
  private boundEdgeId: string | null = null;
  private boundMode: 'edit' | 'view' | null = null;
  private suppressDraftWrite = false;
  private formSubs = new Subscription();

  constructor() {
    this.destroyRef.onDestroy(() => this.formSubs.unsubscribe());

    effect(() => {
      const nodeId = this.facade.selectionFocusNodeId();
      const edgeId = this.facade.selectionFocusEdgeId();
      const editorMode = this.facade.editorMode();
      untracked(() => {
        if (edgeId) {
          if (edgeId === this.boundEdgeId && editorMode === this.boundMode && this.mode === 'edge') {
            return;
          }
          const edge = this.facade.edges().find((e) => e.id === edgeId) ?? null;
          this.bindEdge(edge, editorMode);
          return;
        }
        if (nodeId) {
          if (nodeId === this.boundNodeId && editorMode === this.boundMode && this.mode === 'node') {
            return;
          }
          const node = this.facade.nodes().find((n) => n.id === nodeId) ?? null;
          this.bindNode(node, editorMode);
          return;
        }
        this.clearPanel(editorMode);
      });
    });
  }

  controlKey(field: XpmsFieldDescriptor): string {
    return controlKeyForPath(field.config_path);
  }

  ensoControlKey(field: DynamicFieldSpec): string {
    return controlKeyForPath(field.path);
  }

  stringOption(opt: unknown): string {
    return String(opt);
  }

  onSaveNode(): void {
    if (!this.form || !this.boundNodeId || !this.canSave) {
      return;
    }
    this.syncNodeDraftFromForm();
    const draft = this.facade.propertiesDraft();
    if (!draft || draft.id !== this.boundNodeId) {
      return;
    }
    const ok = this.facade.patchNode(draft.id, {
      label: draft.label,
      subtitle: draft.subtitle,
      status: draft.status,
      data: draft.data,
    });
    if (ok) {
      const node = this.facade.nodes().find((n) => n.id === this.boundNodeId) ?? null;
      this.bindNode(node, this.facade.editorMode());
    }
  }

  onSaveEdge(): void {
    if (!this.form || !this.boundEdgeId || !this.canSave) {
      return;
    }
    this.syncEdgeDraftFromForm();
    const draft = this.facade.propertiesEdgeDraft();
    if (!draft || draft.id !== this.boundEdgeId) {
      return;
    }
    const ok = this.facade.patchEdge(draft.id, { label: draft.label });
    if (ok) {
      const edge = this.facade.edges().find((e) => e.id === this.boundEdgeId) ?? null;
      this.bindEdge(edge, this.facade.editorMode());
    }
  }

  onDelete(): void {
    if (this.facade.editorMode() === 'view') {
      return;
    }
    if (this.mode === 'node' && this.boundNodeId) {
      this.facade.deleteNodes([this.boundNodeId]);
      return;
    }
    if (this.mode === 'edge' && this.boundEdgeId) {
      this.facade.deleteEdges([this.boundEdgeId]);
    }
  }

  private clearPanel(editorMode: 'edit' | 'view'): void {
    this.formSubs.unsubscribe();
    this.formSubs = new Subscription();
    this.form = null;
    this.mode = 'empty';
    this.configFields = [];
    this.ensoFields = [];
    this.headerSubtitle = 'Select a node or connection';
    this.boundNodeId = null;
    this.boundEdgeId = null;
    this.boundMode = editorMode;
    this.canSave = false;
    if (!this.collapsed()) {
      this.collapsedChange.emit(true);
    }
  }

  private bindEdge(edge: WorkflowEdge | null, editorMode: 'edit' | 'view'): void {
    this.formSubs.unsubscribe();
    this.formSubs = new Subscription();
    if (!edge) {
      this.clearPanel(editorMode);
      return;
    }
    this.mode = 'edge';
    this.boundEdgeId = edge.id;
    this.boundNodeId = null;
    this.boundMode = editorMode;
    this.ensoFields = [];
    this.configFields = [];
    this.headerSubtitle = `Connection · ${edge.id}`;

    this.suppressDraftWrite = true;
    this.form = this.fb.group({
      id: [{ value: edge.id, disabled: true }],
      source: [{ value: edge.source, disabled: true }],
      target: [{ value: edge.target, disabled: true }],
      label: [edge.label ?? ''],
    });
    if (editorMode === 'view') {
      this.form.disable({ emitEvent: false });
    }
    this.form.markAsPristine();
    this.canSave = false;
    this.suppressDraftWrite = false;

    this.formSubs.add(
      this.form.valueChanges.subscribe(() => {
        this.syncEdgeDraftFromForm();
        this.refreshCanSave(editorMode);
      }),
    );
    this.formSubs.add(this.form.statusChanges.subscribe(() => this.refreshCanSave(editorMode)));
  }

  private bindNode(node: WorkflowNode | null, editorMode: 'edit' | 'view'): void {
    this.formSubs.unsubscribe();
    this.formSubs = new Subscription();
    if (!node) {
      this.clearPanel(editorMode);
      return;
    }

    this.mode = 'node';
    this.boundNodeId = node.id;
    this.boundEdgeId = null;
    this.boundMode = editorMode;
    this.headerSubtitle = `${node.label} · ${node.type}`;

    const ensoTask = node.data['ensoTask'];
    const hasEnso =
      ensoTask != null && typeof ensoTask === 'object' && !Array.isArray(ensoTask);

    this.suppressDraftWrite = true;
    if (hasEnso) {
      const task = ensoTask as Record<string, unknown>;
      this.ensoFields = collectEnsoTaskFields(task);
      this.configFields = [];
      const ensoGroup: Record<string, unknown> = {};
      for (const field of this.ensoFields) {
        const key = controlKeyForPath(field.path);
        const value = getAtPath(task, field.path);
        ensoGroup[key] = [displayDynamicValue(field.kind, value)];
      }
      this.form = this.fb.group({
        label: [node.label, Validators.required],
        subtitle: [node.subtitle],
        status: [node.status as NodeStatus, Validators.required],
        enso: this.fb.group(ensoGroup),
      });
    } else {
      this.ensoFields = [];
      this.configFields = configurationFieldsFor(node.type);
      const configGroup: Record<string, unknown> = {};
      for (const field of this.configFields) {
        const key = controlKeyForPath(field.config_path);
        const raw = getAtPath(node.data, field.config_path);
        const value = raw === undefined ? field.value : raw;
        configGroup[key] = [String(value), field.required ? [Validators.required] : []];
      }
      this.form = this.fb.group({
        label: [node.label, Validators.required],
        subtitle: [node.subtitle],
        status: [node.status as NodeStatus, Validators.required],
        configuration: this.fb.group(configGroup),
      });
    }

    if (editorMode === 'view') {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
    this.form.markAsPristine();
    this.canSave = false;
    this.suppressDraftWrite = false;

    this.formSubs.add(
      this.form.valueChanges.subscribe(() => {
        this.syncNodeDraftFromForm();
        this.refreshCanSave(editorMode);
      }),
    );
    this.formSubs.add(this.form.statusChanges.subscribe(() => this.refreshCanSave(editorMode)));
  }

  private refreshCanSave(mode: 'edit' | 'view'): void {
    this.canSave = mode === 'edit' && !!this.form && this.form.valid && this.form.dirty;
  }

  private syncEdgeDraftFromForm(): void {
    if (this.suppressDraftWrite || !this.form || !this.boundEdgeId) {
      return;
    }
    const baseline = this.facade.edges().find((e) => e.id === this.boundEdgeId);
    if (!baseline) {
      return;
    }
    const raw = this.form.getRawValue() as { label?: string };
    this.facade.setPropertiesEdgeDraft({
      ...baseline,
      label: raw.label ?? '',
      waypoints: baseline.waypoints.map((p) => ({ ...p })),
    });
  }

  private syncNodeDraftFromForm(): void {
    if (this.suppressDraftWrite || !this.form || !this.boundNodeId) {
      return;
    }
    const baseline = this.facade.nodes().find((n) => n.id === this.boundNodeId);
    if (!baseline) {
      return;
    }

    const raw = this.form.getRawValue() as {
      label: string;
      subtitle: string;
      status: NodeStatus;
      configuration?: Record<string, string>;
      enso?: Record<string, string>;
    };

    let data: Record<string, unknown> = { ...baseline.data };
    if (this.ensoFields.length > 0) {
      let task =
        data['ensoTask'] && typeof data['ensoTask'] === 'object' && !Array.isArray(data['ensoTask'])
          ? { ...(data['ensoTask'] as Record<string, unknown>) }
          : {};
      for (const field of this.ensoFields) {
        const key = controlKeyForPath(field.path);
        const str = raw.enso?.[key] ?? '';
        task = writeEnsoFieldValue(task, field.path, coerceDynamicValue(field.kind, str));
      }
      data = { ...data, ensoTask: task };
    } else {
      for (const field of this.configFields) {
        const key = controlKeyForPath(field.config_path);
        const str = raw.configuration?.[key];
        const coerced =
          field.data_type === 'boolean'
            ? str === 'true'
            : field.data_type === 'number'
              ? Number(str)
              : (str ?? field.value);
        data = setAtPath(data, field.config_path, coerced);
      }
    }

    this.facade.setPropertiesDraft({
      ...baseline,
      label: raw.label ?? '',
      subtitle: raw.subtitle ?? '',
      status: raw.status,
      data,
      position: { ...baseline.position },
    });
  }
}
