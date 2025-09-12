import React from 'react';
import { TimelineItem, type TimelineItemData } from './TimelineItem';

type TimelineProps = {
  items: TimelineItemData[];
};

export const Timeline = ({ items }: TimelineProps) => {
  return (
    <ol className="relative border-s-2 border-gray-900">
      {items.map((item, index) => (
        <TimelineItem key={item.id} {...item} isLast={index === items.length - 1} />
      ))}
    </ol>
  );
};
