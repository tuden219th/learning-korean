import Link from "next/link";
import React from "react";

export default function CourseCard({ course, index }: any) {
  const firstModule = (course.modules && course.modules[0]) || null;
  const firstLesson = firstModule && firstModule.lessons && firstModule.lessons[0];
  const lessonPath = firstLesson ? `/${[course.language, firstModule.slug, firstLesson.slug].filter(Boolean).join('/')}` : null;

  const lessonCount = (course.modules || []).reduce((sum: number, m: any) => sum + ((m.lessons || []).length), 0);

  return (
    <article className="path-card">
      <div className="flex items-start gap-4">
        <div className="path-number">{String(index).padStart(2, '0')}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <div className="text-sm text-zinc-600 mt-1">{course.title && <span>{course.title}</span>}</div>
          <div className="text-sm text-zinc-500 mt-2">{lessonCount} bài học</div>
        </div>
        {lessonPath && (
          <Link href={lessonPath} className="text-sm text-[var(--accent)] font-semibold">Bắt đầu học →</Link>
        )}
      </div>
    </article>
  );
}
