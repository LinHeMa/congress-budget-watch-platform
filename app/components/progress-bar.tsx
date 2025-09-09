interface ProgressBarProps {
  isFinished?: boolean;
  count?: number;
  width?: number;
  height?: number;
  gap?: number;
  className?: string;
  labels?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  isFinished = true,
  count = 3,
  width = 165,
  height = 48,
  gap = 16,
  className = "",
  labels = [],
}) => {
  const progressBoxType = isFinished
    ? "/image/progress-box.svg"
    : "/image/not-finished-progress-box.svg";

  const baseZIndex = 90;

  const totalHeight = height + (height - gap) * (count - 1);

  return (
    <section
      className={`relative ${className}`}
      style={{ height: totalHeight }}
    >
      <img
        src="/image/eye.svg"
        alt="eye icon"
        height={28}
        width={72}
        className="absolute -top-[14px] -right-[38px] z-99"
      ></img>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: index * (height - gap),
            zIndex: baseZIndex - index * 10,
          }}
        >
          <img
            src={progressBoxType}
            height={height}
            width={width}
            alt={`progress box ${index + 1}`}
          />
          {labels[index] && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                marginTop: index > 0 ? 7 : 0,
              }}
            >
              <span className="text-white font-bold text-sm px-2 text-center">
                {labels[index]}
              </span>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default ProgressBar;
