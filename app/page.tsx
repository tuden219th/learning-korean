import Link from "next/link";
import CourseCard from "../components/CourseCard";
import ContinueCard from "../components/ContinueCard";
import Hero from "../components/Hero";

export default async function Home() {
  const { getEntity, getChildren, getCatalog } = await import("../lib/content");
  const lang = getEntity("lang-ko");

  const catalog = getCatalog();
  const courses = catalog.entities.filter((e: any) => e.type === 'course');

  function buildCourseTree(c: any) {
    const modules = getChildren(c.id) || [];
    const modulesWithLessons = modules
      .map((m: any) => {
        const lessons = getChildren(m.id) || [];
        return { ...m, lessons };
      })
      .filter((m: any) => (m.lessons || []).length > 0);
    return { ...c, modules: modulesWithLessons };
  }

  const visibleCourses = courses.map(buildCourseTree).filter((c: any) => (c.modules || []).length > 0);

  // Choose a sensible "next lesson" for ContinueCard: first lesson of first visible course
  let nextLesson = null;
  if (visibleCourses.length > 0) {
    const c = visibleCourses[0];
    const m = c.modules && c.modules[0];
    const l = m && m.lessons && m.lessons[0];
    if (l) {
      nextLesson = {
        id: l.id,
        title: l.title,
        slug: l.slug,
        language: c.language || 'ko',
        moduleSlug: m.slug,
        moduleTitle: m.title,
        courseTitle: c.title,
      };
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <Hero />

        {nextLesson && (
          <section className="mb-6">
            <ContinueCard nextLesson={nextLesson} />
          </section>
        )}

        <section className="my-6 text-center">
          <div className="text-xl font-medium">처음은 언제나 어렵지만, 한 걸음씩.</div>
          <div className="muted-quote mt-2">Mọi hành trình đều bắt đầu từ một bước nhỏ.</div>
        </section>

        <section id="courses">
          <h2 className="text-2xl font-extrabold mb-4">Lộ trình học</h2>
          <div className="grid gap-4">
            {visibleCourses.map((course: any, idx: number) => (
              <CourseCard key={course.id} course={course} index={idx + 1} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-12 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="font-semibold text-lg">Từ Đến Café</div>
            <div className="text-sm text-zinc-600 mt-2 max-w-md">Từ Đến Café — một không gian học tập ấm áp dành cho người bắt đầu học tiếng Hàn. Bài học ngắn, thực hành và văn phong dễ tiếp cận.</div>
          </div>

          <div className="text-sm text-zinc-600">
            <div><a href="https://tudencafe.com" className="underline">Trang chủ Từ Đến Café</a></div>
            <div className="mt-2">Email: contact@tudencafe.com</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
