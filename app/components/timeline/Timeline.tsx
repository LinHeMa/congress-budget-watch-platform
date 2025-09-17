import React from "react";
import { TimelineItem, type TimelineItemData } from "./TimelineItem";

type TimelineProps = {
  items: TimelineItemData[];
};

export const Timeline = ({ items }: TimelineProps) => {
  return (
      <ul className="timeline timeline-vertical timeline-compact">
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            {...item}
            isLast={index === items.length - 1}
            isFirst={index === 0}
          />
        ))}
      </ul>
  );
};
