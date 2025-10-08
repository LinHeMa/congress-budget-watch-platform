import Image from "./image";

type LegendItem = {
  icon: string;
  label: string;
  alt: string;
};

type BudgetTypeLegendProps = {
  items: LegendItem[];
  className?: string;
};

const BudgetTypeLegend = ({ items, className = "" }: BudgetTypeLegendProps) => {
  return (
    <div className={`flex items-center justify-center gap-5 ${className}`}>
      {items.map((item) => (
        <div
          key={item.alt}
          className="flex flex-col items-center justify-center gap-y-6"
        >
          <Image
            src={item.icon}
            alt={item.alt}
            className="h-[48px] w-[48px]"
          />
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default BudgetTypeLegend;
