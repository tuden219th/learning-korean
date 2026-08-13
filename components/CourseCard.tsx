import Link from "next/link";
import React from "react";

export default function CourseCard({ course }: any) {
  const firstModule = (course.modules && course.modules[0]) || null;
  const firstLesson = firstModule && firstModule.lessons && firstModule.lessons[0];
  const lessonPath = firstLesson ? `/${[course.language, firstModule.slug, firstLesson.slug].filter(Boolean).join('/')}` : null;

  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <div className="text-sm text-zinc-600 mt-1">{(course.modules || []).length} modules</div>
        </div>
        {lessonPath && (
          <Link href={lessonPath} className="text-sm bg-foreground text-background px-3 py-1 rounded">Start</Link>
        )}
      </div>
    </article>
  );
}
