import { ALLOWED_NODE_TYPES, type NodeStatus, type NodeType } from './workflow.models';

/** Locked Configuration mock path (under node.data). */
export const LOCKED_CONFIG_PATH = 'config.data.ignore_keys_in_paragraph';

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

export const NODE_TYPE_SCHEMAS: Readonly<Record<NodeType, NodeTypeSchema>> = {
  Trigger: schemaFor('Trigger'),
  Action: schemaFor('Action'),
  Condition: schemaFor('Condition'),
  Delay: schemaFor('Delay'),
  End: schemaFor('End'),
  Decision: schemaFor('Decision'),
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

export function assertRegistryV1Invariant(): boolean {
  return ALLOWED_NODE_TYPES.every((type) => {
    const fields = configurationFieldsFor(type);
    return (
      fields.length === 1 &&
      fields[0]!.data_type === 'boolean' &&
      fields[0]!.config_path === LOCKED_CONFIG_PATH
    );
  });
}
