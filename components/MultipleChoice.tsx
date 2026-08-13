"use client";
import React, { useState, useEffect } from 'react';
import type { MultipleChoiceActivity } from '../types/content';

function storageKey(activityId: string) {
  return `lk:progress:${activityId}:mc`;
}

export default function MultipleChoice({ activity }: { activity: MultipleChoiceActivity }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(activity.id));
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setSelected(data.selected ?? null);
        setAnswered(!!data.answered);
        setCorrect(typeof data.correct === 'boolean' ? data.correct : null);
      } catch {}
    }
  }, [activity.id]);

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
