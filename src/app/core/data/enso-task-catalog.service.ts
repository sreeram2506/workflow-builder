import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { extractEnsoTasks, mapEnsoTasksToPalette } from '../domain/enso-task.mapper';
import {
  PALETTE_CATEGORIES,
  PALETTE_ITEMS,
  type PaletteCategory,
  type PaletteItem,
} from '../domain/palette.catalog';

export interface PaletteCatalogLoad {
  categories: PaletteCategory[];
  items: PaletteItem[];
  source: 'enso' | 'static';
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class EnsoTaskCatalogService {
  private readonly http = inject(HttpClient);

  loadCatalog(): Observable<PaletteCatalogLoad> {
    const token = this.resolveAccessToken();
    if (!token) {
      return of({
        categories: [...PALETTE_CATEGORIES],
        items: [...PALETTE_ITEMS],
        source: 'static',
        error:
          'Enso auth missing — set environment.ensoAccessToken or localStorage currentUser.accesstoken. Showing static catalog.',
      });
    }

    const payload = {
      data: { user_category: [...environment.ensoUserCategories] },
      solution_id: environment.ensoSolutionId,
      user_id: this.resolveUserId(),
      agent_id: environment.ensoAgentId,
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<unknown>(environment.ensoTaskListUrl, payload, { headers }).pipe(
      map((body) => {
        const tasks = extractEnsoTasks(body);
        if (tasks.length === 0) {
          return {
            categories: [...PALETTE_CATEGORIES],
            items: [...PALETTE_ITEMS],
            source: 'static' as const,
            error: 'Enso task/list returned no tasks — showing static catalog.',
          };
        }
        const mapped = mapEnsoTasksToPalette(tasks);
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
          categories: [...PALETTE_CATEGORIES],
          items: [...PALETTE_ITEMS],
          source: 'static' as const,
          error: message,
        });
      }),
    );
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
