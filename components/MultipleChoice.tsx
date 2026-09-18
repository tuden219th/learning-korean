"use client";
import React, { useState } from 'react';
import type { MultipleChoiceActivity } from '../types/content';

function storageKey(activityId: string) {
  return `lk:progress:${activityId}:mc`;
}

export default function MultipleChoice({ activity }: { activity: MultipleChoiceActivity }) {
  const saved = typeof window === 'undefined' ? null : localStorage.getItem(storageKey(activity.id));
  let initial: { selected: string | null; answered: boolean; correct: boolean | null } = {
    selected: null,
    answered: false,
    correct: null,
  };
  if (saved) {
    try {
      const data = JSON.parse(saved);
      initial = {
        selected: typeof data.selected === 'string' ? data.selected : null,
        answered: !!data.answered,
        correct: typeof data.correct === 'boolean' ? data.correct : null,
      };
    } catch {}
  }
  const [selected, setSelected] = useState<string | null>(initial.selected);
  const [answered, setAnswered] = useState(initial.answered);
  const [correct, setCorrect] = useState<boolean | null>(initial.correct);

  function submit() {
    if (!selected) return;
    const choice = activity.choices.find((c) => c.id === selected);
    const isCorrect = !!choice && choice.correct === true;
    setAnswered(true);
    setCorrect(isCorrect);
    localStorage.setItem(storageKey(activity.id), JSON.stringify({ selected, answered: true, correct: isCorrect }));
  }

  return (
    <div className="p-4 border rounded">
      <div className="mb-2 font-medium">{activity.question}</div>
      <div className="flex flex-col gap-2">
        {activity.choices.map((c) => (
          <label key={c.id} className="flex items-center gap-2">
            <input
              type="radio"
              name={activity.id}
              checked={selected === c.id}
              onChange={() => setSelected(c.id)}
            />
            <span>{c.text}</span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={submit} disabled={answered || !selected}>
          Submit
        </button>
        {answered && (
          <div className="ml-2 font-medium">{correct ? 'Correct' : 'Incorrect'}</div>
        )}
      </div>
    </div>
  );
}
