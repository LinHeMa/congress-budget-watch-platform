import Select from "react-select";
import { useMemo } from "react";
import type { Budget } from "~/graphql/graphql";
import { DropdownIndicator } from "~/components/budgets-selector";

export const sortOptions = [
  {
    value: "projectName-asc",
    label: "專案名稱 (A-Z)",
    field: "projectName",
    direction: "asc",
  },
  {
    value: "projectName-desc",
    label: "專案名稱 (Z-A)",
    field: "projectName",
    direction: "desc",
  },
  {
    value: "budgetAmount-desc",
    label: "預算金額 (高到低)",
    field: "budgetAmount",
    direction: "desc",
  },
  {
    value: "budgetAmount-asc",
    label: "預算金額 (低到高)",
    field: "budgetAmount",
    direction: "asc",
  },
  {
    value: "year-desc",
    label: "年度 (新到舊)",
    field: "year",
    direction: "desc",
  },
  {
    value: "year-asc",
    label: "年度 (舊到新)",
    field: "year",
    direction: "asc",
  },
] as const;

export type SortOption = (typeof sortOptions)[number];

export function sortBudgetsByOption(
  budgets: Budget[],
  selectedValue: string
): Budget[] {
  const selected = sortOptions.find((o) => o.value === selectedValue);
  if (!selected) return budgets;

  return [...budgets].sort((a, b) => {
    const aValue = a[selected.field as keyof Budget];
    const bValue = b[selected.field as keyof Budget];

    if (selected.field === "budgetAmount" || selected.field === "year") {
      const aNum = Number(aValue) || 0;
      const bNum = Number(bValue) || 0;
      return selected.direction === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = String(aValue ?? "").toLowerCase();
    const bStr = String(bValue ?? "").toLowerCase();
    return selected.direction === "asc"
      ? aStr.localeCompare(bStr, "zh-TW")
      : bStr.localeCompare(aStr, "zh-TW");
  });
}

interface SortToolbarProps {
  selectedValue: string;
  onChange: (value: string) => void;
}

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
    <div className="py-3 flex items-center gap-2">
      <span className="text-sm text-gray-600">排序方式：</span>
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
            border: "2px solid black",
            boxShadow: "none",
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
