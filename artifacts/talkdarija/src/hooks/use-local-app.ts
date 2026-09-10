import { useCallback, useEffect, useState } from "react";
import { achievements as achievementDefinitions, lessons, type Level } from "@/data/content";

export type AppState = {
  profile: null | {
    name: string;
    avatar: string;
    level: Level;
    score: number;
    selfLevel: string;
    purpose: string;
    startedAt: string;
  };
  settings: {
    theme: "light" | "dark" | "system";
    sound: boolean;
    animations: boolean;
    dailyGoal: number;
    difficulty: "gentle" | "standard" | "stretch";
    showTransliteration: boolean;
  };
  xp: number;
  premium: boolean;
  hearts: number;
  streak: number;
  diamonds: number;
  dailyMinutes: number;
  dailyMinutesDate: string | null;
  lastPractice: string | null;
  completedLessons: string[];
  learnedWords: string[];
  dailyWordIds: string[];
  dailyQuestDate: string | null;
  dailyLessons: number;
  dailyWords: number;
  dailyExercises: number;
  dailyMistakesReviewed: number;
  totalExercises: number;
  mistakeExerciseIds: string[];
  currentLessonId: string;
  currentQuestion: number;
  savedAnswers: Record<string, string>;
  achievements: string[];
  feedbackPromptShown: boolean;
};
const localDay = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const key = "talkdarija-state-v1";
const defaults: AppState = {
  profile: null,
  settings: { theme: "light", sound: true, animations: true, dailyGoal: 5, difficulty: "gentle", showTransliteration: true },
  xp: 0,
  premium: false,
  hearts: 5,
  streak: 0,
  diamonds: 18,
  dailyMinutes: 0,
  dailyMinutesDate: null,
  lastPractice: null,
  completedLessons: [],
  learnedWords: [],
  dailyWordIds: [],
  dailyQuestDate: null,
  dailyLessons: 0,
  dailyWords: 0,
  dailyExercises: 0,
  dailyMistakesReviewed: 0,
  totalExercises: 0,
  mistakeExerciseIds: [],
  currentLessonId: "lesson-1",
  currentQuestion: 0,
  savedAnswers: {},
  achievements: [],
  feedbackPromptShown: false,
};
const load = (): AppState => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const merged = {
      ...defaults,
      ...parsed,
      hearts: parsed.hearts ?? defaults.hearts,
      settings: { ...defaults.settings, ...(parsed.settings || {}) },
    };
    return merged;
  } catch {
    return defaults;
  }
};
let sharedState: AppState = load();
const listeners = new Set<(state: AppState) => void>();
const publish = (next: AppState) => {
  sharedState = next;
  listeners.forEach((listener) => listener(next));
};
const unlock = (current: Set<string>, ids: string[]) => {
  let reward = 0;
  ids.forEach((id) => {
    if (current.has(id)) return;
    current.add(id);
    reward += achievementDefinitions.find((item) => item.id === id)?.diamonds ?? 0;
  });
  return reward;
};
export function useLocalApp() {
  const [state, setLocalState] = useState<AppState>(sharedState);
  useEffect(() => {
    const listener = (next: AppState) => setLocalState(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => document.documentElement.classList.toggle("dark", state.settings.theme === "dark" || (state.settings.theme === "system" && media.matches));
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [state]);
  const setState = useCallback(
    (next: AppState | ((current: AppState) => AppState)) =>
      publish(typeof next === "function" ? next(sharedState) : next),
    [],
  );
  const patch = useCallback(
    (changes: Partial<AppState>) => publish({ ...sharedState, ...changes }),
    [],
  );
  const completeLesson = useCallback((id: string, xp: number, minutes = 5) => {
    const lessonIndex = lessons.findIndex((lesson) => lesson.id === id);
    const nextLesson = lessonIndex >= 0 ? lessons[lessonIndex + 1] : undefined;
    const alreadyCompleted = sharedState.completedLessons.includes(id);
    const completedLessons = alreadyCompleted
      ? sharedState.completedLessons
      : [...sharedState.completedLessons, id];
    const achievements = new Set(sharedState.achievements);
    let diamondReward = unlock(achievements, ["first-step"]);
    diamondReward += unlock(achievements, [
      ...(completedLessons.length >= 2 ? ["conversation-starter"] : []),
      ...(completedLessons.length >= 5 ? ["open-door"] : []),
      ...(completedLessons.length >= 10 ? ["pathfinder"] : []),
    ]);
    const today = localDay();
    const lastDay = sharedState.lastPractice
      ? localDay(new Date(sharedState.lastPractice))
      : null;
    const yesterday = localDay(new Date(Date.now() - 86400000));
    const isNewQuestDay = sharedState.dailyQuestDate !== today;
    const isNewMinutesDay = sharedState.dailyMinutesDate !== today;
    const nextStreak =
      lastDay === today
        ? sharedState.streak
        : lastDay === yesterday
          ? sharedState.streak + 1
          : 1;
        diamondReward += unlock(achievements, [
          ...(nextStreak >= 3 ? ["steady-sun"] : []),
          ...(nextStreak >= 7 ? ["practice-fire"] : []),
        ]);
    publish({
      ...sharedState,
      completedLessons,
      xp: alreadyCompleted ? sharedState.xp : sharedState.xp + xp,
      diamonds: sharedState.diamonds + diamondReward,
      dailyMinutesDate: today,
      dailyMinutes: alreadyCompleted ? (isNewMinutesDay ? 0 : sharedState.dailyMinutes) : (isNewMinutesDay ? minutes : sharedState.dailyMinutes + minutes),
      dailyQuestDate: today,
      dailyLessons: isNewQuestDay ? 1 : sharedState.dailyLessons + (alreadyCompleted ? 0 : 1),
      dailyWords: isNewQuestDay ? 0 : sharedState.dailyWords,
      dailyExercises: isNewQuestDay ? 0 : sharedState.dailyExercises,
      dailyWordIds: isNewQuestDay ? [] : sharedState.dailyWordIds,
      lastPractice: new Date().toISOString(),
      hearts: alreadyCompleted
        ? sharedState.hearts
        : Math.min(5, sharedState.hearts + 1),
      currentLessonId: nextLesson?.id || id,
      currentQuestion: 0,
      achievements: [...achievements],
      ...(alreadyCompleted ? {} : { streak: Math.max(1, nextStreak) }),
    });
  }, []);
  const recordExercise = useCallback(() => {
    const today = localDay();
    const isNewQuestDay = sharedState.dailyQuestDate !== today;
    const nextTotal = sharedState.totalExercises + 1;
    const achievementSet = new Set(sharedState.achievements);
    const diamondReward = unlock(achievementSet, [
      ...(nextTotal >= 25 ? ["good-ear"] : []),
      ...(nextTotal >= 50 ? ["deep-listener"] : []),
    ]);
    publish({
      ...sharedState,
      dailyQuestDate: today,
      dailyLessons: isNewQuestDay ? 0 : sharedState.dailyLessons,
      dailyWords: isNewQuestDay ? 0 : sharedState.dailyWords,
      dailyExercises: isNewQuestDay ? 1 : sharedState.dailyExercises + 1,
      totalExercises: nextTotal,
      diamonds: sharedState.diamonds + diamondReward,
      achievements: [...achievementSet],
    });
  }, []);
  const recordMistake = useCallback((exerciseId: string) => {
    if (sharedState.mistakeExerciseIds.includes(exerciseId)) return;
    publish({
      ...sharedState,
      mistakeExerciseIds: [...sharedState.mistakeExerciseIds, exerciseId],
    });
  }, []);
  const recordMistakeReview = useCallback((exerciseId: string) => {
    const today = localDay();
    const isNewQuestDay = sharedState.dailyQuestDate !== today;
    publish({
      ...sharedState,
      mistakeExerciseIds: sharedState.mistakeExerciseIds.filter((id) => id !== exerciseId),
      dailyQuestDate: today,
      dailyMistakesReviewed: isNewQuestDay ? 1 : sharedState.dailyMistakesReviewed + 1,
      dailyLessons: isNewQuestDay ? 0 : sharedState.dailyLessons,
      dailyWords: isNewQuestDay ? 0 : sharedState.dailyWords,
      dailyExercises: isNewQuestDay ? 0 : sharedState.dailyExercises,
    });
  }, []);
  const markWordLearned = useCallback((id: string) => {
    const today = localDay();
    const isNewQuestDay = sharedState.dailyQuestDate !== today;
    const learned = sharedState.learnedWords.includes(id);
    const alreadyCountedToday = sharedState.dailyWordIds.includes(id);
    const nextLearnedCount = learned ? sharedState.learnedWords.length - 1 : sharedState.learnedWords.length + 1;
    const achievementSet = new Set(sharedState.achievements);
    const diamondReward = unlock(achievementSet, [
      ...(nextLearnedCount >= 10 ? ["word-hoarder"] : []),
      ...(nextLearnedCount >= 25 ? ["vocab-builder"] : []),
    ]);
    publish({
      ...sharedState,
      learnedWords: learned
        ? sharedState.learnedWords.filter((item) => item !== id)
        : [...sharedState.learnedWords, id],
      dailyQuestDate: today,
      dailyLessons: isNewQuestDay ? 0 : sharedState.dailyLessons,
      dailyWords: isNewQuestDay
        ? learned ? 0 : 1
        : sharedState.dailyWords + (!learned && !alreadyCountedToday ? 1 : 0),
      dailyWordIds: isNewQuestDay
        ? learned ? [] : [id]
        : !learned && !alreadyCountedToday ? [...sharedState.dailyWordIds, id] : sharedState.dailyWordIds,
      dailyExercises: isNewQuestDay ? 0 : sharedState.dailyExercises,
      diamonds: sharedState.diamonds + diamondReward,
      achievements: [...achievementSet],
    });
  }, []);
  const reset = useCallback(() => {
    localStorage.removeItem(key);
    publish(defaults);
  }, []);
  return { state, setState, patch, completeLesson, recordExercise, recordMistake, recordMistakeReview, markWordLearned, reset };
}
