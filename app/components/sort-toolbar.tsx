import Select, { type SingleValue } from "react-select";
import { useMemo } from "react";
import { DropdownIndicator } from "~/components/budgets-selector";

export const sortOptions = [
  {
    value: "id-asc",
    label: "編號 (升序)",
    field: "id",
    direction: "asc",
  },
  {
    value: "id-desc",
    label: "編號 (降序)",
    field: "id",
    direction: "desc",
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

  type SortOptionType = {
    value: string;
    label: string;
  };

  return (
    <div className="flex items-center justify-end pt-3">
      <span className="text-md">排序按照</span>
      <Select
        inputId="budget-sort-select"
        classNamePrefix="budget-sort"
        options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
        value={{ value: selectedValue, label: currentLabel }}
        onChange={(opt) => {
          const singleValue = opt as SingleValue<SortOptionType>;
          onChange(singleValue?.value ?? sortOptions[0].value);
        }}
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
