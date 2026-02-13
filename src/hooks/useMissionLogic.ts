import { useState, useEffect, useCallback } from 'react';
import { formatISO } from 'date-fns';
import type { Mission, AppState } from '../types';
import {
  shouldReset,
  calculateKeyIncrements,
  getNextDailyReset,
  getNextWeeklyReset
} from '../utils/resetLogic';

const STORAGE_KEY = 'bpsr_missions_v5';
const UNDO_LIMIT = 20;

const DEFAULT_STATE: AppState = {
  completed: {},
  ruinsFloor: 0,
  bossKeys: 0,
  eliteKeys: 0,
  lastResetTime: formatISO(new Date()),
  undoStack: []
};

export function useMissionLogic(missions: Mission[]) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_STATE;
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load state', e);
      return DEFAULT_STATE;
    }
  });

  // Init: apply reset logic when missions are loaded
  useEffect(() => {
    if (missions.length === 0) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    let currentState: AppState;

    if (saved) {
      try {
        currentState = JSON.parse(saved);
      } catch {
        currentState = { ...DEFAULT_STATE, lastResetTime: formatISO(new Date()) };
      }
    } else {
      currentState = { ...DEFAULT_STATE, lastResetTime: formatISO(new Date()) };
    }

    const updatedCompleted = { ...currentState.completed };
    let changed = false;

    missions.forEach((m) => {
      const resetInterval = m.metadata?.resetInterval || (m.type as 'daily' | 'weekly') || 'daily';

      if (m.renderType === 'store' && m.subItems) {
        m.subItems.forEach((sub) => {
          const fullId = `${m.id}:${sub.id}`;
          const comp = updatedCompleted[fullId];
          if (comp && shouldReset(comp, resetInterval as any)) {
            updatedCompleted[fullId] = null;
            changed = true;
          }
        });
      } else if (m.renderType === 'raid' && m.subItems) {
        m.subItems.forEach((sub) => {
          ['easy', 'hard', 'night'].forEach((diff) => {
            const fullId = `${m.id}:${sub.id}_${diff}`;
            const comp = updatedCompleted[fullId];
            if (comp && shouldReset(comp, resetInterval as any)) {
              updatedCompleted[fullId] = null;
              changed = true;
            }
          });
        });
      } else {
        const comp = updatedCompleted[m.id];
        if (comp && shouldReset(comp, resetInterval as any)) {
          updatedCompleted[m.id] = null;
          changed = true;
        }
      }
    });

    const increments = calculateKeyIncrements(currentState.lastResetTime);
    let updatedBossKeys = currentState.bossKeys;
    let updatedEliteKeys = currentState.eliteKeys;
    if (increments > 0) {
      updatedBossKeys = Math.min(6, updatedBossKeys + increments);
      updatedEliteKeys = Math.min(6, updatedEliteKeys + increments);
      changed = true;
    }

    const newState: AppState = {
      ...currentState,
      completed: updatedCompleted,
      bossKeys: updatedBossKeys,
      eliteKeys: updatedEliteKeys,
      lastResetTime: increments > 0 || !saved
        ? formatISO(new Date())
        : currentState.lastResetTime,
      lastBiWeeklyResetTime: shouldReset(currentState.lastBiWeeklyResetTime || null, 'bi-weekly')
        ? formatISO(new Date())
        : currentState.lastBiWeeklyResetTime || formatISO(new Date()),
      ruinsFloor: currentState.ruinsFloor ?? 0,
      undoStack: currentState.undoStack ?? []
    };

    setState(newState);
    if (changed || !saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getNextReset = useCallback((type: 'daily' | 'weekly', baseDate: Date = new Date()): Date => {
    return type === 'daily' ? getNextDailyReset(baseDate) : getNextWeeklyReset(baseDate);
  }, []);

  const toggleMission = useCallback((id: string) => {
    setState((prev) => {
      const isCompleted = !!prev.completed[id];
      const newCompleted = { ...prev.completed };

      if (isCompleted) {
        delete newCompleted[id];
      } else {
        newCompleted[id] = formatISO(new Date());
      }

      const newStack = isCompleted
        ? prev.undoStack.filter((v) => v !== id)
        : [id, ...prev.undoStack].slice(0, UNDO_LIMIT);

      return {
        ...prev,
        completed: newCompleted,
        undoStack: newStack
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.undoStack.length === 0) return prev;
      const lastId = prev.undoStack[0];
      const newCompleted = { ...prev.completed };
      delete newCompleted[lastId];
      return {
        ...prev,
        completed: newCompleted,
        undoStack: prev.undoStack.slice(1)
      };
    });
  }, []);

  const setRuinsFloor = useCallback((floor: number) => {
    setState((prev) => ({ ...prev, ruinsFloor: Math.max(0, Math.min(60, floor)) }));
  }, []);

  const setStock = useCallback((type: 'boss' | 'elite', value: number) => {
    const v = Math.max(0, Math.min(6, value));
    setState((prev) => ({
      ...prev,
      [type === 'boss' ? 'bossKeys' : 'eliteKeys']: v
    }));
  }, []);

  const resetAll = useCallback(() => {
    if (window.confirm('全てのリセ可能ミッションをリセットしますか？')) {
      setState({
        ...DEFAULT_STATE,
        bossKeys: 6,
        eliteKeys: 6,
        lastResetTime: formatISO(new Date()),
        undoStack: []
      });
    }
  }, []);

  return {
    state,
    toggleMission,
    undo,
    setRuinsFloor,
    setStock,
    resetAll,
    getNextReset
  };
}
