import React from 'react';
import Header from '../../components/Header';
import { isTrackMetadata } from '../../types/content';
import type { Metadata } from 'next';
import { getCatalog } from '../../lib/content';

type Props = {
  params: Promise<{ language: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const language = resolvedParams?.language ?? 'unknown';

  const catalog = getCatalog();
  const langEntity = catalog.entities.find(
    (e) => e.type === 'language' && e.slug === language
  );

  const langTitle = langEntity?.title || language.toUpperCase();
  const url = `https://korean.tudencafe.com/${language}`;

  return {
    title: `${langTitle} Learning Path — Từ Đến`,
    description: `Learn ${langTitle} with Từ Đến's structured curriculum and interactive lessons.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${langTitle} Learning Path — Từ Đến`,
      description: `Learn ${langTitle} with Từ Đến's structured curriculum and interactive lessons.`,
      url,
      type: 'website',
      siteName: 'Từ Đến',
    },
  };
}

export default async function LanguageLayout({ children, params }: Props) {
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

