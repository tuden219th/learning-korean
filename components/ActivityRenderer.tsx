"use client";
import React from 'react';
import type { Activity } from '../types/content';
import Flashcard from './Flashcard';
import MultipleChoice from './MultipleChoice';
import Listening from './Listening';
import Speaking from './Speaking';
import Reading from './Reading';
import Writing from './Writing';

export default function ActivityRenderer({ activity }: { activity: Activity }) {
  if (!activity) return null;
  switch (activity.type) {
    case 'flashcard':
      return <Flashcard activity={activity} />;
    case 'multiple_choice':
      return <MultipleChoice activity={activity} />;
    case 'listening':
      return <Listening activity={activity} />;
    case 'speaking':
      return <Speaking activity={activity} />;
    case 'reading':
      return <Reading activity={activity} />;
    case 'writing':
      return <Writing activity={activity} />;
    default:
      return null;
  }
}
