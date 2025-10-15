import Select from "react-select";
import { useMemo } from "react";
import { DropdownIndicator } from "~/components/budgets-selector";

export const sortOptions = [
  {
    value: "description-asc",
    label: "提案描述 (A-Z)",
    field: "description",
    direction: "asc",
  },
  {
    value: "description-desc",
    label: "提案描述 (Z-A)",
    field: "description",
    direction: "desc",
  },
  {
    value: "freezeAmount-desc",
    label: "凍結金額 (高到低)",
    field: "freezeAmount",
    direction: "desc",
  },
  {
    value: "freezeAmount-asc",
    label: "凍結金額 (低到高)",
    field: "freezeAmount",
    direction: "asc",
  },
  {
    value: "id-desc",
    label: "提案時間 (新到舊)",
    field: "id",
    direction: "desc",
  },
  {
    value: "id-asc",
    label: "提案時間 (舊到新)",
    field: "id",
    direction: "asc",
  },
] as const;

export type SortOption = (typeof sortOptions)[number];

type SortToolbarProps = {
  selectedValue: string;
  onChange: (value: string) => void;
};

const SortToolbar: React.FC<SortToolbarProps> = ({
  selectedValue,
  onChange,
}) => {
  const currentLabel = useMemo(
    () =>
      sortOptions.find((o) => o.value === selectedValue)?.label ??
      sortOptions[0].label,
    [selectedValue]
  );

  return (
    <div className="flex items-center justify-end pt-3">
      <span className="text-md">排序按照</span>
      <Select
        inputId="budget-sort-select"
        classNamePrefix="budget-sort"
        options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
        value={{ value: selectedValue, label: currentLabel }}
        onChange={(opt) => onChange(opt?.value ?? sortOptions[0].value)}
        components={{ DropdownIndicator }}
        aria-label="選擇排序方式"
        styles={{
          control: (base) => ({
            ...base,
            border: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
            fontWeight: "bold",
          }),
          indicatorSeparator: () => ({ display: "none" }),
          singleValue: (base) => ({
            ...base,
            color: "#3E51FF",
          }),
          option: (base, state) => ({
            ...base,
            color: state.isSelected ? "#3E51FF" : base.color,
          }),
        }}
      />
    </div>
  );
};

export default SortToolbar;
