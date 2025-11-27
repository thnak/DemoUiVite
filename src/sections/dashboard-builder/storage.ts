import type { DashboardState } from './types';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'dashboard-builder-dashboards';

// Get all saved dashboards from localStorage
export function getAllDashboards(): DashboardState[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as DashboardState[];
  } catch (error) {
    console.error('Error loading dashboards from localStorage:', error);
    return [];
  }
}

// Get a specific dashboard by ID
export function getDashboardById(id: string): DashboardState | undefined {
  const dashboards = getAllDashboards();
  return dashboards.find((d) => d.id === id);
}

// Save a dashboard (create or update)
export function saveDashboard(dashboard: DashboardState): void {
  try {
    const dashboards = getAllDashboards();
    const existingIndex = dashboards.findIndex((d) => d.id === dashboard.id);

    const updatedDashboard = {
      ...dashboard,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      dashboards[existingIndex] = updatedDashboard;
    } else {
      dashboards.push({
        ...updatedDashboard,
        createdAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
  } catch (error) {
    console.error('Error saving dashboard to localStorage:', error);
    throw error;
  }
}

// Delete a dashboard by ID
export function deleteDashboard(id: string): void {
  try {
    const dashboards = getAllDashboards();
    const filtered = dashboards.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting dashboard from localStorage:', error);
    throw error;
  }
}

// Generate URL for a dashboard
export function getDashboardUrl(id: string): string {
  return `/dashboard-builder/${id}`;
}

// Generate a unique ID for widgets and dashboards
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
