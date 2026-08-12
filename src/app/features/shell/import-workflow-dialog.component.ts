import { Component, ElementRef, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'wb-import-workflow-dialog',
  standalone: true,
  template: `
    <div class="backdrop" role="presentation" (click)="cancel.emit()"></div>
    <div
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-title"
      (click)="$event.stopPropagation()"
    >
      <h2 id="import-title">Import workflow JSON</h2>
      <p class="hint">Choose a .json file or paste JSON. This replaces the current workflow.</p>

      <label class="file-label">
        <span>File</span>
        <input
          #fileInput
          type="file"
          accept="application/json,.json"
          (change)="onFile($event)"
        />
      </label>

      <label class="paste-label" for="import-paste">Paste JSON</label>
      <textarea
        id="import-paste"
        rows="10"
        [value]="text()"
        (input)="onText($event)"
        placeholder='{ "schemaVersion": 1, ... }'
      ></textarea>

      @if (inlineError()) {
        <p class="inline-error" role="alert">{{ inlineError() }}</p>
      }

      <div class="actions">
        <button type="button" class="btn secondary" (click)="cancel.emit()">Cancel</button>
        <button type="button" class="btn primary" (click)="onConfirm()" [disabled]="!text().trim()">
          Import
        </button>
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      background: color-mix(in srgb, #000 45%, transparent);
      z-index: 40;
    }
    .dialog {
      position: fixed;
      z-index: 41;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(520px, 92vw);
      max-height: 85vh;
      overflow: auto;
      padding: 1rem 1.1rem;
      border-radius: 12px;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      box-shadow: var(--wb-shadow-soft);
      color: var(--wb-text);
    }
    h2 {
      margin: 0 0 0.35rem;
      font-size: 1rem;
    }
    .hint {
      margin: 0 0 0.75rem;
      font-size: 0.8rem;
      color: var(--wb-text-muted);
    }
    .file-label,
    .paste-label {
      display: block;
      font-size: 0.75rem;
      margin-bottom: 0.35rem;
      color: var(--wb-text-muted);
    }
    input[type='file'] {
      display: block;
      margin-bottom: 0.75rem;
      font-size: 0.8rem;
    }
    textarea {
      width: 100%;
      box-sizing: border-box;
      border-radius: 8px;
      border: 1px solid var(--wb-border);
      background: var(--wb-bg-canvas);
      color: var(--wb-text);
      padding: 0.5rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
      resize: vertical;
    }
    .inline-error {
      margin: 0.5rem 0 0;
      color: var(--wb-danger);
      font-size: 0.8rem;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.85rem;
    }
    .btn {
      height: 32px;
      padding: 0 0.75rem;
      border-radius: 8px;
      border: 1px solid var(--wb-border);
      cursor: pointer;
      font-size: 0.8rem;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn.primary {
      background: color-mix(in srgb, var(--wb-accent) 22%, transparent);
      border-color: color-mix(in srgb, var(--wb-accent) 45%, var(--wb-border));
      color: var(--wb-text);
    }
    .btn.secondary {
      background: transparent;
      color: var(--wb-text);
    }
  `,
})
export class ImportWorkflowDialogComponent {
  readonly confirm = output<string>();
  readonly cancel = output<void>();

  readonly text = signal('');
  readonly inlineError = signal<string | null>(null);
  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  setInlineError(message: string | null): void {
    this.inlineError.set(message);
  }

  onText(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.text.set(value);
    this.inlineError.set(null);
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.text.set(String(reader.result ?? ''));
      this.inlineError.set(null);
    };
    reader.onerror = () => {
      this.inlineError.set('Failed to read file');
    };
    reader.readAsText(file);
  }

  onConfirm(): void {
    const value = this.text().trim();
    if (!value) {
      this.inlineError.set('Paste or select JSON first');
      return;
    }
    this.confirm.emit(value);
  }
}
