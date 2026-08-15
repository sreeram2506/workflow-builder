/** Static mock agents for solution Agents Library when pipeline/list fails. */

import type { PaletteItem } from './palette.catalog';

export const MOCK_SOLUTION_AGENTS: readonly PaletteItem[] = [
  {
    key: 'mock-agent-claims',
    type: 'AIAgent',
    label: 'Claims Intake Agent',
    description: 'Mock agent — triage inbound claims',
    categoryId: 'agents',
    taskId: 'mock-claims',
    taskMeta: { pipeline_id: 'mock-claims', name: 'Claims Intake Agent', mock: true },
  },
  {
    key: 'mock-agent-policy',
    type: 'AIAgent',
    label: 'Policy Check Agent',
    description: 'Mock agent — validate policy rules',
    categoryId: 'agents',
    taskId: 'mock-policy',
    taskMeta: { pipeline_id: 'mock-policy', name: 'Policy Check Agent', mock: true },
  },
  {
    key: 'mock-agent-notify',
    type: 'AIAgent',
    label: 'Notify Desk Agent',
    description: 'Mock agent — desk notifications',
    categoryId: 'agents',
    taskId: 'mock-notify',
    taskMeta: { pipeline_id: 'mock-notify', name: 'Notify Desk Agent', mock: true },
  },
] as const;
