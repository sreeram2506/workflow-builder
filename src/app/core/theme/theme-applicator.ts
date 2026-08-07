import { Injectable } from '@angular/core';
import type { Theme } from '../domain/workflow.models';

@Injectable({ providedIn: 'root' })
export class ThemeApplicator {
  apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
