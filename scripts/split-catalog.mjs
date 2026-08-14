import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIG
// ============================================================

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const CATALOG_FILE = path.join(CONTENT_DIR, "catalog.json");

const ENTITIES_DIR = path.join(CONTENT_DIR, "entities");
const LESSONS_DIR = path.join(CONTENT_DIR, "lessons");
const ACTIVITIES_DIR = path.join(CONTENT_DIR, "activities");

// ============================================================
// HELPERS
// ============================================================

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2) + "\n",
    "utf8"
  );
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function groupBy(items, keyFn) {
  const result = new Map();

  for (const item of items) {
    const key = keyFn(item);

    if (!result.has(key)) {
      result.set(key, []);
    }

    result.get(key).push(item);
  }

  return result;
}

// ============================================================
// LOAD CATALOG
// ============================================================

if (!fs.existsSync(CATALOG_FILE)) {
  console.error(`❌ Không tìm thấy: ${CATALOG_FILE}`);
  process.exit(1);
}

console.log("📖 Reading catalog.json...");

const catalog = readJson(CATALOG_FILE);

const entities = Array.isArray(catalog.entities)
  ? catalog.entities
  : [];

const activities = Array.isArray(catalog.activities)
  ? catalog.activities
  : [];

console.log(`   Entities: ${entities.length}`);
console.log(`   Activities: ${activities.length}`);

// ============================================================
// CREATE DIRECTORIES
// ============================================================

ensureDir(ENTITIES_DIR);
ensureDir(LESSONS_DIR);
ensureDir(ACTIVITIES_DIR);

// ============================================================
// 1. SPLIT ENTITIES BY TYPE
// ============================================================

console.log("\n📦 Splitting entities...");

const entitiesByType = groupBy(
  entities,
  (entity) => entity.type || "unknown"
);

const entityTypeFiles = {
  language: "languages.json",
  goal: "goals.json",
  path: "paths.json",
  level: "levels.json",
  course: "courses.json",
  module: "modules.json",
};

for (const [type, items] of entitiesByType) {
  const filename =
    entityTypeFiles[type] || `${type}s.json`;

  const file = path.join(ENTITIES_DIR, filename);

  writeJson(file, items);

  console.log(
    `   ✓ ${filename.padEnd(22)} ${items.length} items`
  );
}

// ============================================================
// 2. SPLIT LESSONS BY COURSE
// ============================================================

console.log("\n📚 Splitting lessons...");

const lessons = entities.filter(
  (entity) => entity.type === "lesson"
);

const modules = entities.filter(
  (entity) => entity.type === "module"
);

const courses = entities.filter(
  (entity) => entity.type === "course"
);

const moduleMap = new Map(
  modules.map((module) => [module.id, module])
);

const courseMap = new Map(
  courses.map((course) => [course.id, course])
);

// Find which course a lesson belongs to
function findCourseForLesson(lesson) {
  let current = moduleMap.get(lesson.parentId);

  if (!current) {
    return null;
  }

  const visited = new Set();

  while (current) {
    if (visited.has(current.id)) {
      console.warn(
        `⚠️ Circular parentId detected around ${current.id}`
      );
      return null;
    }

    visited.add(current.id);

    if (current.type === "course") {
      return current;
    }

    current = moduleMap.get(current.parentId);

    if (!current) {
      // It may be a course directly.
      current = courseMap.get(
        current?.parentId
      );
    }
  }

  return null;
}

// More reliable parent traversal
function getCourseForLesson(lesson) {
  let parentId = lesson.parentId;
  const visited = new Set();

  while (parentId) {
    if (visited.has(parentId)) {
      return null;
    }

    visited.add(parentId);

    const parent =
      entities.find((entity) => entity.id === parentId);

    if (!parent) {
      return null;
    }

    if (parent.type === "course") {
      return parent;
    }

    parentId = parent.parentId;
  }

  return null;
}

const lessonsByCourse = new Map();

for (const lesson of lessons) {
  const course = getCourseForLesson(lesson);

  if (!course) {
    console.warn(
      `⚠️ Không tìm được course cho lesson: ${lesson.id}`
    );
    continue;
  }

  if (!lessonsByCourse.has(course.id)) {
    lessonsByCourse.set(course.id, []);
  }

  lessonsByCourse.get(course.id).push(lesson);
}

// Write one lesson file per course
for (const [courseId, courseLessons] of lessonsByCourse) {
  const course = courseMap.get(courseId);

  if (!course) {
    continue;
  }

  const filename = `${course.slug}.json`;
  const file = path.join(LESSONS_DIR, filename);

  writeJson(file, {
    course: {
      id: course.id,
      slug: course.slug,
      title: course.title,
      language: course.language,
      type: course.type,
      order: course.order,
      parentId: course.parentId,
      ...(course.meta ? { meta: course.meta } : {}),
    },
    lessons: courseLessons,
  });

  console.log(
    `   ✓ ${filename.padEnd(32)} ${courseLessons.length} lessons`
  );
}

// ============================================================
// 3. SPLIT ACTIVITIES BY PREFIX / COURSE
// ============================================================

console.log("\n🎮 Splitting activities...");

const activitiesByGroup = new Map();

function getActivityGroup(activity) {
  const id = activity.id || "";

  // Greetings activities:
  // act-fc-1, act-mc-1, etc.
  if (
    /^act-(fc|mc)-\d+$/.test(id)
  ) {
    return "greetings";
  }

  // Hangul activities:
  // act-fc-h1-1
  // act-mc-h1-1
  if (
    /^act-(fc|mc)-h\d+-\d+$/.test(id)
  ) {
    return "hangul-foundation";
  }

  return "other";
}

for (const activity of activities) {
  const group = getActivityGroup(activity);

  if (!activitiesByGroup.has(group)) {
    activitiesByGroup.set(group, []);
  }

  activitiesByGroup.get(group).push(activity);
}

for (const [group, groupActivities] of activitiesByGroup) {
  const file = path.join(
    ACTIVITIES_DIR,
    `${group}.json`
  );

  writeJson(file, groupActivities);

  console.log(
    `   ✓ ${group}.json`.padEnd(36) +
      `${groupActivities.length} activities`
  );
}

// ============================================================
// 4. CREATE A NEW SMALL CATALOG INDEX
// ============================================================

console.log("\n🗂️ Creating catalog.index.json...");

const index = {
  version: 1,

  entities: {
    languages: "./entities/languages.json",
    goals: "./entities/goals.json",
    paths: "./entities/paths.json",
    levels: "./entities/levels.json",
    courses: "./entities/courses.json",
    modules: "./entities/modules.json",
  },

  lessons: {
    "greetings-basics": "./lessons/greetings-basics.json",
    "hangul-foundation":
      "./lessons/hangul-foundation.json",
  },

  activities: {
    greetings: "./activities/greetings.json",
    "hangul-foundation":
      "./activities/hangul-foundation.json",
  },
};

writeJson(
  path.join(CONTENT_DIR, "catalog.index.json"),
  index
);

// ============================================================
// SUMMARY
// ============================================================

console.log("\n========================================");
console.log("✅ Catalog split completed");
console.log("========================================");

console.log(`Entities:   ${entities.length}`);
console.log(`Lessons:    ${lessons.length}`);
console.log(`Activities: ${activities.length}`);

console.log("\nCreated:");

console.log("  content/entities/");
console.log("  content/lessons/");
console.log("  content/activities/");
console.log("  content/catalog.index.json");

console.log("\n⚠️ catalog.json was NOT modified.");
console.log(
  "👉 Sau khi kiểm tra các file mới, mới quyết định có bỏ catalog.json hay không."
);