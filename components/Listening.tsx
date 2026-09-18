"use client";

import { useEffect, useState } from "react";
import type { ListeningActivity } from "../types/content";

export default function Listening({ activity }: { activity: ListeningActivity }) {
  const [playing, setPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  function speak() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activity.text);
    utterance.lang = "ko-KR";
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  function submit() {
    if (!selected) return;
    setAnswered(true);
    localStorage.setItem(`lk:progress:${activity.id}:listening`, JSON.stringify({ selected }));
  }

  const result = activity.choices.find((choice) => choice.id === selected);

  return (
    <section className="p-4 border rounded space-y-4" aria-labelledby={`${activity.id}-title`}>
      <h3 id={`${activity.id}-title`} className="text-lg font-semibold">{activity.title}</h3>
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-2 border rounded" onClick={speak} disabled={playing}>
          {playing ? "Đang phát..." : "Nghe câu tiếng Hàn"}
        </button>
        <button className="px-3 py-2 border rounded" onClick={() => setShowTranslation((visible) => !visible)}>
          {showTranslation ? "Ẩn bản dịch" : "Xem bản dịch"}
        </button>
      </div>
      {showTranslation && <p className="text-sm text-zinc-600">{activity.translation}</p>}
      <fieldset className="space-y-2">
        <legend className="font-medium">{activity.question}</legend>
        {activity.choices.map((choice) => (
          <label key={choice.id} className="flex items-center gap-2">
            <input type="radio" name={activity.id} checked={selected === choice.id} onChange={() => setSelected(choice.id)} />
            {choice.text}
          </label>
        ))}
      </fieldset>
      <button className="px-3 py-2 border rounded" onClick={submit} disabled={!selected || answered}>Kiểm tra</button>
      {answered && <p className="font-medium">{result?.correct ? "Chính xác!" : "Chưa đúng. Hãy nghe lại và thử lại."}</p>}
    </section>
  );
}