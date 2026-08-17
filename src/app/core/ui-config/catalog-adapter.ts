import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import type { CatalogLoadOptions } from '../data/catalog.types';
import type { PaletteCategory, PaletteItem } from '../domain/palette.catalog';

export type { CatalogLoadMode, CatalogLoadOptions } from '../data/catalog.types';

export interface CatalogAdapterResult {
  items: PaletteItem[];
  categories?: PaletteCategory[];
}

export interface WorkflowBuilderCatalogAdapter {
  load(
    options: CatalogLoadOptions,
  ): Observable<CatalogAdapterResult> | Promise<CatalogAdapterResult>;
}

export const WORKFLOW_BUILDER_CATALOG_SOLUTION =
  new InjectionToken<WorkflowBuilderCatalogAdapter>('WORKFLOW_BUILDER_CATALOG_SOLUTION');

export const WORKFLOW_BUILDER_CATALOG_AGENT = new InjectionToken<WorkflowBuilderCatalogAdapter>(
  'WORKFLOW_BUILDER_CATALOG_AGENT',
);
