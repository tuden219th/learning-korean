import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { isTrackMetadata } from '../../types/content';

export default async function LanguageLayout({ children, params }: any) {
  const resolvedParams = await params;
  const language = resolvedParams?.language ?? 'unknown';

  const { getChildren, getCatalog } = await import('../../lib/content');

  // find courses for this language that have modules with lessons
  const catalog = getCatalog();
  const courses = catalog.entities
    .filter((entity) => entity.type === 'course' && entity.language === language)
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  const visibleCourses = courses.map((c: any) => {
    const modules = getChildren(c.id) || [];
    const modulesWithLessons = modules
      .map((m: any) => {
        const lessons = getChildren(m.id) || [];
        return { ...m, lessons };
      })
      .filter((module: any) => module.lessons.length > 0);
    return { ...c, modules: modulesWithLessons };
  }).filter((course: any) => course.modules.length > 0 || isTrackMetadata(course.meta));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header courses={visibleCourses} language={language} />
      <div className="max-w-4xl mx-auto p-4">{children}</div>
    </div>
  );
}

