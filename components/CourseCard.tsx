"use client";

import Link from "next/link";
import type { CourseWithModules } from "../types/content";
import { useCompletedLessons } from "../lib/progress";

type CourseCardProps = {
  course: CourseWithModules;
  index: number;
};

export default function CourseCard({ course, index }: CourseCardProps) {
  const { completedLessonIds } = useCompletedLessons();
  const firstModule = (course.modules && course.modules[0]) || null;
  const firstLesson = firstModule && firstModule.lessons && firstModule.lessons[0];
  const lessonPath = firstLesson ? `/${[course.language, firstModule.slug, firstLesson.slug].filter(Boolean).join('/')}` : null;

  const lessonCount = (course.modules || []).reduce((sum: number, m: any) => sum + ((m.lessons || []).length), 0);
  const completedCount = course.modules
    .flatMap((module) => module.lessons)
    .filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const percentage = lessonCount === 0 ? 0 : Math.round((completedCount / lessonCount) * 100);

  return (
    <article className="path-card">
      <div className="flex items-start gap-4">
        <div className="path-number">{String(index).padStart(2, '0')}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <div className="text-sm text-zinc-600 mt-1">{course.title && <span>{course.title}</span>}</div>
          <div className="text-sm text-zinc-500 mt-2">{lessonCount} bài học</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${percentage}%` }} />
            </div>
            <span>{completedCount}/{lessonCount} bài</span>
          </div>
        </div>
        {lessonPath && (
          <Link href={lessonPath} className="text-sm text-[var(--accent)] font-semibold">Bắt đầu học →</Link>
        )}
      </div>
    </article>
  );
}
