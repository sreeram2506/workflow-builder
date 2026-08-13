import { describe, expect, it } from 'vitest';
import {
  SIDEBAR_WIDTH_MAX,
  SIDEBAR_WIDTH_MIN,
  clampSidebarWidth,
} from './sidebar-width';

describe('sidebar-width', () => {
  it('clamps to min/max', () => {
    expect(clampSidebarWidth(100, 1200)).toBe(SIDEBAR_WIDTH_MIN);
    expect(clampSidebarWidth(900, 1200)).toBe(SIDEBAR_WIDTH_MAX);
    expect(clampSidebarWidth(300, 1200)).toBe(300);
  });

  it('respects viewport ceiling', () => {
    expect(clampSidebarWidth(400, 280)).toBe(SIDEBAR_WIDTH_MIN);
  });
});
