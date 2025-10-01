export type TimelineItemData = {
  id: string | number;
  date: string;
  title: string;
};

type TimelineItemProps = TimelineItemData & {
  isLast?: boolean;
  isFirst?: boolean;
};

const TimelineConnector = () => <hr style={{ width: "2px" }} />;

export const TimelineItem = ({ date, title, isFirst }: TimelineItemProps) => {
  return (
    <li>
      {!isFirst && <TimelineConnector />}
      <div className="timeline-middle">
        <div className="h-3 w-3 rounded-full bg-gray-900"></div>
      </div>
      <div className="timeline-end rounded-xl bg-transparent px-6 py-4 md:px-0">
        <div className="flex items-center justify-between md:max-w-[200px] md:w-[200px]">
          <div className="min-w-0 text-gray-900">
            <div className="text-xl leading-7 font-bold md:text-md md:leading-8">
              <time className="font-inherit leading-inherit align-middle text-inherit">
                {date}
              </time>
              <span className="align-middle">{title}</span>
            </div>
          </div>
          <button className="ml-4 shrink-0 rounded-lg border border-black bg-white p-1 text-sm font-medium text-[#868686] md:max-w-[44px] md:text-xs md:px-0">
            看版本變更
          </button>
        </div>
      </div>
      <TimelineConnector />
    </li>
  );
};
