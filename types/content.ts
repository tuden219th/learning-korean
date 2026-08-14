export type EntityType =
  | 'language'
  | 'goal'
  | 'path'
  | 'level'
  | 'course'
  | 'module'
  | 'lesson';

export type LessonSection =
  | 'learn'
  | 'vocabulary'
  | 'grammar'
  | 'pronunciation'
  | 'dialogue'
  | 'reading'
  | 'practice'
  | 'quiz'
  | 'review'
  | 'completion';

export interface TrackMetadata {
  kind: 'curriculum-track';
  vietnameseLabel: string;
  goal: string;
  audience: string;
}

export interface LessonMetadata {
  track: string;
  lessonNumber: number;
  stage?: string;
  stageOrder?: number;
  description?: string;
  objectives?: string[];
  prerequisites?: string[];
  estimatedMinutes?: number;
  sections?: LessonSection[];
  tags?: string[];
}

export type EntityMetadata = TrackMetadata | LessonMetadata | Record<string, unknown>;

export function isTrackMetadata(metadata: EntityMetadata | undefined): metadata is TrackMetadata {
  return typeof metadata === 'object'
    && metadata !== null
    && 'kind' in metadata
    && metadata.kind === 'curriculum-track';
}

export interface EntityBase {
  id: string;
  slug: string;
  title: string;
  language: string;
  type: EntityType;
  parentId?: string;
  order?: number;
  meta?: EntityMetadata;
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
  meta?: LessonMetadata;
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
