export interface RepeaterMockVersion {
  id: string;
  name: string;
}

export interface RepeaterMockWorkflow {
  id: string;
  name: string;
  versions: RepeaterMockVersion[];
}

/** Static mock catalog (no HTTP). */
export const REPEATER_MOCK_WORKFLOWS: readonly RepeaterMockWorkflow[] = [
  {
    id: 'wf-claims-intake',
    name: 'Claims Intake',
    versions: [
      { id: 'v1', name: 'v1.0' },
      { id: 'v2', name: 'v2.0' },
    ],
  },
  {
    id: 'wf-policy-check',
    name: 'Policy Check',
    versions: [{ id: 'v1', name: 'v1.0' }],
  },
  {
    id: 'wf-notify-desk',
    name: 'Notify Desk',
    versions: [
      { id: 'v1', name: 'v1.0' },
      { id: 'v2', name: 'v2.1' },
    ],
  },
];

export function versionsForWorkflow(workflowId: string): RepeaterMockVersion[] {
  const found = REPEATER_MOCK_WORKFLOWS.find((workflow) => workflow.id === workflowId);
  return found ? found.versions.map((version) => ({ ...version })) : [];
}
