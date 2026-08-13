import fs from 'fs';
import path from 'path';
import type { Catalog, Activity, EntityBase } from '../types/content';

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
  return loadCatalog().entities.filter((e) => e.parentId === parentId);
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
  const last = slugPath[slugPath.length - 1];
  const catalog = loadCatalog();
  return catalog.entities.find((e) => e.slug === last && e.language === language);
}
