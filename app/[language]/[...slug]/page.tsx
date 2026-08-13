import React from 'react';
import { getLessonContent, findEntityBySlug, getEntity, getChildren } from '../../../lib/content';
import { marked } from 'marked';
import Activity from '../../../components/MDXComponents';

type Props = {
  params: {
    language: string;
    slug?: string[];
  };
};

export default async function Page({ params }: Props) {
  const resolved = await params;
  const { language, slug } = resolved;
  const slugArr = slug || [];
  const entity = findEntityBySlug(language, slugArr);

  if (!entity) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p>No entity found for {language}/{slugArr.join('/')}</p>
      </main>
    );
  }

  if (entity.type === 'lesson') {
    // build breadcrumb by walking parent chain
    const breadcrumb: Array<{ id: string; slug: string; title: string }> = [];
    (function buildCrumb(e: any | undefined) {
      if (!e) return;
      breadcrumb.push({ id: e.id, slug: e.slug, title: e.title });
      if (e.parentId) buildCrumb(getEntity(e.parentId));
    })(entity as any);
    breadcrumb.reverse();

    // find module ancestor
    let moduleAncestor = entity as any;
    while (moduleAncestor && moduleAncestor.type !== 'module') {
      moduleAncestor = moduleAncestor.parentId ? getEntity(moduleAncestor.parentId) : null;
    }

    const moduleLessons = moduleAncestor ? getChildren(moduleAncestor.id).filter((c) => c.type === 'lesson') : [];
    const currentIndex = moduleLessons.findIndex((l) => l.id === entity.id);
    const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null;

    // compute base path for module (slugs from language up to module)
    const moduleIndexInBreadcrumb = moduleAncestor ? breadcrumb.findIndex((b) => b.id === moduleAncestor.id) : -1;
    const baseSlugs = moduleIndexInBreadcrumb >= 0 ? breadcrumb.slice(1, moduleIndexInBreadcrumb + 1).map((b) => b.slug) : [];
    const basePath = `${language}/${baseSlugs.join('/')}`.replace(/\/+$/g, '');
    let raw = '';
    try {
      raw = getLessonContent(entity.id);
    } catch (err) {
      raw = `Error loading lesson: ${String(err)}`;
    }

    // strip frontmatter
    if (raw.startsWith('---')) {
      const end = raw.indexOf('\n---', 3);
      if (end !== -1) {
        raw = raw.slice(end + 4);
      }
    }

    // split on Activity tags: <Activity id="..." />
    const parts: Array<{ type: 'markdown'; content: string } | { type: 'activity'; id: string }> = [];
    const regex = /<Activity\s+id="([^"]+)"\s*\/?>/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(raw)) !== null) {
      const idx = match.index;
      const mdChunk = raw.slice(lastIndex, idx);
      if (mdChunk.trim()) parts.push({ type: 'markdown', content: mdChunk });
      parts.push({ type: 'activity', id: match[1] });
      lastIndex = regex.lastIndex;
    }
    const tail = raw.slice(lastIndex);
    if (tail.trim()) parts.push({ type: 'markdown', content: tail });

    return (
      <div className="p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              <aside className="hidden md:block md:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-lg font-semibold mb-2">{moduleAncestor ? moduleAncestor.title : 'Module'}</h2>
              <nav className="flex flex-col gap-2">
                {moduleLessons.map((l) => (
                  <a
                    key={l.id}
                    href={`/${basePath}/${l.slug}`}
                    className={`block px-3 py-2 rounded ${l.id === entity.id ? 'bg-foreground text-background font-medium' : 'hover:bg-zinc-100'}`}
                  >
                    {l.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="col-span-1 md:col-span-3">
            <div className="mb-4 text-sm text-zinc-600">
              <nav className="flex flex-wrap items-center gap-2">
                {breadcrumb.map((b, i) => (
                  <span key={b.id} className="flex items-center gap-2">
                    <a href={`/${language}/${breadcrumb.slice(1, i + 1).map((x) => x.slug).join('/')}`} className="hover:underline">
                      {b.title}
                    </a>
                    {i < breadcrumb.length - 1 && <span className="text-zinc-400">/</span>}
                  </span>
                ))}
              </nav>
            </div>

            <header className="mb-6">
              <h1 className="text-3xl font-bold">{entity.title}</h1>
              <div className="mt-2 text-sm text-zinc-600">Language: {entity.language} • Lesson</div>
            </header>

            <article className="prose dark:prose-invert">
              {parts.map((p, i) => {
                if (p.type === 'markdown') {
                  const html = marked.parse(p.content);
                  return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />;
                }
                return (
                  <div key={i} className="my-4">
                    <Activity id={p.id} />
                  </div>
                );
              })}
            </article>

            <footer className="mt-8 flex items-center justify-between">
              <div>
                {prevLesson ? (
                  <a href={`/${basePath}/${prevLesson.slug}`} className="px-3 py-2 border rounded">
                    ← {prevLesson.title}
                  </a>
                ) : (
                  <span />
                )}
              </div>
              <div>
                {nextLesson ? (
                  <a href={`/${basePath}/${nextLesson.slug}`} className="px-3 py-2 bg-foreground text-background rounded">
                    {nextLesson.title} →
                  </a>
                ) : (
                  <span />
                )}
              </div>
            </footer>
          </main>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{entity.title}</h1>
      <p>Type: {entity.type}</p>
    </main>
  );
}
