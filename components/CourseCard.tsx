"use client";

import Link from "next/link";
import { isTrackMetadata, type CourseWithModules } from "../types/content";
import { useCompletedLessons } from "../lib/progress";

type CourseCardProps = {
  course: CourseWithModules;
  index: number;
};

export default function CourseCard({ course, index }: CourseCardProps) {
  const { completedLessonIds } = useCompletedLessons();
  const track = isTrackMetadata(course.meta) ? course.meta : undefined;
  const firstModule = (course.modules && course.modules[0]) || null;
  const firstLesson = firstModule && firstModule.lessons && firstModule.lessons[0];
  const lessonPath = firstLesson ? `/${[course.language, firstModule.slug, firstLesson.slug].filter(Boolean).join('/')}` : null;

  const lessonCount = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
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
          {track ? (
            <>
              <div className="mt-1 text-sm font-medium text-[var(--accent)]">{track.vietnameseLabel}</div>
              <div className="mt-2 max-w-2xl text-sm text-zinc-600">{track.goal}</div>
            </>
          ) : (
            <div className="text-sm text-zinc-600 mt-1">{course.title}</div>
          )}
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

      {track && lessonCount === 0 ? (
        <div className="mt-5 border-t border-zinc-200 pt-4 text-sm text-zinc-600">
          Lộ trình đang được xây dựng theo từng bài học.
          <span className="mt-1 block text-xs">Dành cho: {track.audience}</span>
        </div>
      ) : (
      <div className="mt-5 border-t border-zinc-200 pt-4">
        <p className="text-sm font-semibold text-zinc-700">Nội dung khóa học</p>
        <div className="mt-3 space-y-4">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="text-sm font-medium">{module.title}</p>
              <ol className="mt-2 space-y-1">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const href = `/${course.language}/${module.slug}/${lesson.slug}`;

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={href}
                        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-zinc-50"
                      >
                        <span className={isCompleted ? "text-emerald-600" : "text-zinc-400"} aria-hidden="true">
                          {isCompleted ? "✓" : lessonIndex + 1}
                        </span>
                        <span className={isCompleted ? "text-zinc-500 line-through" : "text-zinc-700"}>
                          {lesson.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
      )}
    </article>
  );
}
