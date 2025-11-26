import type { ShiftTemplate, ShiftTemplateFormData } from 'src/types/shift';

import { generateId } from 'src/types/shift';

// ----------------------------------------------------------------------
// LocalStorage Keys
// ----------------------------------------------------------------------

const STORAGE_KEY = 'shift_templates';

// ----------------------------------------------------------------------
// Shift Template Service
// ----------------------------------------------------------------------

function getStoredTemplates(): ShiftTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTemplates(templates: ShiftTemplate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

// ----------------------------------------------------------------------

export const shiftTemplateService = {
  getAll(): ShiftTemplate[] {
    return getStoredTemplates();
  },

  getById(id: string): ShiftTemplate | undefined {
    const templates = getStoredTemplates();
    return templates.find((t) => t.id === id);
  },

  create(data: ShiftTemplateFormData): ShiftTemplate {
    const templates = getStoredTemplates();
    const now = new Date().toISOString();

    const newTemplate: ShiftTemplate = {
      id: generateId(),
      code: data.code,
      name: data.name,
      description: data.description,
      weekType: data.weekType,
      shiftPattern: data.shiftPattern,
      definitions: data.definitions.map((def) => ({
        id: def.id,
        name: def.name,
        startTime: def.startTime,
        endTime: def.endTime,
        breaks: def.breaks.map((b) => ({
          id: b.id,
          startTime: b.startTime,
          endTime: b.endTime,
          name: b.name,
        })),
        days: def.days,
      })),
      createdAt: now,
      updatedAt: now,
    };

    templates.push(newTemplate);
    saveTemplates(templates);

    return newTemplate;
  },

  update(id: string, data: ShiftTemplateFormData): ShiftTemplate | undefined {
    const templates = getStoredTemplates();
    const index = templates.findIndex((t) => t.id === id);

    if (index === -1) {
      return undefined;
    }

    const updatedTemplate: ShiftTemplate = {
      ...templates[index],
      code: data.code,
      name: data.name,
      description: data.description,
      weekType: data.weekType,
      shiftPattern: data.shiftPattern,
      definitions: data.definitions.map((def) => ({
        id: def.id,
        name: def.name,
        startTime: def.startTime,
        endTime: def.endTime,
        breaks: def.breaks.map((b) => ({
          id: b.id,
          startTime: b.startTime,
          endTime: b.endTime,
          name: b.name,
        })),
        days: def.days,
      })),
      updatedAt: new Date().toISOString(),
    };

    templates[index] = updatedTemplate;
    saveTemplates(templates);

    return updatedTemplate;
  },

  delete(id: string): boolean {
    const templates = getStoredTemplates();
    const index = templates.findIndex((t) => t.id === id);

    if (index === -1) {
      return false;
    }

    templates.splice(index, 1);
    saveTemplates(templates);

    return true;
  },

  deleteMultiple(ids: string[]): number {
    const templates = getStoredTemplates();
    const remaining = templates.filter((t) => !ids.includes(t.id));
    const deletedCount = templates.length - remaining.length;

    saveTemplates(remaining);

    return deletedCount;
  },
};
