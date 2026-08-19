import { Directive, HostListener, inject } from '@angular/core';
import { injectEffectiveUi } from '../../core/ui-config';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

/** Document-level undo/redo/copy/paste/save shortcuts for chrome shells. */
@Directive({
  selector: '[wbChromeShortcuts]',
  standalone: true,
})
export class ChromeShortcutsDirective {
  private readonly facade = inject(WorkflowFacade);
  private readonly ui = injectEffectiveUi();

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
      return;
    }
    const mod = event.metaKey || event.ctrlKey;
    if (!mod) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 'z' && event.shiftKey) {
      event.preventDefault();
      this.facade.redo();
      return;
    }
    if (key === 'y') {
      event.preventDefault();
      this.facade.redo();
      return;
    }
    if (key === 'z') {
      event.preventDefault();
      this.facade.undo();
      return;
    }
    if (key === 'c') {
      event.preventDefault();
      this.facade.copySelection();
      return;
    }
    if (key === 'v') {
      event.preventDefault();
      this.facade.pasteClipboard();
      return;
    }
    if (key === 's') {
      if (!this.ui.is('canvas.save')) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      void this.facade.requestSave();
    }
  }
}
