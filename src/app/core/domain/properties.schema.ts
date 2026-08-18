import { ALLOWED_NODE_TYPES, type NodeStatus, type NodeType } from './workflow.models';

/** Locked Configuration mock path (under node.data). */
export const LOCKED_CONFIG_PATH = 'config.data.ignore_keys_in_paragraph';

export const LOGIC_NODE_TYPES: readonly NodeType[] = ['Condition', 'Decision', 'Repeater'];

export type XpmsDataType = 'boolean' | 'string' | 'number';

export interface XpmsFieldDescriptor {
  name: string;
  description: string;
  data_type: XpmsDataType;
  op_type?: string;
  value: unknown;
  multi_select: boolean;
  hidden: boolean;
  config_path: string;
  ui_component: string;
  required: boolean;
  basic: boolean;
  placeholder: string | null;
  options: unknown[];
  task_name?: string;
}

export interface NodeTypeSchema {
  type: NodeType;
  configurationFields: XpmsFieldDescriptor[];
}

export const NODE_STATUS_OPTIONS: readonly NodeStatus[] = [
  'idle',
  'running',
  'success',
  'error',
] as const;

function ignoreKeysDescriptor(): XpmsFieldDescriptor {
  return {
    name: 'Ignore Keys in Paragraph',
    description: 'Ignore Keys in Paragraph & Sentence',
    data_type: 'boolean',
    op_type: 'categorical',
    value: true,
    multi_select: false,
    hidden: false,
    config_path: LOCKED_CONFIG_PATH,
    ui_component: '',
    required: false,
    basic: false,
    placeholder: null,
    options: [true, false],
  };
}

function schemaFor(type: NodeType): NodeTypeSchema {
  return {
    type,
    configurationFields: [ignoreKeysDescriptor()],
  };
}

function conditionSchema(): NodeTypeSchema {
  return {
    type: 'Condition',
    configurationFields: [
      {
        name: 'Condition',
        description: 'Expression evaluated for the true/false branch',
        data_type: 'string',
        value: '',
        multi_select: false,
        hidden: false,
        config_path: 'condition',
        ui_component: 'textarea',
        required: true,
        basic: true,
        placeholder: 'Enter Condition',
        options: [],
      },
    ],
  };
}

function decisionSchema(): NodeTypeSchema {
  return {
    type: 'Decision',
    configurationFields: [],
  };
}

function repeaterSchema(): NodeTypeSchema {
  return {
    type: 'Repeater',
    configurationFields: [
      {
        name: 'Workflow/Agent',
        description: 'Nested workflow to repeat',
        data_type: 'string',
        value: '',
        multi_select: false,
        hidden: false,
        config_path: 'repeater.workflowId',
        ui_component: 'select',
        required: true,
        basic: true,
        placeholder: 'Select workflow',
        options: [],
      },
      {
        name: 'Workflow/Agent Version',
        description: 'Version of the selected workflow',
        data_type: 'string',
        value: '',
        multi_select: false,
        hidden: false,
        config_path: 'repeater.versionId',
        ui_component: 'select',
        required: true,
        basic: true,
        placeholder: 'Select version',
        options: [],
      },
      {
        name: 'Pause',
        description: 'Pause this repeater',
        data_type: 'boolean',
        op_type: 'categorical',
        value: false,
        multi_select: false,
        hidden: false,
        config_path: 'repeater.is_paused',
        ui_component: 'checkbox',
        required: false,
        basic: false,
        placeholder: null,
        options: [true, false],
      },
    ],
  };
}

export const NODE_TYPE_SCHEMAS: Readonly<Record<NodeType, NodeTypeSchema>> = {
  Trigger: schemaFor('Trigger'),
  Action: schemaFor('Action'),
  Condition: conditionSchema(),
  Delay: schemaFor('Delay'),
  End: schemaFor('End'),
  Decision: decisionSchema(),
  Repeater: repeaterSchema(),
  Notification: schemaFor('Notification'),
  AIAgent: schemaFor('AIAgent'),
};

export function configurationFieldsFor(type: NodeType): XpmsFieldDescriptor[] {
  return NODE_TYPE_SCHEMAS[type].configurationFields.filter((f) => !f.hidden);
}

/** Stable form control key for a config_path (dots → underscores). */
export function controlKeyForPath(configPath: string): string {
  return configPath.replace(/\./g, '_');
}

export function isLogicNodeType(type: NodeType): boolean {
  return LOGIC_NODE_TYPES.includes(type);
}

/** v1 invariant: non-logic types still have exactly one Ignore Keys boolean. */
export function assertRegistryV1Invariant(): boolean {
  return ALLOWED_NODE_TYPES.filter((type) => !isLogicNodeType(type)).every((type) => {
    const fields = configurationFieldsFor(type);
    return (
      fields.length === 1 &&
      fields[0]!.data_type === 'boolean' &&
      fields[0]!.config_path === LOCKED_CONFIG_PATH
    );
  });
}
