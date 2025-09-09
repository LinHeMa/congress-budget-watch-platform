import React from "react";
import { useStore } from "zustand";
import useBudgetSelectStore from "~/stores/budget-selector";
import Select, { components } from "react-select";

interface BudgetOption {
  title: string;
  value: string;
}

interface BudgetsSelectorProps {
  onSelectionChange?: (selectedValue: string) => void;
  className?: string;
}

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

export const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        src="/icon/dropdown-container.svg"
        alt="dropdown"
        width="10"
        height="8"
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
    <div className="flex flex-col gap-y-3">
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
    <fieldset>
      <legend className="sr-only">{content.pageTitle}</legend>
      <div>selectedValue:{selectedValue}</div>
      {visible ? (
        <div className="mt-3 space-y-3">
          {content.options.map((option) => (
            <div key={option.value} className="flex-col items-center">
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  id={option.value}
                  name="budget-selector"
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={() => handleSelectionChange(option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={option.value}
                  className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
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
          <section>
            <p>或搜尋：</p>
            <input
              type="search"
              placeholder="搜尋"
              value={searchedValue}
              onChange={(e) => setSearchedValue(e.target.value)}
              className="border-2 text-center rounded-sm"
            />
          </section>
          <button className="flex" onClick={toggleVisible}>
            收合 <img src={`/icon/reverse-dropdown-container.svg`} />
          </button>
        </div>
      ) : (
        <button className="flex" onClick={toggleVisible}>
          展開
          <img src={`/icon/dropdown-container.svg`} />
        </button>
      )}
    </fieldset>
  );
};

export default BudgetsSelector;
