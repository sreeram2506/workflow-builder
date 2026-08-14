export const environment = {
  production: false,
  /** Dev proxy path → enso-suite-be (see proxy.conf.json). */
  ensoTaskListUrl: '/enso-api/api/canvas/task/list',
  ensoSolutionId: 'sol30',
  ensoUserId: '2',
  ensoAgentId: '74f8d571-205e-4f0a-9624-d703bd70fdb2',
  /**
   * Optional Bearer token override. If empty, reads `localStorage.currentUser.accesstoken`
   * (same shape as enso-suite auth).
   */
  ensoAccessToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJmaXJzdE5hbWUiOm51bGwsImxhc3ROYW1lIjpudWxsLCJkaXNwbGF5TmFtZSI6InNnbSIsInVzZXJOYW1lIjoic2dtIiwicm9sZXMiOlsiYnUiLCJzYSIsInNlIl0sImxvZ3NDb2x1bW5PcmRlciI6WzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzXSwiY3JlYXRlZEF0IjoiMjAyNi0wOC0wM1QwNjowODoyNC40NzdaIiwidXBkYXRlZEF0IjoiMjAyNi0wOC0wM1QwNjowODoyNC40NzdaIiwic29sdXRpb25zIjpbeyJpZCI6MSwic29sdXRpb25faWQiOiJzb2wzMCIsInNvbHV0aW9uX25hbWUiOiJzb2wzMCIsInNvbHV0aW9uX3R5cGUiOiJhdXRvbWF0aW9uIiwic3RhdGUiOiJyZWFkeSJ9LHsiaWQiOjEyLCJzb2x1dGlvbl9pZCI6InNvbDMxIiwic29sdXRpb25fbmFtZSI6InNvbDMxIiwic29sdXRpb25fdHlwZSI6ImF1dG9tYXRpb24iLCJzdGF0ZSI6InJlYWR5In0seyJpZCI6MTMsInNvbHV0aW9uX2lkIjoic29sMzIiLCJzb2x1dGlvbl9uYW1lIjoic29sMzIiLCJzb2x1dGlvbl90eXBlIjoiYXV0b21hdGlvbiIsInN0YXRlIjoicmVhZHkifSx7ImlkIjoxNCwic29sdXRpb25faWQiOiJzb2wzMyIsInNvbHV0aW9uX25hbWUiOiJzb2wzMyIsInNvbHV0aW9uX3R5cGUiOiJhdXRvbWF0aW9uIiwic3RhdGUiOiJyZWFkeSJ9XX0sImlhdCI6MTc4NjcxMDI2MiwiZXhwIjoxNzg2NzEzODYyfQ.XjNX2yd1rBrlbT3x-Stp_sHC49LkfwTfcUnCs1LCPTU',
  ensoUserCategories: [
    'Domain Extraction',
    'Domain Object Postprocessing',
    'Custom',
    'Feedback',
    'Document Extraction',
    'ML Operations',
    'Monitoring',
    'Document Preprocessing',
    'Benchmarking',
    'Data Manipulation',
    'Function',
    'Content Management',
    'GenAI',
    'Execution',
  ] as readonly string[],
  /** U6 edge-routing grid cell size (world px). */
  routingGridSize: 16,
  /** U6 obstacle padding around node AABB (world px). */
  routingObstaclePadding: 8,
  /** U8 simulated Run step delay (ms). Reduced-motion still wins (≤50 ms). */
  runStepDelayMs: 400,
};
