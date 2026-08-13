"use client";

import { useCompletedLessons } from "../lib/progress";

type LessonCompletionProps = {
  lessonId: string;
};

export default function LessonCompletion({ lessonId }: LessonCompletionProps) {
  const { completedLessonIds, completeLesson, resetLesson } = useCompletedLessons();
  const isCompleted = completedLessonIds.includes(lessonId);

  if (isCompleted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <p className="font-semibold">Đã hoàn thành bài học</p>
        <button
          type="button"
          onClick={() => resetLesson(lessonId)}
          className="mt-2 text-sm font-medium underline underline-offset-2"
        >
          Đánh dấu là chưa hoàn thành
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--accent)]/30 bg-white p-4 shadow-sm">
      <p className="font-semibold">Bạn đã sẵn sàng đi tiếp chưa?</p>
      <p className="mt-1 text-sm text-zinc-600">Hoàn thành bài để lưu lại bước tiến của mình trên thiết bị này.</p>
      <button
        type="button"
        onClick={() => completeLesson(lessonId)}
        className="mt-3 rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Hoàn thành bài học
      </button>
    </div>
  );
}
