import { useState, useEffect, useMemo } from 'react';
import { useMissionLogic } from './hooks/useMissionLogic';
import { DEFAULT_MISSIONS } from './data/missions';
import { fetchMissionsFromSheet } from './utils/googleSheets';
import type { Mission } from './types';
import { Card } from './components/Card';
import { StockGauge } from './components/StockGauge';
import { RuinsSelector } from './components/RuinsSelector';
import { RaidGrid } from './components/RaidGrid';
import { CheckListCard } from './components/CheckListCard';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Undo2,
  Clock,
  Gamepad2,
  Loader2
} from 'lucide-react';
import { format, differenceInSeconds, parseISO } from 'date-fns';
import { cn } from './lib/utils';
import { isMissionActive } from './utils/resetLogic';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1W52YwzHD-XvmB-sT45VE9NIHOa4EneW_aUqKIfk1c6I/edit?usp=sharing';

export default function App() {
  const [missions, setMissions] = useState<Mission[]>(DEFAULT_MISSIONS);
  const [isLoadingSheet, setIsLoadingSheet] = useState(true);

  const {
    state,
    toggleMission,
    undo,
    setRuinsFloor,
    setStock,
    resetAll,
    getNextReset
  } = useMissionLogic(missions);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingSheet(true);
    fetchMissionsFromSheet(SHEET_URL)
      .then((dynamic) => {
        if (cancelled) return;
        const combined = [
          ...DEFAULT_MISSIONS,
          ...dynamic.filter(
            (m) => !DEFAULT_MISSIONS.some((dm) => dm.id === m.id)
          )
        ];
        setMissions(combined);
      })
      .catch(() => {
        if (!cancelled) setMissions(DEFAULT_MISSIONS);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSheet(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const nextDaily = getNextReset('daily');
  const secondsToReset = Math.max(0, differenceInSeconds(nextDaily, now));
  const hours = Math.floor(secondsToReset / 3600);
  const minutes = Math.floor((secondsToReset % 3600) / 60);
  const secs = secondsToReset % 60;

  const activeMissions = useMemo(() => {
    return missions.filter(m => isMissionActive(m, now));
  }, [missions, now]);

  const dailyMissions = activeMissions.filter((m) => m.category === 'daily');
  const weeklyMissions = activeMissions.filter((m) => m.category === 'weekly');

  const checkboxDaily = dailyMissions.filter(
    (m) => !m.renderType || m.renderType === 'checkbox'
  );
  const dailyProgress =
    checkboxDaily.length === 0
      ? 0
      : Math.round(
        (checkboxDaily.filter((m) => !!state.completed[m.id]).length /
          checkboxDaily.length) *
        100
      );


  // For weekly, we calculate sub-item progress if applicable

  // For weekly, we calculate sub-item progress if applicable
  const getWeeklyProgress = () => {
    let total = 0;
    let done = 0;
    weeklyMissions.forEach(m => {
      if (m.renderType === 'store' || m.renderType === 'raid') {
        const subItems = m.subItems ?? [];
        if (m.renderType === 'raid') {
          // Raid has 3 subitems * 3 diffs = 9
          subItems.forEach(s => {
            ['easy', 'hard', 'night'].forEach(diff => {
              total++;
              if (state.completed[`${m.id}:${s.id}_${diff}`]) done++;
            });
          });
        } else {
          subItems.forEach(s => {
            total++;
            if (state.completed[`${m.id}:${s.id}`]) done++;
          });
        }
      } else if (m.renderType === 'ruins') {
        // Ruins is just one value, but let's count it as a task
        total++;
        if (state.ruinsFloor > 0) done++;
      } else {
        total++;
        if (state.completed[m.id]) done++;
      }
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const weeklyProgress = getWeeklyProgress();

  const renderMissionCard = (mission: Mission) => {
    const isDone = !!state.completed[mission.id];

    // Multi-item types
    if (mission.renderType === 'store') {
      return (
        <Card key={mission.id} bgImage={mission.bgImage} className="lg:row-span-2">
          <CheckListCard
            name={mission.name}
            subItems={mission.subItems ?? []}
            parentId={mission.id}
            completed={state.completed}
            onToggle={toggleMission}
          />
        </Card>
      );
    }

    if (mission.renderType === 'raid') {
      return (
        <Card key={mission.id} className="border-cyan-500/20 md:col-span-2 h-full" bgImage={mission.bgImage}>
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-black text-slate-300 transition-all font-premium leading-tight">
                {mission.name}
              </h3>
            </div>
            <RaidGrid
              mission={mission}
              completed={state.completed}
              onToggle={toggleMission}
            />
          </div>
        </Card>
      );
    }

    if (mission.renderType === 'ruins') {
      return (
        <Card key={mission.id} className="border-cyan-500/20 h-full" bgImage={mission.bgImage}>
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-black text-slate-300 transition-all font-premium leading-tight">
                {mission.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-800/40 px-2 py-0.5 rounded">
                  #BI-WEEKLY
                </span>
              </div>
            </div>
            <RuinsSelector
              floor={state.ruinsFloor}
              onChange={setRuinsFloor}
            />
          </div>
        </Card>
      );
    }

    if (mission.renderType === 'stock') {
      const keyType = (mission.metadata?.stockType as 'boss' | 'elite') ?? (mission.id.includes('boss') ? 'boss' : 'elite');
      return (
        <Card key={mission.id} className="h-full" bgImage={mission.bgImage}>
          <div className="flex flex-col h-full justify-between gap-4">
            <StockGauge
              label={mission.name}
              value={keyType === 'boss' ? state.bossKeys : state.eliteKeys}
              onChange={(v) => setStock(keyType, v)}
            />
          </div>
        </Card>
      );
    }

    // Default Checkbox type
    return (
      <Card
        key={mission.id}
        bgImage={mission.bgImage}
        onClick={() => toggleMission(mission.id)}
        className={cn(
          'group relative overflow-hidden min-h-[140px] h-full',
          isDone ? 'border-cyan-500/40 bg-cyan-500/5' : ''
        )}
      >
        <div className="flex flex-col h-full justify-between gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={cn(
                  'text-lg font-black transition-all font-premium leading-tight',
                  isDone ? 'text-cyan-400' : 'text-white'
                )}
              >
                {mission.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                {mission.description || (mission.category === 'daily' ? 'Daily Directive' : 'Weekly Module')}
              </p>
            </div>

            <div
              className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center transition-all border shrink-0',
                isDone ? 'bg-cyan-500 border-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-800/80 border-slate-700/50 text-slate-500'
              )}
            >
              {isDone ? <CheckCircle2 size={18} strokeWidth={3} /> : <Circle size={18} />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-800/40 px-2 py-0.5 rounded">
              #{mission.type.toUpperCase()}
            </span>
            {isDone && state.completed[mission.id] && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Clock size={10} className="text-cyan-500" />
                <span className="text-[9px] font-black font-mono text-cyan-400">
                  {format(parseISO(state.completed[mission.id]!), 'HH:mm')}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-4 pb-32 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl mb-12 flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <Gamepad2 className="text-white" size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white font-premium">
              BPSR MISSION TRACKER
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Ambient Dashboard 2.1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Card className="flex-1 md:flex-none py-2 px-5 border-cyan-500/20 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-4">
              <Clock className="text-cyan-400 animate-pulse" size={20} />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest">
                  Reset Cycle
                </span>
                <span className="text-xl font-black font-mono text-cyan-400 tabular-nums">
                  {String(hours).padStart(2, '0')}:
                  {String(minutes).padStart(2, '0')}:
                  {String(secs).padStart(2, '0')}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex-1 md:flex-none flex flex-col gap-3 min-w-[200px]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest">
                  Daily Sync
                </span>
                <span className="text-[10px] font-black text-cyan-400">
                  {dailyProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest">
                  Weekly Sync
                </span>
                <span className="text-[10px] font-black text-blue-400">
                  {weeklyProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
            </div>
          </div>

          {isLoadingSheet && (
            <Loader2
              className="animate-spin text-cyan-400 ml-2"
              size={20}
            />
          )}
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col gap-12">
        {/* Daily Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 ml-1">
            <div className="h-4 w-1 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
            <div className="flex flex-col">
              <h2 className="font-black text-white uppercase tracking-[0.2em] text-xs">
                Daily Directives
              </h2>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Immediate priority operations</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
            {dailyMissions.map(renderMissionCard)}
          </div>
        </section>

        {/* Weekly Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 ml-1">
            <div className="h-4 w-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            <div className="flex flex-col">
              <h2 className="font-black text-white uppercase tracking-[0.2em] text-xs">
                Weekly Modules
              </h2>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Strategic long-term objectives</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
            {weeklyMissions.map(renderMissionCard)}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl z-50">
        <button
          onClick={undo}
          disabled={state.undoStack.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 active:scale-90"
        >
          <Undo2 size={18} />
          Undo
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
            {state.undoStack.length}
          </span>
        </button>

        <div className="w-[1px] h-6 bg-white/10" />

        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all active:scale-90"
        >
          <RotateCcw size={18} />
          Reset All
        </button>
      </footer>
    </div>
  );
}
