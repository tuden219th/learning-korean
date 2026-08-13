"use client";
import React from 'react';
import type { Activity } from '../types/content';
import Flashcard from './Flashcard';
import MultipleChoice from './MultipleChoice';

export default function ActivityRenderer({ activity }: { activity: Activity }) {
  if (!activity) return null;
  switch (activity.type) {
    case 'flashcard':
      return <Flashcard activity={activity} />;
    case 'multiple_choice':
      return <MultipleChoice activity={activity} />;
    default:
      return null;
  }
}
