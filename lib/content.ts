import fs from "fs";
import path from "path";
import type {
  Catalog,
  Activity,
  EntityBase,
  LessonMetadata,
} from "../types/content";

const CONTENT_PATH = path.join(process.cwd(), "content");
const INDEX_PATH = path.join(CONTENT_PATH, "catalog.index.json");

interface CatalogIndex {
  version: number;

  entities: {
    languages: string;
    goals: string;
    paths: string;
    levels: string;
    courses: string;
    modules: string;
  };

  lessons: Record<string, string>;

  activities: Record<string, string>;
}

interface LessonFile {
  course?: EntityBase;
  lessons?: EntityBase[];
}

interface ActivityFile {
  activities?: Activity[];
}

function readJson<T>(relativePath: string): T {
  const filePath = path.join(CONTENT_PATH, relativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  try {
  return JSON.parse(raw) as T;
} catch (error) {
  console.error(`❌ INVALID JSON FILE: ${filePath}`);
  console.error(raw.slice(0, 300));
  throw error;
}
}

function loadIndex(): CatalogIndex {
  if (!fs.existsSync(INDEX_PATH)) {
    throw new Error(`catalog.index.json not found at ${INDEX_PATH}`);
  }

  const raw = fs.readFileSync(INDEX_PATH, "utf-8");

  return JSON.parse(raw) as CatalogIndex;
}

function loadCatalog(): Catalog {
  const index = loadIndex();

  // --------------------------------
  // Entities
  // --------------------------------

  const languages = readJson<EntityBase[]>(
    index.entities.languages
  );

  const goals = readJson<EntityBase[]>(
    index.entities.goals
  );

  const paths = readJson<EntityBase[]>(
    index.entities.paths
  );

  const levels = readJson<EntityBase[]>(
    index.entities.levels
  );

  const courses = readJson<EntityBase[]>(
    index.entities.courses
  );

  const modules = readJson<EntityBase[]>(
    index.entities.modules
  );

  const entities: EntityBase[] = [
    ...languages,
    ...goals,
    ...paths,
    ...levels,
    ...courses,
    ...modules,
  ];

  // --------------------------------
  // Lessons
  // --------------------------------

  for (const file of Object.values(index.lessons)) {
    const data = readJson<LessonFile | EntityBase[]>(file);

    // Support lesson files that are directly an array:
    // [
    //   { ... },
    //   { ... }
    // ]
    if (Array.isArray(data)) {
      entities.push(...data);
      continue;
    }

    // Support lesson files with:
    // {
    //   "course": { ... },
    //   "lessons": [ ... ]
    // }
    if (data.course) {
      const courseExists = entities.some(
        (entity) => entity.id === data.course?.id
      );

      if (!courseExists) {
        entities.push(data.course);
      }
    }

    if (Array.isArray(data.lessons)) {
      entities.push(...data.lessons);
    }
  }

  // --------------------------------
  // Activities
  // --------------------------------

  const activities: Activity[] = [];

  for (const file of Object.values(index.activities)) {
    const data = readJson<ActivityFile | Activity[]>(file);

    if (Array.isArray(data)) {
      activities.push(...data);
    } else if (Array.isArray(data.activities)) {
      activities.push(...data.activities);
    }
  }

  return {
    entities,
    activities,
  };
}

export function getCatalog(): Catalog {
  return loadCatalog();
}

export function getEntity(
  id: string
): EntityBase | undefined {
  return loadCatalog()
    .entities
    .find((e) => e.id === id);
}

export function getChildren(
  parentId: string
): EntityBase[] {
  return loadCatalog()
    .entities
    .filter((entity) => entity.parentId === parentId)
    .sort(
      (a, b) =>
        getEntityOrder(a) -
        getEntityOrder(b)
    );
}

function getEntityOrder(
  entity: EntityBase
): number {
  if (typeof entity.order === "number") {
    return entity.order;
  }

  if (isLessonMetadata(entity.meta)) {
    return entity.meta.lessonNumber;
  }

  return Number.MAX_SAFE_INTEGER;
}

function isLessonMetadata(
  metadata: EntityBase["meta"]
): metadata is LessonMetadata {
  return (
    typeof metadata === "object" &&
    metadata !== null &&
    "lessonNumber" in metadata &&
    typeof metadata.lessonNumber === "number"
  );
}

export function getLanguages(): EntityBase[] {
  return loadCatalog()
    .entities
    .filter(
      (entity) => entity.type === "language"
    );
}

export function getActivity(
  id: string
): Activity | undefined {
  return loadCatalog()
    .activities
    .find((activity) => activity.id === id);
}

export function getLessonContent(
  lessonId: string
): string {
  const filePath = path.join(
    CONTENT_PATH,
    "lessons",
    `${lessonId}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Lesson content not found: ${filePath}`
    );
  }

  return fs.readFileSync(
    filePath,
    "utf-8"
  );
}

export function findEntityBySlug(
  language: string,
  slugPath: string[]
): EntityBase | undefined {
  if (
    !slugPath ||
    slugPath.length === 0
  ) {
    return undefined;
  }

  const catalog = loadCatalog();

  const last =
    slugPath[slugPath.length - 1];

  return catalog.entities.find(
    (entity) => {
      if (
        entity.slug !== last ||
        entity.language !== language
      ) {
        return false;
      }

      const ancestry: string[] = [];

      let current:
        | EntityBase
        | undefined = entity;

      while (current) {
        ancestry.unshift(
          current.slug
        );

        current = current.parentId
          ? catalog.entities.find(
              (candidate) =>
                candidate.id ===
                current?.parentId
            )
          : undefined;
      }

      const routeSegments =
        ancestry[0] === language
          ? ancestry.slice(1)
          : ancestry;

      return slugPath.every(
        (segment, index) =>
          routeSegments[
            routeSegments.length -
              slugPath.length +
              index
          ] === segment
      );
    }
  );
}