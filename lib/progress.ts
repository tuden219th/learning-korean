"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "learning-korean:completed-lessons";
const PROGRESS_EVENT = "learning-korean:progress-changed";

function readCompletedLessons(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(stored) && stored.every((lessonId) => typeof lessonId === "string")
      ? stored
      : [];
  } catch {
    return [];
  }
}

function writeCompletedLessons(completedLessonIds: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessonIds));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function useCompletedLessons() {
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    const syncProgress = () => setCompletedLessonIds(readCompletedLessons());
    syncProgress();
    window.addEventListener(PROGRESS_EVENT, syncProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, syncProgress);
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    const current = readCompletedLessons();
    if (!current.includes(lessonId)) writeCompletedLessons([...current, lessonId]);
  }, []);

  const resetLesson = useCallback((lessonId: string) => {
    writeCompletedLessons(readCompletedLessons().filter((id) => id !== lessonId));
  }, []);

  return { completedLessonIds, completeLesson, resetLesson };
}
