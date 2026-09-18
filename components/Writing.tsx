"use client";

import { useState } from "react";
import type { WritingActivity } from "../types/content";

function normalize(value: string) {
  return value.trim().replace(/[.!?。！？]+$/u, "").replace(/\s+/g, " ");
}

export default function Writing({ activity }: { activity: WritingActivity }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const correct = activity.answers.some((expected) => normalize(expected) === normalize(answer));

  return (
    <section className="p-4 border rounded space-y-4" aria-labelledby={`${activity.id}-title`}>
      <h3 id={`${activity.id}-title`} className="text-lg font-semibold">{activity.title}</h3>
      <p>{activity.prompt}</p>
      <textarea className="w-full min-h-24 p-3 border rounded" value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }} placeholder="Viết câu trả lời bằng tiếng Hàn" />
      <p className="text-sm text-zinc-600">Gợi ý: {activity.hint}</p>
      <button className="px-3 py-2 border rounded" onClick={() => setChecked(true)} disabled={!answer.trim()}>Kiểm tra</button>
      {checked && <p className="font-medium">{correct ? "Chính xác!" : "Chưa đúng. Hãy xem gợi ý và thử lại."}</p>}
    </section>
  );
}