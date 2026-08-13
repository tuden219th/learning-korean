import React from 'react';
import { getActivity } from '../lib/content';
import ActivityRenderer from './ActivityRenderer';

export default function Activity({ id }: { id: string }) {
  const activity = getActivity(id as string) as any;
  if (!activity) return <div>Activity not found: {id}</div>;
  return <ActivityRenderer activity={activity} />;
}

export const mdxComponents = {
  Activity,
};
