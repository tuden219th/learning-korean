# Curriculum architecture

## Tracks

The catalog represents the long-term tracks as `course` entities with `meta.kind: "curriculum-track"`:

- `track-ko-korean-path` / `korean-path`
- `track-ko-korean-challenge` / `korean-challenge`

This keeps the current `course → module → lesson` UI and route model unchanged. A **module** is a curriculum stage when used inside one of these tracks.

## Add a stage

Add one `module` below the intended track. The stage title and `order` are the navigation label and its position.

```json
{
  "id": "stage-ko-korean-path-foundation",
  "slug": "foundation",
  "title": "Foundation",
  "language": "ko",
  "type": "module",
  "order": 1,
  "parentId": "track-ko-korean-path"
}
```

Stages are optional and can be introduced only when the first lesson for that stage is ready. Do not use the stage position as lesson numbering.

## Add one lesson

Add one `lesson` entity below its stage and one matching `.mdx` file in `content/lessons/`. The `id`, `slug`, and `meta.lessonNumber` are stable once released.

```json
{
  "id": "ko-korean-path-lesson-001",
  "slug": "lesson-1",
  "title": "Lesson 1",
  "language": "ko",
  "type": "lesson",
  "parentId": "stage-ko-korean-path-foundation",
  "meta": {
    "track": "korean-path",
    "lessonNumber": 1,
    "stage": "foundation",
    "stageOrder": 1,
    "description": "Short learner-facing description.",
    "objectives": ["A measurable outcome"],
    "estimatedMinutes": 20,
    "sections": ["learn", "practice", "quiz", "completion"],
    "tags": ["foundation"]
  }
}
```

The resulting route is `/ko/korean-path/foundation/lesson-1`. Korean Challenge follows the same pattern with its own ID namespace and `meta.track: "korean-challenge"`.

`lessonNumber` is sequential within its own track, not globally. `getChildren()` sorts numbered lessons numerically, so lesson 9 remains before lesson 10.

No completion key needs a track prefix: the stable lesson IDs include the track (`ko-korean-path-*` and `ko-korean-challenge-*`), so local progress cannot collide between tracks.
