import React, { useMemo } from "react";
import { useStore } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { GET_GOVERNMENTS_QUERY, governmentQueryKeys } from "~/queries";
import useBudgetSelectStore from "~/stores/budget-selector";
import Select, {
  components,
  type DropdownIndicatorProps,
  type SingleValue,
} from "react-select";
import Image from "./image";

type OptionType = {
  value: string;
  label: string;
};

type BudgetOption = {
  title: string;
  value: string;
};

type BudgetsSelectorProps = {
  onSelectionChange?: (selectedValue: string) => void;
  className?: string;
};

const content = {
  pageTitle: "選擇預算分類方式:",
  options: [
    {
      title: "全部",
      value: "all",
    },
    {
      title: "依部會分類",
      value: "by-department",
    },
    {
      title: "依立委分類",
      value: "by-legislator",
    },
  ] as BudgetOption[],
};

export const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image
        src="/icon/dropdown-container.svg"
        alt="dropdown"
        className="h-2 w-2.5"
      />
    </components.DropdownIndicator>
  );
};

const ByDepartmentSelector = ({ value }: { value: string }) => {
  // 從 store 取得狀態與 actions
  const departmentFilter = useStore(
    useBudgetSelectStore,
    (state) => state.departmentFilter
  );
  const setDepartmentCategory = useStore(
    useBudgetSelectStore,
    (state) => state.setDepartmentCategory
  );
  const setDepartmentId = useStore(
    useBudgetSelectStore,
    (state) => state.setDepartmentId
  );

  // Fetch governments data
  const { data: governmentsData, isLoading } = useQuery({
    queryKey: governmentQueryKeys.lists(),
    queryFn: () => execute(GET_GOVERNMENTS_QUERY),
    enabled: value === "by-department", // 只在選中時 fetch
  });

  // 計算 unique categories
  const categoryOptions = useMemo(() => {
    if (!governmentsData?.governments) return [];

    const uniqueCategories = Array.from(
      new Set(
        governmentsData.governments
          .map((g) => g.category)
          .filter((c): c is string => c != null && c !== "")
      )
    ).sort();

    return uniqueCategories.map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [governmentsData?.governments]);

  // 根據選定的 category 過濾 departments
  const departmentOptions = useMemo(() => {
    if (!governmentsData?.governments || !departmentFilter.category) {
      return [];
    }

    const filtered = governmentsData.governments
      .filter((g) => g.category === departmentFilter.category)
      .map((g) => ({
        value: g.id,
        label: g.name || "未命名機關",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return filtered;
  }, [governmentsData?.governments, departmentFilter.category]);

  // 當前選擇的值（用於 react-select）
  const selectedCategoryValue = departmentFilter.category
    ? { value: departmentFilter.category, label: departmentFilter.category }
    : null;

  const selectedDepartmentValue = useMemo(() => {
    if (!departmentFilter.departmentId || !governmentsData?.governments) {
      return null;
    }
    const dept = governmentsData.governments.find(
      (g) => g.id === departmentFilter.departmentId
    );
    return dept ? { value: dept.id, label: dept.name || "未命名機關" } : null;
  }, [departmentFilter.departmentId, governmentsData?.governments]);

  if (value !== "by-department") return null;

  return (
    <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-2">
      {/* 第一階段：選擇 Category */}
      <Select
        value={selectedCategoryValue}
        onChange={(opt) => {
          const singleValue = opt as SingleValue<OptionType>;
          setDepartmentCategory(singleValue?.value || null);
        }}
        options={categoryOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={isLoading ? "載入中..." : "選擇機關類別"}
        isLoading={isLoading}
        isClearable
        aria-label="選擇機關類別"
      />

      {/* 第二階段：選擇 Department */}
      <Select
        value={selectedDepartmentValue}
        onChange={(opt) => {
          const singleValue = opt as SingleValue<OptionType>;
          setDepartmentId(singleValue?.value || null);
        }}
        options={departmentOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={
          !departmentFilter.category
            ? "請先選擇類別"
            : departmentOptions.length === 0
            ? "此類別無機關"
            : "選擇機關名稱"
        }
        isDisabled={!departmentFilter.category || departmentOptions.length === 0}
        isClearable
        aria-label="選擇機關名稱"
      />
    </div>
  );
};
const ByLegislatorSelector = ({ value }: { value: string }) => {
  const legislatorOptions = [
    { value: "KawloIyunPacidal", label: "高潞·以用·巴魕剌Kawlo Iyun Pacidal" },
  ];

  if (value !== "by-legislator") return null;
  return (
    <div className="flex flex-col gap-y-3">
      <Select
        options={legislatorOptions}
        components={{ DropdownIndicator }}
        className="md:w-96"
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder="立法委員"
      />
    </div>
  );
};

const BudgetsSelector: React.FC<BudgetsSelectorProps> = ({
  onSelectionChange,
  className = "",
}) => {
  const selectedValue = useStore(
    useBudgetSelectStore,
    (state) => state.selectedValue
  );
  const searchedValue = useStore(
    useBudgetSelectStore,
    (state) => state.searchedValue
  );
  const visible = useStore(useBudgetSelectStore, (state) => state.visible);
  const toggleVisible = useStore(
    useBudgetSelectStore,
    (state) => state.toggleVisible
  );
  const setSearchedValue = useStore(
    useBudgetSelectStore,
    (state) => state.setSearchedValue
  );
  const setSelectedValue = useStore(
    useBudgetSelectStore,
    (state) => state.setSelectedValue
  );

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    if (onSelectionChange) {
      onSelectionChange(value);
    }
  };

  return (
    <fieldset className={className}>
      <legend className="sr-only">{content.pageTitle}</legend>
      {visible ? (
        <div className="mt-3 space-y-3">
          {content.options.map((option) => (
            <div
              key={option.value}
              className="flex flex-col items-center justify-start md:flex-row md:gap-x-2"
            >
              <div className="mb-3 flex items-center md:mb-0">
                <input
                  type="radio"
                  id={option.value}
                  name="budget-selector"
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={() => handleSelectionChange(option.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={option.value}
                  className="ml-3 block cursor-pointer text-sm font-medium text-gray-700"
                >
                  {option.title}
                </label>
              </div>
              {selectedValue === option.value && (
                <ByDepartmentSelector value={option.value} />
              )}
              {selectedValue === option.value && (
                <ByLegislatorSelector value={option.value} />
              )}
            </div>
          ))}
          <section className="md:flex md:items-center">
            <p>或搜尋：</p>
            <input
              type="search"
              placeholder="搜尋"
              value={searchedValue}
              onChange={(e) => setSearchedValue(e.target.value)}
              className="rounded-sm border-2 bg-white text-center md:w-80"
            />
          </section>
          <button className="flex md:hidden" onClick={toggleVisible}>
            收合
            <Image
              src="/icon/reverse-dropdown-container.svg"
              alt="reverse-dropdown-container"
            />
          </button>
        </div>
      ) : (
        <button className="flex" onClick={toggleVisible}>
          展開
          <Image src="/icon/dropdown-container.svg" alt="dropdown-container" />
        </button>
      )}
    </fieldset>
  );
};

export default BudgetsSelector;
