import Link from "next/link";

export default function ContinueCard({ nextLesson }: any) {
  if (!nextLesson) {
    return (
      <div className="rounded-lg border bg-white p-4 text-center dark:bg-zinc-900"> 
        <div className="font-semibold">No progress yet</div>
        <div className="text-sm text-zinc-600">Start a course to see it here.</div>
      </div>
    );
  }

  const path = `/${[nextLesson.language, nextLesson.moduleSlug, nextLesson.slug].filter(Boolean).join('/')}`;

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-600">Continue learning</div>
          <div className="font-semibold">{nextLesson.title}</div>
          <div className="text-xs text-zinc-500">{nextLesson.courseTitle || ''} • {nextLesson.moduleTitle || ''}</div>
        </div>
        <Link href={path} className="px-3 py-1 bg-foreground text-background rounded">Resume</Link>
      </div>
    </div>
  );
}
