import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  from,
  isObservable,
  map,
  of,
  throwError,
} from 'rxjs';
import {
  applySolutionDefaultAgents,
  aiAgentAllowed,
  filterPaletteItemsByAllowList,
  resolveDefaultAgents,
  sanitizeHostDefaultAgents,
  sanitizeHostPaletteItems,
} from '../domain/palette-host.helpers';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_CATEGORIES,
  PALETTE_ITEMS,
  type PaletteCategory,
  type PaletteItem,
} from '../domain/palette.catalog';
import type { NodeType } from '../domain/workflow.models';
import {
  WORKFLOW_BUILDER_CATALOG_AGENT,
  WORKFLOW_BUILDER_CATALOG_SOLUTION,
  type CatalogAdapterResult,
  type WorkflowBuilderCatalogAdapter,
} from '../ui-config/catalog-adapter';
import { UiConfigService } from '../ui-config/ui-config.service';
import type { DefaultAgentsState } from '../ui-config/ui-features.types';
import type {
  CatalogLoadMode,
  CatalogLoadOptions,
  PaletteCatalogLoad,
} from './catalog.types';

export type { CatalogLoadMode, CatalogLoadOptions, PaletteCatalogLoad } from './catalog.types';

type CatalogCanvas = 'solution' | 'skills';

const BUILTIN_SUFFIX = 'Showing built-in types only.';

function emptyRemoteLoad(): PaletteCatalogLoad {
  return {
    categories: [],
    items: [],
    source: 'empty',
    error: null,
    emptyRemote: true,
  };
}

@Injectable({ providedIn: 'root' })
export class EnsoTaskCatalogService {
  private readonly uiConfig = inject(UiConfigService);
  private readonly solutionAdapter = inject(WORKFLOW_BUILDER_CATALOG_SOLUTION, { optional: true });
  private readonly agentAdapter = inject(WORKFLOW_BUILDER_CATALOG_AGENT, { optional: true });

  loadCatalog(options: CatalogLoadOptions = {}): Observable<PaletteCatalogLoad> {
    const mode = options.mode ?? 'agent-skills';
    if (options.hostPalettes !== undefined) {
      return of(this.hostOverlayLoad(mode === 'solution-agents' ? 'solution' : 'skills', options));
    }
    if (mode === 'solution-agents') {
      return this.loadSolutionAgents(options);
    }
    return this.loadAgentSkills(options);
  }

  private hostOverlayLoad(canvas: CatalogCanvas, options: CatalogLoadOptions): PaletteCatalogLoad {
    const raw = options.hostPalettes ?? [];
    if (raw.length === 0) {
      return {
        categories: [],
        items: [],
        source: 'host',
        error: null,
        emptyRemote: true,
      };
    }
    const fallback = canvas === 'solution' ? 'agents' : 'flow';
    const remote = sanitizeHostPaletteItems(raw, fallback);
    const defaults = this.hostDefaultAgentsState(options);
    if (canvas === 'solution') {
      const composed = this.composeSolution(remote, undefined, defaults, remote.length > 0);
      return {
        ...composed,
        source: 'host',
        error: null,
        emptyRemote: false,
      };
    }
    const composed = this.composeSkills(remote, undefined, remote.length > 0);
    return {
      ...composed,
      source: 'host',
      error: null,
      emptyRemote: false,
    };
  }

  private hostDefaultAgentsState(options: CatalogLoadOptions): DefaultAgentsState | undefined {
    if (options.hostDefaultAgents === undefined) {
      return undefined;
    }
    return { mode: 'present', cards: sanitizeHostDefaultAgents(options.hostDefaultAgents) };
  }

  private loadSolutionAgents(options: CatalogLoadOptions): Observable<PaletteCatalogLoad> {
    const defaults = this.hostDefaultAgentsState(options);
    if (this.solutionAdapter) {
      return this.readAdapter(this.solutionAdapter, options).pipe(
        map((remote) => this.classifyAndCompose('solution', remote, defaults)),
        catchError((err: unknown) =>
          of(this.errorLoad('solution', this.safeErrorMessage(err), defaults)),
        ),
      );
    }
    return of(emptyRemoteLoad());
  }

  private loadAgentSkills(options: CatalogLoadOptions): Observable<PaletteCatalogLoad> {
    if (this.agentAdapter) {
      return this.readAdapter(this.agentAdapter, options).pipe(
        map((remote) => this.classifyAndCompose('skills', remote)),
        catchError((err: unknown) => of(this.errorLoad('skills', this.safeErrorMessage(err)))),
      );
    }
    return of(emptyRemoteLoad());
  }

