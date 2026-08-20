import {
  Component,
  DestroyRef,
  HostListener,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormBuilder,
  type AbstractControl,
  type FormGroup,
  type ValidatorFn,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { getAtPath, setAtPath } from '../../core/domain/config-path';
import {
  builtInCollisionIds,
  getPropertiesMap,
  listRemainingPropertyKeys,
  schemaCoveredPaths,
  withPropertiesMap,
} from '../../core/domain/host-properties.dynamic';
import {
  coerceHostFieldValue,
  displayHostFieldValue,
  isKnownUiComponent,
  logicBuiltinPropertiesSchema,
  optionLabel,
  optionValue,
  visibleHostSections,
  type HostPropertiesField,
  type HostPropertiesSection,
} from '../../core/domain/host-properties.schema';
import {
  resolveHostProvidedPropertiesSchema,
} from '../../core/domain/host-properties.resolve';
import { controlKeyForPath } from '../../core/domain/properties.schema';
import { isRouterRepeaterLabelUnique } from '../../core/domain/logic-node-rules';
import {
  SIDEBAR_WIDTH_RIGHT_DEFAULT,
  clampSidebarWidth,
} from '../../core/domain/sidebar-width';
import { ensureSkillsArray, type AgentSkillRef } from '../../core/domain/agent-skills';
import type {
  NodeType,
  WorkflowEdge,
  WorkflowNode,
} from '../../core/domain/workflow.models';
import type { PaletteItem } from '../../core/domain/palette.catalog';
import type { HostPropertiesInput } from '../../core/ui-config/properties-adapter';
import type { DefaultAgentCard } from '../../core/ui-config/ui-features.types';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { WORKFLOW_BUILDER_PROPERTIES, asPropertiesSchemaSource } from '../../core/ui-config/properties-adapter';
import { WORKFLOW_BUILDER_PROPERTIES_DEFAULTS } from '../../core/ui-config/properties-defaults.token';
import { UI_EFFECTIVE_FEATURES } from '../../core/ui-config/ui-effective.token';
import { createDefaultUiFeatures } from '../../core/ui-config/merge-ui-features';
import { DynamicPropertyComponent } from './dynamic-property.component';

type PanelMode = 'empty' | 'node' | 'edge';
type EdgeKind = 'connection' | 'connector' | 'condition-out';

function requiredTrimmed(): ValidatorFn {
  return (control: AbstractControl) =>
    String(control.value ?? '').trim() === '' ? { required: true } : null;
}

function routerRepeaterUniqueValidator(facade: WorkflowFacade, excludeId: string): ValidatorFn {
  return (control: AbstractControl) =>
    isRouterRepeaterLabelUnique(String(control.value ?? ''), facade.nodes(), excludeId)
      ? null
      : { duplicateLabel: true };
}

@Component({
  selector: 'wb-right-sidebar',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DynamicPropertyComponent],
  template: `
    <div
      class="properties-root"
      [class.is-collapsed]="collapsed()"
      [style.width.px]="collapsed() ? null : panelWidth()"
      [style.top.px]="facade.chromeInsetTop()"
      data-testid="properties-root"
    >
      @if (!collapsed()) {
        <div
          class="resize-grip"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize Properties"
          title="Drag to resize"
          (pointerdown)="onResizeStart($event)"
        ></div>
      }
      <aside class="properties-panel" aria-label="Properties">
        <header class="properties-header">
          <button
            type="button"
            class="icon-btn header-toggle"
            (click)="collapsedChange.emit(!collapsed())"
            [attr.aria-expanded]="!collapsed()"
            [attr.aria-label]="collapsed() ? 'Expand Properties' : 'Collapse Properties'"
            title="Toggle Properties"
          >
            <svg class="chip-icon" viewBox="1 1 14 14" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.4" />
              <path d="M10.5 2v12" stroke="currentColor" stroke-width="1.4" />
            </svg>
          </button>
          <div class="header-title">
            <h2>Properties</h2>
            @if (!collapsed()) {
              <p class="subtitle">{{ headerSubtitle }}</p>
            }
          </div>
          @if (!collapsed() && mode !== 'empty' && facade.editorMode() === 'edit') {
            <button
              type="button"
              class="icon-btn danger"
              (click)="onDelete()"
              aria-label="Delete selected"
              title="Delete"
            >
              <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path
                  d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                />
              </svg>
            </button>
          }
        </header>

        @if (!collapsed()) {
          <hr class="panel-rule" />
          <div class="properties-body">
            @if (agentSkillsMode() && facade.selectedSkillId(); as skillId) {
              @if (skillEntry(skillId); as skill) {
                <section class="section" data-testid="skill-properties">
                  <h3>Skill</h3>
                  <label class="field">
                    <span class="field-label">Id</span>
                    <input type="text" [value]="skill.skillId" readonly />
                  </label>
                  <label class="field">
                    <span class="field-label">Name</span>
                    <input type="text" [value]="skill.name" readonly />
                  </label>
                  <label class="field">
                    <span class="field-label">Description</span>
                    <textarea rows="3" [value]="skill.description" readonly></textarea>
                  </label>
                  @if (facade.editorMode() === 'edit') {
                    <button
                      type="button"
                      class="icon-btn danger"
                      (click)="facade.removeSkillFromAgent(agentNodeId()!, skill.skillId)"
                    >
                      Remove skill
                    </button>
                  }
                </section>
              } @else {
                <p class="empty">Skill not found on this agent.</p>
              }
            } @else if (mode === 'empty' || !form) {
              <p class="empty">Select a node or connection to edit properties.</p>
            } @else if (mode === 'edge') {
              <form [formGroup]="form" (ngSubmit)="onSaveEdge()">
                <section class="section">
                  <h3>{{ edgeKind === 'connector' ? 'Connector' : 'Connection' }}</h3>
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
                  @if (edgeKind === 'connector') {
                    <label class="field">
                      <span class="field-label">Name</span>
                      <input type="text" formControlName="label" data-testid="properties-connector-name" />
                      @if (form.controls['label'].invalid && form.controls['label'].touched) {
                        <span class="field-error">Name is required</span>
                      }
                    </label>
                    <label class="field">
                      <span class="field-label">Condition</span>
                      <input
                        type="text"
                        formControlName="condition"
                        placeholder="Enter Condition"
                        data-testid="properties-connector-condition"
                      />
                      @if (form.controls['condition'].invalid && form.controls['condition'].touched) {
                        <span class="field-error">Condition is required</span>
                      }
                    </label>
                  } @else if (edgeKind === 'condition-out') {
                    <label class="field">
                      <span class="field-label">Label</span>
                      <input
                        type="text"
                        formControlName="label"
                        readonly
                        data-testid="properties-condition-edge-label"
                      />
                    </label>
                  } @else {
                    <label class="field">
                      <span class="field-label">Label</span>
                      <input type="text" formControlName="label" />
                    </label>
                  }
                </section>
                @if (facade.editorMode() === 'edit' && edgeKind !== 'condition-out') {
                  <footer class="properties-footer">
                    <button type="submit" class="save-btn" [disabled]="!canSave" aria-label="Save properties">
                      Save
                    </button>
                  </footer>
                }
              </form>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSaveNode()">
                @for (section of hostSections; track $index) {
                  <section class="section" formGroupName="host">
                    <h3>{{ section.title || 'General' }}</h3>
                    @for (field of section.fields; track field.path) {
                      @if (field.type === 'boolean' && !usesUnknownWidget(field)) {
                        <label class="switch-field">
                          <span class="field-label">{{ field.label }}</span>
                          <input
                            type="checkbox"
                            class="switch-input"
                            role="switch"
                            [formControlName]="controlKey(field)"
                            [attr.data-testid]="fieldTestId(field)"
                          />
                        </label>
                      } @else {
                        <label class="field">
                          <span class="field-label">{{ field.label }}</span>
                          @if (usesUnknownWidget(field)) {
                            <input
                              type="text"
                              [formControlName]="controlKey(field)"
                              [attr.data-testid]="fieldTestId(field)"
                            />
                          } @else if (field.type === 'textarea') {
                            <textarea
                              rows="3"
                              [formControlName]="controlKey(field)"
                              [placeholder]="field.placeholder ?? ''"
                              [attr.data-testid]="fieldTestId(field)"
                            ></textarea>
                          } @else if (field.type === 'select') {
                            <select
                              [formControlName]="controlKey(field)"
                              [attr.data-testid]="fieldTestId(field)"
                            >
                              @if (field.placeholder) {
                                <option value="">{{ field.placeholder }}</option>
                              }
                              @for (opt of field.options ?? []; track optionValue(opt)) {
                                <option [value]="optionValue(opt)">{{ optionLabel(opt) }}</option>
                              }
                            </select>
                          } @else if (field.type === 'multiselect') {
                            <select
                              multiple
                              [formControlName]="controlKey(field)"
                              [attr.data-testid]="fieldTestId(field)"
                            >
                              @for (opt of field.options ?? []; track optionValue(opt)) {
                                <option [value]="optionValue(opt)">{{ optionLabel(opt) }}</option>
                              }
                            </select>
                          } @else if (field.type === 'number') {
                            <input
                              type="number"
                              [formControlName]="controlKey(field)"
                              [placeholder]="field.placeholder ?? ''"
                              [attr.data-testid]="fieldTestId(field)"
                            />
                          } @else {
                            <input
                              type="text"
                              [formControlName]="controlKey(field)"
                              [placeholder]="field.placeholder ?? ''"
                              [attr.data-testid]="fieldTestId(field)"
                            />
                          }
                          @if (
                            form.get('host.' + controlKey(field))?.hasError('duplicateLabel') &&
                            form.get('host.' + controlKey(field))?.touched
                          ) {
                            <span class="field-error">A Router or Repeater with this name already exists</span>
                          } @else if (
                            form.get('host.' + controlKey(field))?.invalid &&
                            form.get('host.' + controlKey(field))?.touched
                          ) {
                            <span class="field-error">{{ field.label }} is required</span>
                          }
                        </label>
                      }
                    }
                  </section>
                }

                @for (section of builtinSections; track $index) {
                  <section class="section" formGroupName="builtin">
                    <h3>{{ section.title || 'Configuration' }}</h3>
                    @for (field of section.fields; track field.path) {
                      @if (field.type === 'boolean' && !usesUnknownWidget(field)) {
                        <label class="switch-field">
                          <span class="field-label">{{ field.label }}</span>
                          <input
                            type="checkbox"
                            class="switch-input"
                            role="switch"
                            [formControlName]="controlKey(field)"
                            [attr.data-testid]="fieldTestId(field)"
                          />
                        </label>
                      } @else {
                        <label class="field">
                          <span class="field-label">{{ field.label }}</span>
                          @if (usesUnknownWidget(field)) {
                            <input
                              type="text"
                              [formControlName]="controlKey(field)"
                              [attr.data-testid]="fieldTestId(field)"
                            />
                          } @else if (field.type === 'textarea') {
                            <textarea
                              rows="3"
                              [formControlName]="controlKey(field)"
                              [placeholder]="field.placeholder ?? ''"
                              [attr.data-testid]="fieldTestId(field)"
                            ></textarea>
                          } @else if (field.type === 'select') {
                            <select
                              [formControlName]="controlKey(field)"
                              [attr.data-testid]="fieldTestId(field)"
                            >
                              @if (field.placeholder) {
                                <option value="">{{ field.placeholder }}</option>
                              }
                              @for (opt of field.options ?? []; track optionValue(opt)) {
                                <option [value]="optionValue(opt)">{{ optionLabel(opt) }}</option>
                              }
                            </select>
                          } @else if (field.type === 'multiselect') {
                            <select
                              multiple
                              [formControlName]="controlKey(field)"
                              [attr.data-testid]="fieldTestId(field)"
                            >
                              @for (opt of field.options ?? []; track optionValue(opt)) {
                                <option [value]="optionValue(opt)">{{ optionLabel(opt) }}</option>
                              }
                            </select>
                          } @else if (field.type === 'number') {
                            <input
                              type="number"
                              [formControlName]="controlKey(field)"
                              [placeholder]="field.placeholder ?? ''"
                              [attr.data-testid]="fieldTestId(field)"
                            />
                          } @else {
                            <input
                              type="text"
                              [formControlName]="controlKey(field)"
                              [placeholder]="field.placeholder ?? ''"
                              [attr.data-testid]="fieldTestId(field)"
                            />
                          }
                          @if (
                            form.get('builtin.' + controlKey(field))?.invalid &&
                            form.get('builtin.' + controlKey(field))?.touched
                          ) {
                            <span class="field-error">{{ field.label }} is required</span>
                          }
                        </label>
                      }
                    }
                  </section>
                }

                @if (remainingKeys.length > 0) {
                  <section class="section" data-testid="dynamic-properties-section">
                    <h3>Additional properties</h3>
                    @for (dynKey of remainingKeys; track dynKey) {
                      <wb-dynamic-property
                        [key]="dynKey"
                        [value]="propertiesWorking[dynKey]"
                        [disabled]="facade.editorMode() === 'view'"
                        (valueChange)="onDynamicValueChange(dynKey, $event)"
                      />
                    }
                  </section>
                }

                @if (showAddProperty && facade.editorMode() === 'edit') {
                  <section class="section" data-testid="add-property-section">
                    <h3>Add property</h3>
                    <label class="field">
                      <span class="field-label">Key</span>
                      <input type="text" [(ngModel)]="addPropertyKey" [ngModelOptions]="{ standalone: true }" />
                    </label>
                    <label class="field">
                      <span class="field-label">Value</span>
                      <input type="text" [(ngModel)]="addPropertyValue" [ngModelOptions]="{ standalone: true }" />
                    </label>
                    <button type="button" class="save-btn" (click)="onAddProperty()">Add</button>
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
        }
      </aside>
    </div>
  `,
  styles: `
    /* Match app.workflowbuilder.io sidebar: collapsed = min-content/auto; expanded = 100%/fixed width */
    .properties-root {
      position: absolute;
      top: 88px; /* overridden by [style.top.px] from chrome inset */
      right: 16px;
      bottom: 16px;
      z-index: 5;
      width: auto;
      pointer-events: none;
    }
    .properties-root:not(.is-collapsed) {
      /* width from [style.width.px] / panelWidth */
      max-width: none;
    }
    .properties-root.is-collapsed {
      bottom: auto;
    }
    .resize-grip {
      position: absolute;
      top: 0;
      left: -4px;
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
      right: 3px;
      width: 2px;
      border-radius: 1px;
      background: color-mix(in srgb, var(--wb-border) 80%, transparent);
      opacity: 0;
      transition: opacity 120ms ease;
    }
    .resize-grip:hover::after {
      opacity: 1;
      background: var(--wb-accent);
    }
    .properties-panel {
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
    .properties-root:not(.is-collapsed) .properties-panel {
      height: 100%;
      width: 100%;
    }
    .properties-header {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;
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
    .header-title {
      flex: 1;
      min-width: 0;
    }
    .properties-root.is-collapsed .header-title {
      flex: 0 0 auto;
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
    .subtitle { margin: 0.2rem 0 0; font-size: 0.75rem; color: var(--wb-text-muted); }
    .icon-btn {
      width: 24px; height: 24px; display: grid; place-items: center;
      border: 1px solid transparent; border-radius: 6px;
      background: transparent; color: var(--wb-text); cursor: pointer; flex-shrink: 0;
      padding: 0;
    }
    .icon-btn.header-toggle:hover {
      border-color: var(--wb-border);
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
      padding: 1.25rem 1rem 1rem; display: flex; flex-direction: column; gap: 1rem;
      box-sizing: border-box;
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
    input:not(.switch-input), select, textarea {
      width: 100%; border: 1px solid var(--wb-border); border-radius: 8px;
      background: var(--wb-bg-app); color: var(--wb-text); padding: 0.5rem 0.6rem;
      font: inherit; resize: vertical; box-sizing: border-box;
    }
    input:not(.switch-input):disabled, select:disabled, textarea:disabled { opacity: 0.7; cursor: not-allowed; }
    input:not(.switch-input)[readonly] { opacity: 0.85; }
    .switch-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.65rem;
      cursor: pointer;
    }
    .switch-input {
      appearance: none;
      -webkit-appearance: none;
      width: 2.25rem;
      height: 1.25rem;
      margin: 0;
      padding: 0;
      flex-shrink: 0;
      box-sizing: border-box;
      border-radius: 999px;
      border: 1.5px solid color-mix(in srgb, var(--wb-text-muted) 85%, #8fa3b8);
      background: transparent;
      position: relative;
      cursor: pointer;
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }
    .switch-input::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 2px;
      width: 0.85rem;
      height: 0.85rem;
      border-radius: 50%;
      background: color-mix(in srgb, var(--wb-text-muted) 70%, #a8b8c8);
      transform: translateY(-50%);
      transition: left 0.15s ease, background-color 0.15s ease;
    }
    .switch-input:checked {
      border-color: color-mix(in srgb, var(--wb-text) 55%, #7eb0ff);
      background: color-mix(in srgb, var(--wb-text) 12%, transparent);
    }
    .switch-input:checked::after {
      left: calc(100% - 0.85rem - 2px);
      background: color-mix(in srgb, var(--wb-text) 80%, #9ec0ff);
    }
    .switch-input:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .switch-input:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--wb-text) 40%, #7eb0ff);
      outline-offset: 2px;
    }
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
  readonly panelWidth = input(SIDEBAR_WIDTH_RIGHT_DEFAULT);
  readonly panelWidthChange = output<number>();
  /** When true, Properties can show selected skill entry on nested agent route. */
  readonly agentSkillsMode = input(false);
  readonly agentNodeId = input<string | null>(null);
  /** Live host palettes — when set, schema for `paletteKey` prefers the current palette row. */
  readonly palettes = input<PaletteItem[] | undefined>();
  /** Live default agents — same as palettes for agent `paletteKey` schema. */
  readonly defaultAgents = input<DefaultAgentCard[] | undefined>();
  /** Instance properties config — `schemaFor` adapter or map keyed by `paletteKey`. */
  readonly properties = input<HostPropertiesInput | undefined>();

  readonly facade = inject(WorkflowFacade);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly propertiesAdapter = inject(WORKFLOW_BUILDER_PROPERTIES, { optional: true });
  private readonly propertiesDefaults = inject(WORKFLOW_BUILDER_PROPERTIES_DEFAULTS, {
    optional: true,
  });
  private readonly effectiveUi = inject(UI_EFFECTIVE_FEATURES, { optional: true });

  readonly optionValue = optionValue;
  readonly optionLabel = optionLabel;

  mode: PanelMode = 'empty';
  edgeKind: EdgeKind = 'connection';
  boundNodeType: NodeType | null = null;
  form: FormGroup | null = null;
  builtinSections: HostPropertiesSection[] = [];
  hostSections: HostPropertiesSection[] = [];
  /** @deprecated alias — all host+builtin fields for tests */
  configFields: HostPropertiesField[] = [];
  remainingKeys: string[] = [];
  propertiesWorking: Record<string, unknown> = {};
  addPropertyKey = '';
  addPropertyValue = '';
  showAddProperty = false;
  headerSubtitle = 'Select a node or connection';
  canSave = false;

  private boundNodeId: string | null = null;
  private boundEdgeId: string | null = null;
  private boundMode: 'edit' | 'view' | null = null;
  private suppressDraftWrite = false;
  private propertiesDirty = false;
  private formSubs = new Subscription();
  private builtinFields: HostPropertiesField[] = [];
  private hostFields: HostPropertiesField[] = [];
  /** Last palettes reference used for bind — rebind when host swaps the array. */
  private boundPalettesRef: PaletteItem[] | undefined = undefined;
  private boundDefaultAgentsRef: DefaultAgentCard[] | undefined = undefined;
  /** Last `[properties]` reference used for bind. */
  private boundPropertiesRef: HostPropertiesInput | undefined = undefined;

  private resizing = false;
  private resizeStartX = 0;
  private resizeStartWidth = SIDEBAR_WIDTH_RIGHT_DEFAULT;

  skillEntry(skillId: string): AgentSkillRef | undefined {
    const agentId = this.agentNodeId();
    if (!agentId) {
      return undefined;
    }
    return ensureSkillsArray(
      this.facade.nodes().find((n) => n.id === agentId)?.data,
    ).find((s) => s.skillId === skillId);
  }

  @HostListener('document:pointermove', ['$event'])
  onDocPointerMove(event: PointerEvent): void {
    if (!this.resizing) {
      return;
    }
    const dx = event.clientX - this.resizeStartX;
    this.panelWidthChange.emit(
      clampSidebarWidth(this.resizeStartWidth - dx, window.innerWidth),
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
    this.destroyRef.onDestroy(() => this.formSubs.unsubscribe());

    effect(() => {
      const nodeId = this.facade.selectionFocusNodeId();
      const edgeId = this.facade.selectionFocusEdgeId();
      const editorMode = this.facade.editorMode();
      const palettes = this.palettes();
      const defaultAgents = this.defaultAgents();
      const properties = this.properties();
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
          if (
            nodeId === this.boundNodeId &&
            editorMode === this.boundMode &&
            this.mode === 'node' &&
            palettes === this.boundPalettesRef &&
            defaultAgents === this.boundDefaultAgentsRef &&
            properties === this.boundPropertiesRef
          ) {
            return;
          }
          this.boundPalettesRef = palettes;
          this.boundDefaultAgentsRef = defaultAgents;
          this.boundPropertiesRef = properties;
          const node = this.facade.nodes().find((n) => n.id === nodeId) ?? null;
          this.bindNode(node, editorMode);
          return;
        }
        this.boundPalettesRef = palettes;
        this.boundDefaultAgentsRef = defaultAgents;
        this.boundPropertiesRef = properties;
        this.clearPanel(editorMode);
      });
    });
  }

  onDynamicValueChange(key: string, value: unknown): void {
    this.propertiesWorking = { ...this.propertiesWorking, [key]: value };
    this.propertiesDirty = true;
    this.syncNodeDraftFromForm();
    this.refreshCanSave(this.facade.editorMode());
  }

  onAddProperty(): void {
    if (this.facade.editorMode() !== 'edit' || !this.showAddProperty) {
      return;
    }
    const key = this.addPropertyKey.trim();
    if (key.length === 0) {
      return;
    }
    this.propertiesWorking = { ...this.propertiesWorking, [key]: this.addPropertyValue };
    this.refreshRemainingKeys();
    this.addPropertyKey = '';
    this.addPropertyValue = '';
    this.propertiesDirty = true;
    this.syncNodeDraftFromForm();
    this.refreshCanSave(this.facade.editorMode());
  }

  controlKey(field: HostPropertiesField): string {
    return controlKeyForPath(field.path);
  }

  usesUnknownWidget(field: HostPropertiesField): boolean {
    return !isKnownUiComponent(field.ui_component);
  }

  fieldTestId(field: HostPropertiesField): string {
    if (field.path === 'condition') {
      return 'properties-condition-input';
    }
    if (field.path === 'repeater.workflowId') {
      return 'properties-repeater-workflow';
    }
    if (field.path === 'repeater.versionId') {
      return 'properties-repeater-version';
    }
    if (field.path === 'repeater.is_paused') {
      return 'properties-repeater-paused';
    }
    return `properties-field-${controlKeyForPath(field.path)}`;
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
    const ok = this.facade.patchEdge(draft.id, {
      label: draft.label,
      condition: draft.condition,
    });
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
    this.builtinSections = [];
    this.hostSections = [];
    this.builtinFields = [];
    this.hostFields = [];
    this.remainingKeys = [];
    this.propertiesWorking = {};
    this.propertiesDirty = false;
    this.addPropertyKey = '';
    this.addPropertyValue = '';
    this.showAddProperty = false;
    this.headerSubtitle = 'Select a node or connection';
    this.boundNodeId = null;
    this.boundEdgeId = null;
    this.boundNodeType = null;
    this.edgeKind = 'connection';
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
    this.boundNodeType = null;
    this.boundMode = editorMode;
    this.hostSections = [];
    this.builtinSections = [];
    this.configFields = [];
    this.remainingKeys = [];
    this.propertiesWorking = {};
    this.showAddProperty = false;

    const sourceType = this.facade.nodes().find((n) => n.id === edge.source)?.type;
    if (sourceType === 'Decision') {
      this.edgeKind = 'connector';
      this.headerSubtitle = `Connector · ${edge.id}`;
    } else if (sourceType === 'Condition') {
      this.edgeKind = 'condition-out';
      this.headerSubtitle = `Connection · ${edge.id}`;
    } else {
      this.edgeKind = 'connection';
      this.headerSubtitle = `Connection · ${edge.id}`;
    }

    this.suppressDraftWrite = true;
    if (this.edgeKind === 'connector') {
      this.form = this.fb.group({
        id: [{ value: edge.id, disabled: true }],
        source: [{ value: edge.source, disabled: true }],
        target: [{ value: edge.target, disabled: true }],
        label: [edge.label ?? '', requiredTrimmed()],
        condition: [edge.condition ?? '', requiredTrimmed()],
      });
    } else if (this.edgeKind === 'condition-out') {
      this.form = this.fb.group({
        id: [{ value: edge.id, disabled: true }],
        source: [{ value: edge.source, disabled: true }],
        target: [{ value: edge.target, disabled: true }],
        label: [{ value: edge.label ?? '', disabled: true }],
      });
    } else {
      this.form = this.fb.group({
        id: [{ value: edge.id, disabled: true }],
        source: [{ value: edge.source, disabled: true }],
        target: [{ value: edge.target, disabled: true }],
        label: [edge.label ?? ''],
      });
    }
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
    this.boundNodeType = node.type;
    this.edgeKind = 'connection';
    this.boundMode = editorMode;
    const typeLabel = node.type === 'Decision' ? 'Router' : node.type;
    this.headerSubtitle = `${node.label} · ${typeLabel}`;
    this.showAddProperty =
      (this.effectiveUi?.features() ?? createDefaultUiFeatures()).propertiesPanel.addProperty ===
      true;
    this.propertiesDirty = false;
    this.addPropertyKey = '';
    this.addPropertyValue = '';

    const builtinSchema = logicBuiltinPropertiesSchema(node.type);
    this.builtinSections = builtinSchema ? visibleHostSections(builtinSchema) : [];
    this.builtinFields = this.builtinSections.flatMap((section) => section.fields);

    const hostSchema = resolveHostProvidedPropertiesSchema(
      node,
      this.propertiesAdapter,
      this.palettes(),
      asPropertiesSchemaSource(this.properties()),
      this.defaultAgents(),
      this.propertiesDefaults,
    );
    this.hostSections = hostSchema ? visibleHostSections(hostSchema) : [];
    this.hostFields = this.hostSections.flatMap((section) => section.fields);
    this.configFields = [...this.builtinFields, ...this.hostFields];

    this.propertiesWorking = getPropertiesMap(node.data);
    this.refreshRemainingKeys();

    this.suppressDraftWrite = true;
    const builtinGroup: Record<string, unknown> = {};
    for (const field of this.builtinFields) {
      const key = controlKeyForPath(field.path);
      const raw = getAtPath(node.data, field.path);
      const value = displayHostFieldValue(field, raw);
      const validators = field.required && field.type !== 'boolean' ? [requiredTrimmed()] : [];
      if (this.usesUnknownWidget(field)) {
        builtinGroup[key] = [{ value, disabled: true }, validators];
      } else {
        builtinGroup[key] = [value, validators];
      }
    }
    const hostGroup: Record<string, unknown> = {};
    for (const field of this.hostFields) {
      const key = controlKeyForPath(field.path);
      // General name/description mirror canvas label/subtitle.
      let raw: unknown;
      if (field.path === 'name') {
        raw = node.label;
      } else if (field.path === 'description') {
        raw = node.subtitle;
      } else {
        raw = getAtPath(this.propertiesWorking, field.path);
      }
      const value = displayHostFieldValue(field, raw);
      const validators =
        field.path === 'name' || (field.required === true && field.type !== 'boolean')
          ? [requiredTrimmed()]
          : [];
      if (field.path === 'name' && (node.type === 'Decision' || node.type === 'Repeater')) {
        validators.push(routerRepeaterUniqueValidator(this.facade, node.id));
      }
      if (this.usesUnknownWidget(field)) {
        hostGroup[key] = [{ value, disabled: true }, validators];
      } else {
        hostGroup[key] = [value, validators];
      }
    }
    this.form = this.fb.group({
      builtin: this.fb.group(builtinGroup),
      host: this.fb.group(hostGroup),
    });

    if (editorMode === 'view') {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
      for (const field of this.builtinFields) {
        if (this.usesUnknownWidget(field)) {
          this.form.get(['builtin', controlKeyForPath(field.path)])?.disable({ emitEvent: false });
        }
      }
      for (const field of this.hostFields) {
        if (this.usesUnknownWidget(field)) {
          this.form.get(['host', controlKeyForPath(field.path)])?.disable({ emitEvent: false });
        }
      }
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
    if (node.type === 'Repeater') {
      this.formSubs.add(
        this.form.get(['builtin', 'repeater_workflowId'])?.valueChanges.subscribe(() => {
          if (this.suppressDraftWrite || !this.form) {
            return;
          }
          const versionCtrl = this.form.get(['builtin', 'repeater_versionId']);
          if (versionCtrl && String(versionCtrl.value ?? '') !== '') {
            versionCtrl.setValue('', { emitEvent: true });
          }
        }),
      );
    }
  }

  private refreshRemainingKeys(): void {
    const covered = schemaCoveredPaths(
      this.hostFields.length
        ? { sections: this.hostSections.map((s) => ({ ...s, fields: s.fields })) }
        : null,
    );
    // Prefer paths from hostFields directly
    const coveredPaths = new Set(this.hostFields.map((f) => f.path));
    const collisions = builtInCollisionIds(this.boundNodeType ?? 'Action');
    this.remainingKeys = listRemainingPropertyKeys(
      this.propertiesWorking,
      coveredPaths.size > 0 ? coveredPaths : covered,
      collisions,
    );
  }

  private refreshCanSave(mode: 'edit' | 'view'): void {
    if (this.edgeKind === 'condition-out' && this.mode === 'edge') {
      this.canSave = false;
      return;
    }
    this.canSave =
      mode === 'edit' &&
      !!this.form &&
      this.form.valid &&
      (this.form.dirty || this.propertiesDirty);
  }

  private syncEdgeDraftFromForm(): void {
    if (this.suppressDraftWrite || !this.form || !this.boundEdgeId) {
      return;
    }
    const baseline = this.facade.edges().find((e) => e.id === this.boundEdgeId);
    if (!baseline) {
      return;
    }
    const raw = this.form.getRawValue() as { label?: string; condition?: string };
    this.facade.setPropertiesEdgeDraft({
      ...baseline,
      label: raw.label ?? '',
      condition: raw.condition ?? baseline.condition ?? '',
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
      builtin?: Record<string, string | boolean | string[] | number>;
      host?: Record<string, string | boolean | string[] | number>;
    };

    let data: Record<string, unknown> = { ...baseline.data };
    for (const field of this.builtinFields) {
      if (field.hidden === true) {
        continue;
      }
      const key = controlKeyForPath(field.path);
      const str = raw.builtin?.[key];
      if (field.type === 'number' && (str === '' || str == null)) {
        continue;
      }
      data = setAtPath(data, field.path, coerceHostFieldValue(field, str));
    }

    let propertiesMap = { ...this.propertiesWorking };
    for (const field of this.hostFields) {
      if (field.hidden === true) {
        continue;
      }
      const key = controlKeyForPath(field.path);
      const str = raw.host?.[key];
      if (field.type === 'number' && (str === '' || str == null)) {
        continue;
      }
      propertiesMap = setAtPath(propertiesMap, field.path, coerceHostFieldValue(field, str));
    }
    this.propertiesWorking = propertiesMap;
    data = withPropertiesMap(data, propertiesMap);

    const nameFromProps = propertiesMap['name'];
    const descFromProps = propertiesMap['description'];
    this.facade.setPropertiesDraft({
      ...baseline,
      label:
        typeof nameFromProps === 'string'
          ? nameFromProps
          : nameFromProps != null
            ? String(nameFromProps)
            : baseline.label,
      subtitle:
        typeof descFromProps === 'string'
          ? descFromProps
          : descFromProps != null
            ? String(descFromProps)
            : baseline.subtitle,
      status: baseline.status,
      data,
      position: { ...baseline.position },
    });
  }
}
