import React from "react";
import { useStore } from "zustand";
import useBudgetSelectStore from "~/stores/budget-selector";
import Select, { components, type DropdownIndicatorProps } from "react-select";
import Image from "./image";

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

export const DropdownIndicator = (props: DropdownIndicatorProps) => {
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
  const deleteTypeOptions = [{ value: "all-delete", label: "通案刪減" }];
  const deleteFundOptions = [
    { value: "x-fund", label: "臺鐵局撥入資產及債務管理基金" },
  ];

  if (value !== "by-department") return null;
  return (
    <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-2">
      <Select
        options={deleteTypeOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder="刪減方式"
      />
      <Select
        options={deleteFundOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder="刪減標的"
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
