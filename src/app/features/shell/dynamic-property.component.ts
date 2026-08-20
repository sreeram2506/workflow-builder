import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inferControlKind, type DynamicControlKind } from '../../core/domain/host-properties.dynamic';
import type { HostPropertiesField } from '../../core/domain/host-properties.schema';

/**
 * Renders one dynamic property control from metadata or value inference (U-DP-01).
 */
@Component({
  selector: 'wb-dynamic-property',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (kind() === 'boolean') {
      <label class="switch-field">
        <span class="field-label">{{ label() }}</span>
        <input
          type="checkbox"
          class="switch-input"
          role="switch"
          [ngModel]="asBoolean()"
          [disabled]="disabled()"
          (ngModelChange)="onBoolean($event)"
          [attr.data-testid]="'dynamic-property-' + key()"
        />
      </label>
    } @else if (kind() === 'readonlyJson') {
      <label class="field">
        <span class="field-label">{{ label() }}</span>
        <textarea
          rows="3"
          [value]="jsonText()"
          readonly
          disabled
          [attr.data-testid]="'dynamic-property-' + key()"
        ></textarea>
      </label>
    } @else if (kind() === 'number') {
      <label class="field">
        <span class="field-label">{{ label() }}</span>
        <input
          type="number"
          [ngModel]="asNumber()"
          [disabled]="disabled()"
          (ngModelChange)="onNumber($event)"
          [attr.data-testid]="'dynamic-property-' + key()"
        />
      </label>
    } @else {
      <label class="field">
        <span class="field-label">{{ label() }}</span>
        <input
          type="text"
          [ngModel]="asText()"
          [disabled]="disabled()"
          (ngModelChange)="onText($event)"
          [attr.data-testid]="'dynamic-property-' + key()"
        />
      </label>
    }
  `,
  styles: `
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 0.75rem;
    }
    .switch-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
    }
    .field-label {
      font-size: 0.75rem;
      color: var(--wb-text-muted, #888);
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
      border: 1.5px solid color-mix(in srgb, var(--wb-text-muted, #888) 85%, #8fa3b8);
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
      background: color-mix(in srgb, var(--wb-text-muted, #888) 70%, #a8b8c8);
      transform: translateY(-50%);
      transition: left 0.15s ease, background-color 0.15s ease;
    }
    .switch-input:checked {
      border-color: color-mix(in srgb, var(--wb-text, #eee) 55%, #7eb0ff);
      background: color-mix(in srgb, var(--wb-text, #eee) 12%, transparent);
    }
    .switch-input:checked::after {
      left: calc(100% - 0.85rem - 2px);
      background: color-mix(in srgb, var(--wb-text, #eee) 80%, #9ec0ff);
    }
    .switch-input:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .switch-input:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--wb-text, #eee) 40%, #7eb0ff);
      outline-offset: 2px;
    }
    input:not(.switch-input),
    textarea {
      font: inherit;
      padding: 0.4rem 0.55rem;
      border-radius: 8px;
      border: 1px solid var(--wb-border, #333);
      background: var(--wb-bg, #111);
      color: var(--wb-text, #eee);
    }
    textarea[readonly] {
      opacity: 0.85;
    }
  `,
})
export class DynamicPropertyComponent {
  readonly key = input.required<string>();
  readonly value = input<unknown>(undefined);
  readonly metadata = input<HostPropertiesField | null>(null);
  readonly disabled = input(false);
  readonly valueChange = output<unknown>();

  label(): string {
    const meta = this.metadata();
    if (meta?.label) {
      return meta.label;
    }
    return this.key();
  }

  kind(): DynamicControlKind {
    const meta = this.metadata();
    if (meta) {
      if (meta.type === 'boolean') {
        return 'boolean';
      }
      if (meta.type === 'number') {
        return 'number';
      }
      if (meta.type === 'textarea') {
        return 'text';
      }
      return 'text';
    }
    return inferControlKind(this.value());
  }

  asBoolean(): boolean {
    return this.value() === true;
  }

  asText(): string {
    const v = this.value();
    if (v === null || v === undefined) {
      return '';
    }
    return String(v);
  }

  asNumber(): number | null {
    const v = this.value();
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
  }

  jsonText(): string {
    try {
      return JSON.stringify(this.value(), null, 2);
    } catch {
      return String(this.value());
    }
  }

  onBoolean(next: boolean): void {
    this.valueChange.emit(next === true);
  }

  onText(next: string): void {
    this.valueChange.emit(next);
  }

  onNumber(next: number | string | null): void {
    if (next === '' || next == null) {
      this.valueChange.emit('');
      return;
    }
    this.valueChange.emit(typeof next === 'number' ? next : Number(next));
  }
}
