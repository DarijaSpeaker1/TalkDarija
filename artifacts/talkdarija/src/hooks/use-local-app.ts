import { useCallback, useEffect, useState } from 'react';
import type { Level } from '@/data/content';

export type AppState = {
  profile: null | { name: string; level: Level; score: number; selfLevel: string; startedAt: string };
  settings: { theme: 'light' | 'dark'; sound: boolean; animations: boolean; dailyGoal: number };
  xp: number; hearts: number; streak: number; diamonds: number; dailyMinutes: number; lastPractice: string | null;
  completedLessons: string[]; learnedWords: string[]; currentLessonId: string; currentQuestion: number; savedAnswers: Record<string,string>;
  achievements: string[];
};
const key = 'talkdarija-state-v1';
const defaults: AppState = { profile:null, settings:{theme:'light',sound:true,animations:true,dailyGoal:5}, xp:0, hearts:5, streak:0, diamonds:18, dailyMinutes:0, lastPractice:null, completedLessons:[], learnedWords:[], currentLessonId:'lesson-1', currentQuestion:0, savedAnswers:{}, achievements:[] };
const load = (): AppState => { try { const raw = localStorage.getItem(key); return raw ? { ...defaults, ...JSON.parse(raw), settings:{...defaults.settings,...JSON.parse(raw).settings} } : defaults; } catch { return defaults; } };
let sharedState: AppState = load();
const listeners = new Set<(state: AppState) => void>();
const publish = (next: AppState) => { sharedState = next; listeners.forEach(listener => listener(next)); };
export function useLocalApp() {
  const [state, setLocalState] = useState<AppState>(sharedState);
  useEffect(() => { const listener = (next: AppState) => setLocalState(next); listeners.add(listener); return () => { listeners.delete(listener); }; }, []);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); document.documentElement.classList.toggle('dark', state.settings.theme === 'dark'); }, [state]);
  const setState = useCallback((next: AppState | ((current: AppState) => AppState)) => publish(typeof next === 'function' ? next(sharedState) : next), []);
  const patch = useCallback((changes: Partial<AppState>) => publish({...sharedState,...changes}), []);
  const completeLesson = useCallback((id: string, xp: number) => publish({...sharedState, completedLessons:sharedState.completedLessons.includes(id)?sharedState.completedLessons:[...sharedState.completedLessons,id], xp:sharedState.xp+xp, dailyMinutes:sharedState.dailyMinutes+5, lastPractice:new Date().toISOString(), streak:Math.max(1,sharedState.streak), hearts:Math.min(5,sharedState.hearts+1), currentLessonId:`lesson-${Math.min(50, Number(id.split('-')[1])+1)}`, achievements:sharedState.achievements.includes('first-step')?sharedState.achievements:[...sharedState.achievements,'first-step']}), []);
  const reset = useCallback(() => { localStorage.removeItem(key); publish(defaults); }, []);
  return {state, setState, patch, completeLesson, reset};
}