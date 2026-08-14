import fs from 'fs';
import path from 'path';
import type { Catalog, Activity, EntityBase, LessonMetadata } from '../types/content';

const CATALOG_PATH = path.join(process.cwd(), 'content', 'catalog.json');

function loadCatalog(): Catalog {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`catalog.json not found at ${CATALOG_PATH}`);
  }
  const raw = fs.readFileSync(CATALOG_PATH, 'utf-8');
  return JSON.parse(raw) as Catalog;
}

export function getCatalog(): Catalog {
  return loadCatalog();
}

export function getEntity(id: string): EntityBase | undefined {
  return loadCatalog().entities.find((e) => e.id === id);
}

export function getChildren(parentId: string): EntityBase[] {
  return loadCatalog()
    .entities
    .filter((entity) => entity.parentId === parentId)
    .sort((a, b) => getEntityOrder(a) - getEntityOrder(b));
}

function getEntityOrder(entity: EntityBase): number {
  if (typeof entity.order === 'number') return entity.order;
  if (isLessonMetadata(entity.meta)) return entity.meta.lessonNumber;
  return Number.MAX_SAFE_INTEGER;
}

function isLessonMetadata(metadata: EntityBase['meta']): metadata is LessonMetadata {
  return typeof metadata === 'object'
    && metadata !== null
    && 'lessonNumber' in metadata
    && typeof metadata.lessonNumber === 'number';
}

export function getLanguages(): EntityBase[] {
  return loadCatalog().entities.filter((e) => e.type === 'language');
}

export function getActivity(id: string): Activity | undefined {
  return loadCatalog().activities.find((a) => a.id === id);
}

export function getLessonContent(lessonId: string): string {
  const p = path.join(process.cwd(), 'content', 'lessons', `${lessonId}.mdx`);
  if (!fs.existsSync(p)) {
    throw new Error(`Lesson content not found: ${p}`);
  }
  return fs.readFileSync(p, 'utf-8');
}

export function findEntityBySlug(language: string, slugPath: string[]): EntityBase | undefined {
  if (!slugPath || slugPath.length === 0) return undefined;
  const catalog = loadCatalog();
  const last = slugPath[slugPath.length - 1];

  return catalog.entities.find((entity) => {
    if (entity.slug !== last || entity.language !== language) return false;

    const ancestry: string[] = [];
    let current: EntityBase | undefined = entity;
    while (current) {
      ancestry.unshift(current.slug);
      current = current.parentId
        ? catalog.entities.find((candidate) => candidate.id === current?.parentId)
        : undefined;
    }

    const routeSegments = ancestry[0] === language ? ancestry.slice(1) : ancestry;
    return slugPath.every(
      (segment, index) => routeSegments[routeSegments.length - slugPath.length + index] === segment,
    );
  });
}
