import Link from "next/link";
import CourseCard from "../components/CourseCard";
import ContinueCard from "../components/ContinueCard";

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
    <div className="min-h-screen bg-zinc-50 text-slate-900 dark:bg-black dark:text-zinc-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="mb-6">
          <ContinueCard nextLesson={nextLesson} />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Courses</h2>
          <div className="grid gap-4">
            {visibleCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
