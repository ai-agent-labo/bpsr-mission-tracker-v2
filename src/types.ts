export type MissionType = 'daily' | 'weekly' | 'event';
export type RenderType = 'checkbox' | 'store' | 'raid' | 'ruins' | 'stock';

export interface SubItem {
  id: string;
  name: string;
}

export interface Mission {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'event';
  category: 'daily' | 'weekly' | 'other';
  image: string;
  bgImage?: string;
  description?: string;
  renderType?: RenderType;
  subItems?: SubItem[];
  metadata?: {
    stockType?: 'boss' | 'elite';
    resetInterval?: 'daily' | 'weekly' | 'bi-weekly';
    activeDays?: string[]; // e.g., ['Friday', 'Saturday', 'Sunday']
    activeTimeRange?: { start: string; end: string }; // e.g., { start: '10:00', end: '22:00' }
    isLocked?: boolean;
    [key: string]: unknown;
  };
}

export interface AppState {
  completed: Record<string, string | null>;
  ruinsFloor: number;
  bossKeys: number;
  eliteKeys: number;
  lastResetTime: string;
  lastBiWeeklyResetTime?: string;
  undoStack: string[];
}
