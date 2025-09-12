import React from 'react';

export type TimelineItemData = {
  id: string | number;
  date: string;
  title: string;
  description: string;
};

type TimelineItemProps = TimelineItemData & {
  isLast?: boolean;
};

export const TimelineItem = ({ date, title, description, isLast = false }: TimelineItemProps) => {
  const liClass = ['relative', 'ms-6', 'ps-5', !isLast && 'mb-8'].filter(Boolean).join(' ');

  return (
    <li className={liClass}>
        <div className="absolute -start-2 mt-2 h-3 w-3 rounded-full bg-gray-900"></div>
        <div className="mt-1 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div className="min-w-0 text-gray-900">
                <div className="text-xl font-bold leading-7 md:text-2xl md:leading-8">
                  <time className="mr-2 align-middle text-inherit font-inherit leading-inherit">{date}</time>
                  <span className="align-middle">{title}</span>
                </div>
                {description && (
                  <p className="mt-2 text-sm text-gray-600 md:text-base">{description}</p>
                )}
            </div>
            <button className="ml-4 shrink-0 rounded-full border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200">
                看版本變更
            </button>
        </div>
    </li>
  );
};
