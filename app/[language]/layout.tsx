import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

export default async function LanguageLayout({ children, params }: any) {
  const resolvedParams = await params;
  const language = resolvedParams?.language ?? 'unknown';

  const { getChildren, getEntity, getCatalog } = await import('../../lib/content');

  // find courses for this language that have modules with lessons
  const catalog = getCatalog();
  const courses = catalog.entities.filter((e: any) => e.type === 'course' && e.language === language);

  const visibleCourses = courses.map((c: any) => {
    const modules = getChildren(c.id) || [];
    const modulesWithLessons = modules
      .map((m: any) => {
        const lessons = getChildren(m.id) || [];
        return { ...m, lessons };
      })
      .filter((m: any) => (m.lessons || []).length > 0);
    return { ...c, modules: modulesWithLessons };
  }).filter((c: any) => (c.modules || []).length > 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header courses={visibleCourses} language={language} />
      <div className="max-w-4xl mx-auto p-4">{children}</div>
    </div>
  );
}

function getBreadcrumbPath(entity: any, getEntityFn: (id: string) => any) {
  // build slug path from language down to the entity
  const parts: string[] = [];
  let node: any = entity;
  while (node) {
    if (node.slug) parts.push(node.slug);
    if (!node.parentId) break;
    node = getEntityFn(node.parentId as string);
  }
  return parts.reverse().join('/');
}
