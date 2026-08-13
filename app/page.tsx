import Link from "next/link";

export default async function Home() {
  const { getEntity, getChildren, getCatalog } = await import("../lib/content");
  const lang = getEntity("lang-ko");

  // Build list of all courses -> modules -> lessons
  const catalog = getCatalog();
  const courses = catalog.entities.filter((e: any) => e.type === 'course');

  function buildPathSync(entity: any) {
    const parts: string[] = [];
    let node: any = entity;
    while (node) {
      if (node.slug) parts.push(node.slug);
      if (!node.parentId) break;
      node = getEntity(node.parentId as string);
    }
    return "/" + parts.reverse().join("/");
  }

  const coursesWithChildren = courses.map((c: any) => {
    const modules = getChildren(c.id) || [];
    const modulesWithLessons = modules.map((m: any) => {
      const lessons = getChildren(m.id) || [];
      return { ...m, lessons: lessons.map((l: any) => ({ ...l, path: buildPathSync(l) })) };
    });
    return { ...c, modules: modulesWithLessons };
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 px-8 py-6 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Learning Korean</h1>
          <nav className="text-sm">
            <Link href={`/${lang?.slug ?? "ko"}`} className="mr-4">Korean</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-10">
        <section className="mb-8">
          <h2 className="text-xl font-bold">Hangul Foundation</h2>
          <p className="text-sm text-zinc-600">A beginner course covering Hangul vowels and basics.</p>
        </section>

        <section className="grid gap-6">
          {coursesWithChildren.map((course: any) => (
            <div key={course.id} className="space-y-4">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <div className="grid gap-4">
                {course.modules.map((m: any) => (
                  <article key={m.id} className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                    <h4 className="font-medium">{m.title}</h4>
                    <div className="mt-2 flex flex-col gap-2">
                      {m.lessons.map((l: any) => (
                        <Link key={l.id} href={l.path} className="text-sm text-indigo-600 hover:underline">
                          {l.title}
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
