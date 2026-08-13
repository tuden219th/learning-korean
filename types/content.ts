export type EntityType =
  | 'language'
  | 'goal'
  | 'path'
  | 'level'
  | 'course'
  | 'module'
  | 'lesson';

export interface EntityBase {
  id: string;
  slug: string;
  title: string;
  language: string;
  type: EntityType;
  parentId?: string;
  order?: number;
  meta?: unknown;
}

export interface CourseWithModules extends EntityBase {
  type: 'course';
  modules: Array<EntityBase & { lessons: EntityBase[] }>;
}

export interface Language extends EntityBase {
  type: 'language';
}

export interface Lesson extends EntityBase {
  type: 'lesson';
  activities?: string[];
  contentPath?: string;
}

export type FlashcardActivity = {
  type: 'flashcard';
  id: string;
  cards: { front: string; back: string }[];
};

export type MultipleChoiceActivity = {
  type: 'multiple_choice';
  id: string;
  question: string;
  choices: { id: string; text: string; correct: boolean }[];
};

export type Activity = FlashcardActivity | MultipleChoiceActivity;

export interface Catalog {
  entities: EntityBase[];
  activities: Activity[];
}
