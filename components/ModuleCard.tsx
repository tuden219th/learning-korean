import Link from "next/link";

export default function ModuleCard({ module, language }: any) {
  const firstLesson = module.lessons && module.lessons[0];
  const lessonPath = firstLesson ? `/${[language, module.slug, firstLesson.slug].filter(Boolean).join('/')}` : null;

  return (
    <div className="rounded border bg-white p-3 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{module.title}</div>
          <div className="text-xs text-zinc-600">{(module.lessons || []).length} lessons</div>
        </div>
        {lessonPath && <Link href={lessonPath} className="text-indigo-600 text-sm">Open</Link>}
      </div>
    </div>
  );
}
