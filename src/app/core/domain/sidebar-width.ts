/** Session sidebar resize clamps (expanded panels only). */
export const SIDEBAR_WIDTH_MIN = 240;
export const SIDEBAR_WIDTH_MAX = 480;
export const SIDEBAR_WIDTH_LEFT_DEFAULT = 280;
export const SIDEBAR_WIDTH_RIGHT_DEFAULT = 300;

export function clampSidebarWidth(width: number, viewportWidth = 1200): number {
  const maxAllowed = Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, viewportWidth - 48));
  const n = Number.isFinite(width) ? width : SIDEBAR_WIDTH_LEFT_DEFAULT;
  return Math.min(maxAllowed, Math.max(SIDEBAR_WIDTH_MIN, Math.round(n)));
}
