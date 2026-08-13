"use client";

import Link from "next/link";
import type { CourseWithModules, EntityBase } from "../types/content";
import { useCompletedLessons } from "../lib/progress";

type LearningProgressProps = {
  courses: CourseWithModules[];
};

function getLessons(course: CourseWithModules): EntityBase[] {
  return course.modules.flatMap((module) => module.lessons);
}

function getLessonHref(course: CourseWithModules, lessonId: string): string | null {
  const module = course.modules.find((item) => item.lessons.some((lesson) => lesson.id === lessonId));
  const lesson = module?.lessons.find((item) => item.id === lessonId);
  return module && lesson ? `/${course.language}/${module.slug}/${lesson.slug}` : null;
}

export default function LearningProgress({ courses }: LearningProgressProps) {
  const { completedLessonIds } = useCompletedLessons();
  const allLessons = courses.flatMap(getLessons);
  const nextLesson = allLessons.find((lesson) => !completedLessonIds.includes(lesson.id));
  const nextCourse = nextLesson
    ? courses.find((course) => getLessons(course).some((lesson) => lesson.id === nextLesson.id))
    : undefined;
  const nextHref = nextCourse && nextLesson ? getLessonHref(nextCourse, nextLesson.id) : null;
  const completedCount = allLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const percentage = allLessons.length === 0 ? 0 : Math.round((completedCount / allLessons.length) * 100);

  return (
    <section className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-600">Hành trình của bạn</p>
          <h2 className="mt-1 text-xl font-bold">{completedCount}/{allLessons.length} bài đã hoàn thành</h2>
        </div>
        <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--accent)]">{percentage}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100" aria-label={`${percentage}% hoàn thành`}>
        <div className="h-full rounded-full bg-[var(--accent)] transition-[width]" style={{ width: `${percentage}%` }} />
      </div>
      {nextLesson && nextHref ? (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-600">Học tiếp</p>
            <p className="font-semibold">{nextLesson.title}</p>
          </div>
          <Link href={nextHref} className="shrink-0 rounded bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white">
            Tiếp tục học
          </Link>
        </div>
      ) : (
        <p className="mt-4 font-medium text-emerald-700">Bạn đã hoàn thành tất cả bài học hiện có. Tuyệt lắm!</p>
      )}
    </section>
  );
}
