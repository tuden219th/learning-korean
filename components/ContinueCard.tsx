import Link from "next/link";

export default function ContinueCard({ nextLesson }: any) {
  if (!nextLesson) return null;

  const path = `/${[nextLesson.language, nextLesson.moduleSlug, nextLesson.slug].filter(Boolean).join('/')}`;

  return (
    <div className="path-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-600">Học tiếp</div>
          <div className="font-semibold">{nextLesson.title}</div>
          <div className="text-xs text-zinc-500">{nextLesson.courseTitle || ''} • {nextLesson.moduleTitle || ''}</div>
        </div>
        <Link href={path} className="px-3 py-1 bg-[var(--accent)] text-white rounded">Bắt đầu</Link>
      </div>
    </div>
  );
}
