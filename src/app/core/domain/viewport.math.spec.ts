import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  ZOOM_MAX,
  ZOOM_MIN,
  clampZoom,
  facingPorts,
  fitToContent,
  horizontalBezierPath,
  normalizeRect,
  rectsIntersect,
  screenToWorld,
  worldToScreen,
  zoomAt,
  type Point,
} from './viewport.math';
import type { Viewport } from './workflow.models';

const viewportArb = fc.record({
  x: fc.double({ min: -2000, max: 2000, noNaN: true }),
  y: fc.double({ min: -2000, max: 2000, noNaN: true }),
  scale: fc.double({ min: ZOOM_MIN, max: ZOOM_MAX, noNaN: true }),
});

const pointArb = fc.record({
  x: fc.double({ min: -500, max: 1500, noNaN: true }),
  y: fc.double({ min: -500, max: 1500, noNaN: true }),
});

describe('ViewportMath', () => {
  it('clampZoom keeps scale within bounds (PBT)', () => {
    fc.assert(
      fc.property(fc.double({ min: -10, max: 10, noNaN: true }), (s) => {
        const c = clampZoom(s);
        expect(c).toBeGreaterThanOrEqual(ZOOM_MIN);
        expect(c).toBeLessThanOrEqual(ZOOM_MAX);
      }),
    );
  });

  it('screen↔world round-trip within epsilon (PBT)', () => {
    fc.assert(
      fc.property(viewportArb, pointArb, (vp: Viewport, screen: Point) => {
        const world = screenToWorld(screen, vp);
        const back = worldToScreen(world, vp);
        expect(Math.abs(back.x - screen.x)).toBeLessThan(1e-6);
        expect(Math.abs(back.y - screen.y)).toBeLessThan(1e-6);
      }),
    );
  });

  it('zoomAt keeps world point under cursor stable', () => {
    const vp: Viewport = { x: 10, y: 20, scale: 1 };
    const screen = { x: 100, y: 80 };
    const worldBefore = screenToWorld(screen, vp);
    const next = zoomAt(vp, screen, 1.2);
    const worldAfter = screenToWorld(screen, next);
    expect(Math.abs(worldAfter.x - worldBefore.x)).toBeLessThan(1e-6);
    expect(Math.abs(worldAfter.y - worldBefore.y)).toBeLessThan(1e-6);
    expect(next.scale).toBeCloseTo(1.2);
  });

  it('rectsIntersect detects overlap', () => {
    const a = normalizeRect({ x: 0, y: 0 }, { x: 100, y: 100 });
    const b = normalizeRect({ x: 50, y: 50 }, { x: 150, y: 150 });
    const c = normalizeRect({ x: 200, y: 200 }, { x: 250, y: 250 });
    expect(rectsIntersect(a, b)).toBe(true);
    expect(rectsIntersect(a, c)).toBe(false);
  });

  it('horizontalBezierPath builds a cubic curve', () => {
    const d = horizontalBezierPath({ x: 0, y: 10 }, { x: 100, y: 30 });
    expect(d.startsWith('M 0 10')).toBe(true);
    expect(d).toContain('C ');
    expect(d.endsWith('100 30')).toBe(true);
  });

  it('facingPorts picks left/right for horizontal neighbors', () => {
    const ports = facingPorts({ x: 0, y: 0 }, { x: 400, y: 0 });
    expect(ports.sourceSide).toBe('right');
    expect(ports.targetSide).toBe('left');
  });

  it('facingPorts picks top/bottom for vertical neighbors', () => {
    const ports = facingPorts({ x: 0, y: 0 }, { x: 0, y: 300 });
    expect(ports.sourceSide).toBe('bottom');
    expect(ports.targetSide).toBe('top');
  });

  it('fitToContent keeps scale within clamp (PBT)', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            position: fc.record({
              x: fc.integer({ min: -500, max: 1500 }),
              y: fc.integer({ min: -500, max: 1500 }),
            }),
          }),
          { minLength: 1, maxLength: 12 },
        ),
        fc.integer({ min: 200, max: 1600 }),
        fc.integer({ min: 200, max: 1200 }),
        (nodes, vw, vh) => {
          const vp = fitToContent(nodes, vw, vh);
          expect(vp.scale).toBeGreaterThanOrEqual(ZOOM_MIN);
          expect(vp.scale).toBeLessThanOrEqual(ZOOM_MAX);
          expect(Number.isFinite(vp.x)).toBe(true);
          expect(Number.isFinite(vp.y)).toBe(true);
        },
      ),
    );
  });
});
