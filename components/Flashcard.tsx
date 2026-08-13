"use client";
import React, { useState, useEffect } from 'react';
import type { FlashcardActivity } from '../types/content';

function storageKey(activityId: string) {
  return `lk:progress:${activityId}`;
}

export default function Flashcard({ activity }: { activity: FlashcardActivity }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(activity.id));
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (typeof data.index === 'number') setIndex(data.index);
      } catch {}
    }
  }, [activity.id]);

  useEffect(() => {
    localStorage.setItem(storageKey(activity.id), JSON.stringify({ index }));
  }, [activity.id, index]);

  const cards = activity.cards || [];
  const card = cards[index] || { front: '', back: '' };

  return (
    <div className="p-4 border rounded">
      <div className="mb-2 font-medium">Flashcard ({index + 1}/{cards.length})</div>
      <div
        className="p-4 bg-white rounded shadow cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
      >
        {flipped ? card.back : card.front}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
        >
          Next
        </button>
        <button
          className="px-3 py-1 border rounded ml-auto"
          onClick={() => {
            setIndex(0);
            setFlipped(false);
            localStorage.removeItem(storageKey(activity.id));
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
