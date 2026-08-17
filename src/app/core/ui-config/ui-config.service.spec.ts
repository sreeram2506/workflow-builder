import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, expect, it, afterEach } from 'vitest';
import { UiConfigService } from './ui-config.service';
import { uiConfigAppInitializer } from './ui-config.initializer';
import { provideWorkflowBuilderUi } from './provide-workflow-builder-ui';
import { UI_CONFIG_JSON_URL } from './ui-features.types';

describe('UiConfigService + initializer', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('defaults all-on before applyLayers', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const ui = TestBed.inject(UiConfigService);
    expect(ui.is('topBar.save')).toBe(true);
    expect(ui.is('canvas.save')).toBe(true);
    expect(ui.is('agentsLibrary.enabled')).toBe(true);
    expect(ui.loadStatus().kind).toBe('ok');
  });

  it('unknown path fail-open to true', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const ui = TestBed.inject(UiConfigService);
    expect(ui.is('not.a.real.path')).toBe(true);
  });

  it('404 → missing status; provider still wins', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideWorkflowBuilderUi({ features: { agentsLibrary: { enabled: false } } }),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const ui = TestBed.inject(UiConfigService);

    const initPromise = TestBed.runInInjectionContext(() => uiConfigAppInitializer());
    http.expectOne(UI_CONFIG_JSON_URL).flush(null, { status: 404, statusText: 'Not Found' });
    await initPromise;

    expect(ui.loadStatus().kind).toBe('missing');
    expect(ui.is('agentsLibrary.enabled')).toBe(false);
    expect(ui.is('topBar.save')).toBe(true);
    http.verify();
  });

  it('invalid root → invalid status; defaults + provider', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideWorkflowBuilderUi({ features: { topBar: { save: false } } }),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const ui = TestBed.inject(UiConfigService);

    const initPromise = TestBed.runInInjectionContext(() => uiConfigAppInitializer());
    http.expectOne(UI_CONFIG_JSON_URL).flush([1, 2, 3]);
    await initPromise;

    expect(ui.loadStatus().kind).toBe('invalid');
    expect(ui.is('topBar.save')).toBe(false);
    http.verify();
  });

  it('ok JSON merge then provider wins', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideWorkflowBuilderUi({
          features: { agentsLibrary: { enabled: true } },
        }),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const ui = TestBed.inject(UiConfigService);

    const initPromise = TestBed.runInInjectionContext(() => uiConfigAppInitializer());
    http.expectOne(UI_CONFIG_JSON_URL).flush({
      agentsLibrary: { enabled: false },
      topBar: { save: false },
    });
    await initPromise;

    expect(ui.loadStatus().kind).toBe('ok');
    expect(ui.is('agentsLibrary.enabled')).toBe(true);
    expect(ui.is('topBar.save')).toBe(false);
    http.verify();
  });

  it('focus reload cache-busts JSON and re-applies layers', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpTestingController);
    const ui = TestBed.inject(UiConfigService);

    const initPromise = TestBed.runInInjectionContext(() => uiConfigAppInitializer());
    http.expectOne(UI_CONFIG_JSON_URL).flush({ canvas: { layoutControls: true } });
    await initPromise;
    expect(ui.is('canvas.layoutControls')).toBe(true);

    window.dispatchEvent(new Event('focus'));
    await Promise.resolve();
    const reload = http.expectOne(
      (req) => req.url === UI_CONFIG_JSON_URL && req.params.has('_'),
    );
    reload.flush({ canvas: { layoutControls: false } });
    await Promise.resolve();
    await Promise.resolve();

    expect(ui.is('canvas.layoutControls')).toBe(false);
    http.verify();
  });

  it('JSON palette overlay then provider wins', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideWorkflowBuilderUi({
          features: {
            palette: {
              solution: { types: { mode: 'only', types: ['Condition', 'Repeater'] } },
            },
          },
        }),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const ui = TestBed.inject(UiConfigService);

    const initPromise = TestBed.runInInjectionContext(() => uiConfigAppInitializer());
    http.expectOne(UI_CONFIG_JSON_URL).flush({
      palette: { solution: { types: ['Condition'] } },
    });
    await initPromise;

    expect(ui.features().palette.solution.types).toEqual({
      mode: 'only',
      types: ['Condition', 'Repeater'],
    });
    expect(ui.features().palette.agent.types).toEqual({ mode: 'all' });
    expect(ui.features().palette.solution.defaultAgents).toEqual({ mode: 'omitted' });
    http.verify();
  });
});
