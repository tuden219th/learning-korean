"use client";

import { useState } from "react";
import type { ReadingActivity } from "../types/content";

export default function Reading({ activity }: { activity: ReadingActivity }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const result = activity.choices.find((choice) => choice.id === selected);

  return (
    <section className="p-4 border rounded space-y-4" aria-labelledby={`${activity.id}-title`}>
      <h3 id={`${activity.id}-title`} className="text-lg font-semibold">{activity.title}</h3>
      <p className="whitespace-pre-line text-lg leading-relaxed">{activity.passage}</p>
      <p className="text-sm text-zinc-600">{activity.translation}</p>
      <fieldset className="space-y-2">
        <legend className="font-medium">{activity.question}</legend>
        {activity.choices.map((choice) => (
          <label key={choice.id} className="flex items-center gap-2">
            <input type="radio" name={activity.id} checked={selected === choice.id} onChange={() => setSelected(choice.id)} />
            {choice.text}
          </label>
        ))}
      </fieldset>
      <button className="px-3 py-2 border rounded" onClick={() => setAnswered(true)} disabled={!selected}>Kiểm tra</button>
      {answered && <p className="font-medium">{result?.correct ? "Chính xác!" : "Chưa đúng. Đọc lại đoạn văn và thử lại."}</p>}
    </section>
  );
}