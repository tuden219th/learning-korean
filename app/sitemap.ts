import { MetadataRoute } from 'next';
import { getCatalog, getEntity } from '../lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalog();
  const baseUrl = 'https://korean.tudencafe.com';
  const sitemap: MetadataRoute.Sitemap = [];

  // Add homepage
  sitemap.push({
    url: baseUrl,
    changeFrequency: 'weekly',
    priority: 1,
  });

  // Add all indexable entities (exclude activities and languages without content)
  const indexableTypes = ['goal', 'path', 'level', 'course', 'module', 'lesson'];
  const indexableEntities = catalog.entities.filter(
    (entity) => indexableTypes.includes(entity.type) && entity.slug && entity.language
  );

  for (const entity of indexableEntities) {
    try {
      // Build the full URL path by walking up the parent chain
      const slugs: string[] = [entity.slug];
      let currentEntity: typeof entity | null | undefined = entity;

      // Walk up the parent chain (excluding the language entity itself)
      while (currentEntity && currentEntity.parentId) {
        const parent = getEntity(currentEntity.parentId);
        if (!parent || parent.type === 'language') break;
        if (parent.slug) {
          slugs.unshift(parent.slug);
        }
        currentEntity = parent;
      }

      // Add language at the beginning
      slugs.unshift(entity.language);

      const url = `${baseUrl}/${slugs.join('/')}`;

      // Set priority and change frequency based on entity type
      let priority = 0.5;
      let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';

      switch (entity.type) {
        case 'goal':
          priority = 0.8;
          changeFrequency = 'weekly';
          break;
        case 'path':
          priority = 0.7;
          changeFrequency = 'weekly';
          break;
        case 'level':
          priority = 0.6;
          changeFrequency = 'weekly';
          break;
        case 'course':
          priority = 0.7;
          changeFrequency = 'weekly';
          break;
        case 'module':
          priority = 0.6;
          changeFrequency = 'weekly';
          break;
        case 'lesson':
          priority = 0.5;
          changeFrequency = 'weekly';
          break;
      }

      sitemap.push({
        url,
        changeFrequency,
        priority,
        lastModified: new Date(),
      });
    } catch (error) {
      // Skip entities that can't be processed
      console.error(`Error processing sitemap entity ${entity.id}:`, error);
    }
  }

  return sitemap;
}
