import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { extractEnsoPipelines, mapEnsoPipelinesToAgents } from '../domain/enso-pipeline.mapper';
import { extractEnsoTasks, mapEnsoTasksToPalette } from '../domain/enso-task.mapper';
import { MOCK_SOLUTION_AGENTS } from '../domain/mock-agents.catalog';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_CATEGORIES,
  PALETTE_ITEMS,
  type PaletteCategory,
  type PaletteItem,
} from '../domain/palette.catalog';
import type { NodeType } from '../domain/workflow.models';

export interface PaletteCatalogLoad {
  categories: PaletteCategory[];
  items: PaletteItem[];
  source: 'enso' | 'static';
  error: string | null;
}

export type CatalogLoadMode = 'agent-skills' | 'solution-agents';

export interface CatalogLoadOptions {
  mode?: CatalogLoadMode;
  userCategories?: readonly string[];
  includeAgentId?: boolean;
  itemNodeType?: NodeType;
}

@Injectable({ providedIn: 'root' })
export class EnsoTaskCatalogService {
  private readonly http = inject(HttpClient);

  loadCatalog(options: CatalogLoadOptions = {}): Observable<PaletteCatalogLoad> {
    const mode = options.mode ?? 'agent-skills';
    if (mode === 'solution-agents') {
      return this.loadSolutionAgents();
    }
    return this.loadAgentSkills(options);
  }

  /** Solution Agents Library via /api/canvas/pipeline/list (agent pipelines). */
  private loadSolutionAgents(): Observable<PaletteCatalogLoad> {
    const base = this.solutionStaticPalette();
    const withMocks = (error: string | null): PaletteCatalogLoad => ({
      categories: [{ id: 'agents', label: 'Agents' }],
      items: [...base.items, ...MOCK_SOLUTION_AGENTS],
      source: 'static',
      error,
    });

    const token = this.resolveAccessToken();
    if (!token) {
      return of(
        withMocks(
          'Enso auth missing — set environment.ensoAccessToken or localStorage currentUser.accesstoken. Showing mock agents.',
        ),
      );
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
        const pipelines = extractEnsoPipelines(body);
        if (pipelines.length === 0) {
          return withMocks('Enso pipeline/list returned no agents — showing mock agents.');
        }
        const mapped = mapEnsoPipelinesToAgents(pipelines);
        return {
          categories: mapped.categories,
          items: [...base.items, ...mapped.items],
          source: 'enso' as const,
          error: null,
        };
      }),
      catchError((err: unknown) => {
        const message =
          err && typeof err === 'object' && 'status' in err
            ? `Enso pipeline/list failed (HTTP ${(err as { status: number }).status}) — showing mock agents.`
            : 'Enso pipeline/list failed — showing mock agents.';
        return of(withMocks(message));
      }),
    );
  }

  /** Nested agent Skills Library via task/list. */
  private loadAgentSkills(options: CatalogLoadOptions): Observable<PaletteCatalogLoad> {
    const userCategories = options.userCategories ?? environment.ensoUserCategories;
    const includeAgentId = options.includeAgentId ?? true;
    const itemNodeType: NodeType = options.itemNodeType ?? 'Action';
    const staticFallback = this.skillsStaticPalette();

    const token = this.resolveAccessToken();
    if (!token) {
      return of({
        ...staticFallback,
        source: 'static',
        error:
          'Enso auth missing — set environment.ensoAccessToken or localStorage currentUser.accesstoken. Showing static catalog.',
      });
    }

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
        const tasks = extractEnsoTasks(body);
        if (tasks.length === 0) {
          return {
            ...staticFallback,
            source: 'static' as const,
            error: 'Enso task/list returned no tasks — showing static catalog.',
          };
        }
        const mapped = mapEnsoTasksToPalette(tasks, { nodeType: itemNodeType });
        return {
          categories: [...PALETTE_CATEGORIES, ...mapped.categories],
          items: [...PALETTE_ITEMS, ...mapped.items],
          source: 'enso' as const,
          error: null,
        };
      }),
      catchError((err: unknown) => {
        const message =
          err && typeof err === 'object' && 'status' in err
            ? `Enso task/list failed (HTTP ${(err as { status: number }).status}) — showing static catalog.`
            : 'Enso task/list failed — showing static catalog.';
        return of({
          ...staticFallback,
          source: 'static' as const,
          error: message,
        });
      }),
    );
  }

  /** Logic shapes + Blank Agent for solution Agents Library. */
  private solutionStaticPalette(): { categories: PaletteCategory[]; items: PaletteItem[] } {
    const items = PALETTE_ITEMS.filter(
      (i) =>
        (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(i.type) ||
        i.type === BLANK_AGENT_TYPE,
    );
    return { categories: [], items: [...items] };
  }

  private skillsStaticPalette(): { categories: PaletteCategory[]; items: PaletteItem[] } {
    return {
      categories: [...PALETTE_CATEGORIES],
      items: [...PALETTE_ITEMS],
    };
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
    // Allow pasting either raw JWT or "Bearer <jwt>"
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
