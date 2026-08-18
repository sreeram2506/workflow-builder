export const environment = {
  production: false,
  /** U6 edge-routing grid cell size (world px). */
  routingGridSize: 16,
  /** U6 obstacle padding around node AABB (world px). */
  routingObstaclePadding: 8,
  /** U8 simulated Run step delay (ms). Reduced-motion still wins (≤50 ms). */
  runStepDelayMs: 400,
};
