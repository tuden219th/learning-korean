import { getCatalog, getLessonContent, getActivity } from '../lib/content';

function run() {
  const catalog = getCatalog();
  if (!catalog || !catalog.entities) throw new Error('Catalog invalid');
  const lesson = catalog.entities.find((e) => e.id === 'ko-greetings-1');
  if (!lesson) throw new Error('Missing lesson ko-greetings-1');
  const content = getLessonContent('ko-greetings-1');
  if (!content || typeof content !== 'string') throw new Error('Lesson content missing');
  const act = getActivity('act-fc-1');
  if (!act) throw new Error('Activity act-fc-1 missing');
  console.log('lib.content basic checks passed');
}

if (require.main === module) run();