  private classifyAndCompose(
    canvas: CatalogCanvas,
    remote: CatalogAdapterResult,
    defaultAgentsOverride?: DefaultAgentsState,
  ): PaletteCatalogLoad {
    if (remote.items.length === 0) {
      return emptyRemoteLoad();
    }
    if (canvas === 'solution') {
      const composed = this.composeSolution(remote.items, remote.categories, defaultAgentsOverride);
      return {
        ...composed,
        source: 'adapter',
        error: null,
        emptyRemote: false,
      };
    }
    const composed = this.composeSkills(remote.items, remote.categories);
    return {
      ...composed,
      source: 'adapter',
      error: null,
      emptyRemote: false,
    };
  }

  private errorLoad(
    canvas: CatalogCanvas,
    message: string,
    defaultAgentsOverride?: DefaultAgentsState,
  ): PaletteCatalogLoad {
    if (canvas === 'solution') {
      const composed = this.composeSolution([], [], defaultAgentsOverride);
      return {
        categories: [],
        items: composed.items,
        source: 'static',
        error: message,
        emptyRemote: false,
      };
    }
    const composed = this.composeSkills([], []);
    return {
      ...composed,
      source: 'static',
      error: message,
      emptyRemote: false,
    };
  }

  private composeSolution(
    remoteItems: readonly PaletteItem[],
    remoteCategories: readonly PaletteCategory[] | undefined,
    defaultAgentsOverride?: DefaultAgentsState,
    omitStaticFeatured = false,
  ): { categories: PaletteCategory[]; items: PaletteItem[] } {
    const cfg = this.uiConfig.features().palette.solution;
    const staticItems = PALETTE_ITEMS.filter((item) => {
      const isFeatured = (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(item.type);
      if (omitStaticFeatured && isFeatured) {
        return false;
      }
      return isFeatured || item.type === BLANK_AGENT_TYPE;
    });
    const filtered = filterPaletteItemsByAllowList(staticItems, cfg.types);
    const defaults = resolveDefaultAgents(
      defaultAgentsOverride ?? cfg.defaultAgents,
      aiAgentAllowed(cfg.types),
    );
    const withDefaults = applySolutionDefaultAgents(filtered, defaults);
    const remoteFiltered = filterPaletteItemsByAllowList(remoteItems, cfg.types);
    return {
      categories: remoteCategories?.length
        ? [...remoteCategories]
        : [{ id: 'agents', label: 'Agents' }],
      items: [...withDefaults, ...remoteFiltered],
    };
  }

  private composeSkills(
    remoteItems: readonly PaletteItem[],
    remoteCategories: readonly PaletteCategory[] | undefined,
    omitStaticFeatured = false,
  ): { categories: PaletteCategory[]; items: PaletteItem[] } {
    const cfg = this.uiConfig.features().palette.agent;
    const staticSource = omitStaticFeatured
      ? PALETTE_ITEMS.filter(
        (item) => !(FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(item.type),
      )
      : PALETTE_ITEMS;
    const filteredStatic = filterPaletteItemsByAllowList(staticSource, cfg.types);
    const remoteFiltered = filterPaletteItemsByAllowList(remoteItems, cfg.types);
    const extra = (remoteCategories ?? []).filter(
      (cat) => !PALETTE_CATEGORIES.some((base) => base.id === cat.id),
    );
    return {
      categories: [...PALETTE_CATEGORIES, ...extra],
      items: [...filteredStatic, ...remoteFiltered],
    };
  }

  private readAdapter(
    adapter: WorkflowBuilderCatalogAdapter,
    options: CatalogLoadOptions,
  ): Observable<CatalogAdapterResult> {
    let raw: ReturnType<WorkflowBuilderCatalogAdapter['load']>;
    try {
      raw = adapter.load(options);
    } catch {
      return throwError(() => new Error('adapter-throw'));
    }
    const stream = isObservable(raw) ? raw : from(Promise.resolve(raw));
    return stream.pipe(
      map((value) => {
        if (!value || typeof value !== 'object' || !Array.isArray(value.items)) {
          throw new Error('adapter-shape');
        }
        return {
          items: value.items,
          categories: value.categories,
        };
      }),
    );
  }

  private safeErrorMessage(_err: unknown): string {
    return `Catalog adapter failed. ${BUILTIN_SUFFIX}`;
  }
}
