import type { NodeType } from './workflow.models';

export const HOST_PROPERTIES_FIELD_TYPES = [
  'text',
  'number',
  'boolean',
  'select',
  'multiselect',
  'textarea',
] as const;

export type HostPropertiesFieldType = (typeof HOST_PROPERTIES_FIELD_TYPES)[number];

export type HostPropertiesOption = string | { value: string; label: string };

export interface HostPropertiesField {
  type: HostPropertiesFieldType;
  path: string;
  label: string;
  required?: boolean;
  hidden?: boolean;
  options?: HostPropertiesOption[];
  placeholder?: string | null;
  ui_component?: string;
}

export interface HostPropertiesSection {
  id?: string;
  title?: string;
  fields: HostPropertiesField[];
}

export interface HostPropertiesSchema {
  sections: HostPropertiesSection[];
}

const FIELD_TYPE_SET = new Set<string>(HOST_PROPERTIES_FIELD_TYPES);

const KNOWN_UI_COMPONENTS = new Set<string>([
  '',
  'text',
  'number',
  'boolean',
  'select',
  'multiselect',
  'textarea',
  'checkbox',
]);

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isUnsafeFieldPath(path: string): boolean {
  const trimmed = path.trim();
  if (trimmed.length === 0) {
    return true;
  }
  if (trimmed.includes('..')) {
    return true;
  }
  return trimmed.split('.').some((part) => part.length === 0);
}

export function optionValue(opt: HostPropertiesOption): string {
  return typeof opt === 'string' ? opt : String(opt.value);
}

export function optionLabel(opt: HostPropertiesOption): string {
  return typeof opt === 'string' ? opt : opt.label;
}

export function displayHostFieldValue(field: HostPropertiesField, raw: unknown): unknown {
  if (field.type === 'boolean') {
    return raw === true;
  }
  if (field.type === 'multiselect') {
    return Array.isArray(raw) ? raw.map(String) : [];
  }
  if (raw === undefined || raw === null) {
    return '';
  }
  return String(raw);
}

export function coerceHostFieldValue(field: HostPropertiesField, raw: unknown): unknown {
  if (field.type === 'boolean') {
    return raw === true || raw === 'true';
  }
  if (field.type === 'number') {
    if (raw === '' || raw == null) {
      return raw;
    }
    return Number(raw);
  }
  if (field.type === 'multiselect') {
    return Array.isArray(raw) ? raw.map(String) : [];
  }
  return raw == null ? '' : String(raw);
}

export function isKnownUiComponent(uiComponent: string | undefined): boolean {
  if (uiComponent == null) {
    return true;
  }
  return KNOWN_UI_COMPONENTS.has(uiComponent.trim());
}

function asFieldType(value: unknown): HostPropertiesFieldType | null {
  return typeof value === 'string' && FIELD_TYPE_SET.has(value)
    ? (value as HostPropertiesFieldType)
    : null;
}

function sanitizeField(raw: unknown): HostPropertiesField | null {
  if (!isPlainObject(raw)) {
    return null;
  }
  const type = asFieldType(raw['type']);
  const path = typeof raw['path'] === 'string' ? raw['path'] : '';
  if (!type || isUnsafeFieldPath(path)) {
    return null;
  }
  const label = typeof raw['label'] === 'string' && raw['label'].trim().length > 0 ? raw['label'] : path;
  const field: HostPropertiesField = {
    type,
    path: path.trim(),
    label,
  };
  if (raw['required'] === true) {
    field.required = true;
  }
  if (raw['hidden'] === true) {
    field.hidden = true;
  }
  if (Array.isArray(raw['options'])) {
    field.options = raw['options'] as HostPropertiesOption[];
  }
  if (typeof raw['placeholder'] === 'string') {
    field.placeholder = raw['placeholder'];
  } else if (raw['placeholder'] === null) {
    field.placeholder = null;
  }
  if (typeof raw['ui_component'] === 'string') {
    field.ui_component = raw['ui_component'];
  }
  return field;
}

function sanitizeSection(raw: unknown): HostPropertiesSection | null {
  if (!isPlainObject(raw)) {
    return null;
  }
  const fieldsIn = Array.isArray(raw['fields']) ? raw['fields'] : [];
  const fields = fieldsIn.map(sanitizeField).filter((field): field is HostPropertiesField => field != null);
  const section: HostPropertiesSection = { fields };
  if (typeof raw['id'] === 'string') {
    section.id = raw['id'];
  }
  if (typeof raw['title'] === 'string') {
    section.title = raw['title'];
  }
  return section;
}

/** Skip invalid fields; never throw. `{}` becomes `{ sections: [] }`. */
export function sanitizeHostPropertiesSchema(raw: unknown): HostPropertiesSchema {
  if (!isPlainObject(raw)) {
    return { sections: [] };
  }
  const sectionsIn = Array.isArray(raw['sections']) ? raw['sections'] : [];
  const sections = sectionsIn
    .map(sanitizeSection)
    .filter((section): section is HostPropertiesSection => section != null);
  return { sections };
}

export function visibleHostSections(schema: HostPropertiesSchema): HostPropertiesSection[] {
  return schema.sections
    .map((section) => ({
      ...section,
      fields: section.fields.filter((field) => field.hidden !== true),
    }))
    .filter((section) => section.fields.length > 0);
}

export function logicBuiltinPropertiesSchema(type: NodeType): HostPropertiesSchema | null {
  if (type === 'Condition') {
    return {
      sections: [
        {
          title: 'Condition',
          fields: [
            {
              type: 'textarea',
              path: 'condition',
              label: 'Condition',
              required: true,
              placeholder: 'Enter Condition',
            },
          ],
        },
      ],
    };
  }
  if (type === 'Decision') {
    return { sections: [] };
  }
  if (type === 'Repeater') {
    return {
      sections: [
        {
          title: 'Repeater',
          fields: [
            {
              type: 'select',
              path: 'repeater.workflowId',
              label: 'Workflow/Agent',
              required: true,
              placeholder: 'Select workflow',
              options: [],
            },
            {
              type: 'select',
              path: 'repeater.versionId',
              label: 'Workflow/Agent Version',
              required: true,
              placeholder: 'Select version',
              options: [],
            },
            {
              type: 'boolean',
              path: 'repeater.is_paused',
              label: 'Pause',
              ui_component: 'checkbox',
            },
          ],
        },
      ],
    };
  }
  return null;
}
