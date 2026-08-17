import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { environment } from '../../../environments/environment';
import { extractEnsoPipelines, mapEnsoPipelinesToAgents } from '../domain/enso-pipeline.mapper';
import { extractEnsoTasks, mapEnsoTasksToPalette } from '../domain/enso-task.mapper';
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
type CatalogErrorOrigin = 'enso-solution' | 'enso-skills' | 'adapter';

const BUILTIN_SUFFIX = 'Showing built-in types only.';

@Injectable({ providedIn: 'root' })
export class EnsoTaskCatalogService {
  private readonly http = inject(HttpClient);
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
      const composed = this.composeSolution(remote, undefined, defaults);
      return {
        ...composed,
        source: 'host',
        error: null,
        emptyRemote: false,
      };
    }
    const composed = this.composeSkills(remote, undefined);
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
        map((remote) => this.classifyAndCompose('solution', remote, 'adapter', defaults)),
        catchError((err: unknown) =>
          of(this.errorLoad('solution', this.safeErrorMessage(err, 'adapter'), defaults)),
        ),
      );
    }
    return this.loadEnsoPipelines().pipe(
      map((remote) => this.classifyAndCompose('solution', remote, 'enso', defaults)),
      catchError((err: unknown) =>
        of(this.errorLoad('solution', this.safeErrorMessage(err, 'enso-solution'), defaults)),
      ),
    );
  }

  private loadAgentSkills(options: CatalogLoadOptions): Observable<PaletteCatalogLoad> {
    if (this.agentAdapter) {
      return this.readAdapter(this.agentAdapter, options).pipe(
        map((remote) => this.classifyAndCompose('skills', remote, 'adapter')),
        catchError((err: unknown) =>
          of(this.errorLoad('skills', this.safeErrorMessage(err, 'adapter'))),
        ),
      );
    }
    return this.loadEnsoTasks(options).pipe(
      map((remote) => this.classifyAndCompose('skills', remote, 'enso')),
      catchError((err: unknown) =>
        of(this.errorLoad('skills', this.safeErrorMessage(err, 'enso-skills'))),
      ),
    );
  }

  private classifyAndCompose(
    canvas: CatalogCanvas,
    remote: CatalogAdapterResult,
    source: 'enso' | 'adapter',
    defaultAgentsOverride?: DefaultAgentsState,
  ): PaletteCatalogLoad {
    if (remote.items.length === 0) {
      return {
        categories: [],
        items: [],
        source: 'empty',
        error: null,
        emptyRemote: true,
      };
    }
    if (canvas === 'solution') {
      const composed = this.composeSolution(remote.items, remote.categories, defaultAgentsOverride);
      return {
        ...composed,
        source,
        error: null,
        emptyRemote: false,
      };
    }
    const composed = this.composeSkills(remote.items, remote.categories);
    return {
      ...composed,
      source,
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
  ): { categories: PaletteCategory[]; items: PaletteItem[] } {
    const cfg = this.uiConfig.features().palette.solution;
    const staticItems = PALETTE_ITEMS.filter(
      (item) =>
        (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(item.type) ||
        item.type === BLANK_AGENT_TYPE,
    );
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
  ): { categories: PaletteCategory[]; items: PaletteItem[] } {
    const cfg = this.uiConfig.features().palette.agent;
    const filteredStatic = filterPaletteItemsByAllowList(PALETTE_ITEMS, cfg.types);
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

  private loadEnsoPipelines(): Observable<CatalogAdapterResult> {
    const token = this.resolveAccessToken();
    if (!token) {
      return throwError(() => ({ status: 0, code: 'auth' as const }));
    }
    const payload = {
      data: {
        pipeline_type: 'agent',
        agg_version_info: true,
        workflow_id: environment.ensoWorkflowId,
        workflow_version_id: environment.ensoWorkflowVersionId,
      },
      solution_id: environment.ensoSolutionId,
      user_id: this.resolveUserId(),
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<unknown>(environment.ensoPipelineListUrl, payload, { headers }).pipe(
      map((body) => {
        const mapped = mapEnsoPipelinesToAgents(extractEnsoPipelines(body));
        return { items: mapped.items, categories: mapped.categories };
      }),
    );
  }

  private loadEnsoTasks(options: CatalogLoadOptions): Observable<CatalogAdapterResult> {
    const token = this.resolveAccessToken();
    if (!token) {
      return throwError(() => ({ status: 0, code: 'auth' as const }));
    }
    const userCategories = options.userCategories ?? environment.ensoUserCategories;
    const includeAgentId = options.includeAgentId ?? true;
    const itemNodeType: NodeType = options.itemNodeType ?? 'Action';
    const payload: Record<string, unknown> = {
      data: { user_category: [...userCategories] },
      solution_id: environment.ensoSolutionId,
      user_id: this.resolveUserId(),
    };
    if (includeAgentId) {
      payload['agent_id'] = environment.ensoAgentId;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<unknown>(environment.ensoTaskListUrl, payload, { headers }).pipe(
      map((body) => {
        const mapped = mapEnsoTasksToPalette(extractEnsoTasks(body), { nodeType: itemNodeType });
        return { items: mapped.items, categories: mapped.categories };
      }),
    );
  }

  private safeErrorMessage(err: unknown, origin: CatalogErrorOrigin): string {
    if (origin === 'adapter') {
      return `Catalog adapter failed. ${BUILTIN_SUFFIX}`;
    }
    if (this.isAuthError(err)) {
      return `Enso auth missing. ${BUILTIN_SUFFIX}`;
    }
    const status = this.httpStatus(err);
    if (origin === 'enso-solution') {
      return status != null
        ? `Enso pipeline/list failed (HTTP ${status}). ${BUILTIN_SUFFIX}`
        : `Enso pipeline/list failed. ${BUILTIN_SUFFIX}`;
    }
    return status != null
      ? `Enso task/list failed (HTTP ${status}). ${BUILTIN_SUFFIX}`
      : `Enso task/list failed. ${BUILTIN_SUFFIX}`;
  }

  private isAuthError(err: unknown): boolean {
    return !!err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'auth';
  }

  private httpStatus(err: unknown): number | null {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status: unknown }).status;
      return typeof status === 'number' ? status : null;
    }
    return null;
  }

  private resolveAccessToken(): string | null {
    let token = environment.ensoAccessToken.trim();
    if (!token) {
      try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) {
          return null;
        }
        const user = JSON.parse(raw) as { accesstoken?: string };
        token = user.accesstoken?.trim() || '';
      } catch {
        return null;
      }
    }
    if (!token) {
      return null;
    }
    return token.replace(/^Bearer\s+/i, '');
  }

  private resolveUserId(): string {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const user = JSON.parse(raw) as { id?: string | number };
        if (user.id != null) {
          return String(user.id);
        }
      }
    } catch {
      /* fall through */
    }
    return environment.ensoUserId;
  }
}
