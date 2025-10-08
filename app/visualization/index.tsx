import { useState } from "react";
import BudgetHeader from "~/components/budget-header";
import { VisualizationSelector } from "~/components/visualization-selector";
import CirclePackChart from "./circle-pack-chart";
import DepartmentChart from "./department";
import Image from "~/components/image";

type OptionType = {
  value: string;
  label: string;
};

const yearOptions: OptionType[] = [
  { value: "2025", label: "114年度 (2025)" },
  { value: "2024", label: "113年度 (2024)" },
];

// data layer
const Visualization = () => {
  // "department" || "legislator"
  const [activeTab, setActiveTab] = useState("legislator");
  const [mode, setMode] = useState<"amount" | "count">("amount");
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(yearOptions);

  return (
    <div>
      <BudgetHeader />
      <div className="flex flex-col gap-y-3 p-4">
        <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-center md:gap-x-6">
          <div className="flex items-center justify-center gap-x-1.5 md:gap-x-6">
            <button
              onClick={() => setActiveTab("legislator")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "legislator"
                  ? "bg-[#3E51FF] text-white"
                  : "border border-gray-300 bg-white text-gray-800"
              }`}
            >
              依立委
            </button>
            <button
              onClick={() => setActiveTab("department")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "department"
                  ? "bg-[#3E51FF] text-white"
                  : "border border-gray-300 bg-white text-gray-800"
              }`}
            >
              依部會
            </button>
          </div>
          <div className="flex items-center justify-center">
            <VisualizationSelector
              options={yearOptions}
              value={selectOptions[0]}
              onChange={(option) => {
                if (option) setSelectOptions([option]);
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-x-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="amount"
                checked={mode === "amount"}
                onChange={() => setMode("amount")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依金額（刪減/凍結）</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="count"
                checked={mode === "count"}
                onChange={() => setMode("count")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依數量（凍結案/刪減案/建議案）</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 bg-[#E9E9E9] p-2.5 md:mx-auto md:max-w-[488px]">
          <div>
            <p>
              總共刪減 <span className="text-[#E9808E]">28,470,404</span>元（
              <span className="text-[#E9808E]">32</span>個提案）
            </p>
            <p>
              凍結 <span className="text-[#E9808E]">28,470</span>元（
              <span className="text-[#E9808E]">134</span>個提案）
            </p>
            <p>
              主決議提案數： <span className="text-[#E9808E]">32</span>個
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <div className="flex flex-col items-center justify-center gap-y-6">
            <Image
              src="/icon/circle-pack-frozen.svg"
              alt="circle-pack-frozen"
              className="h-[48px] w-[48px]"
            />
            <p>凍結</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-6">
            <Image
              src="/icon/circle-pack-default.svg"
              alt="circle-pack-default"
              className="h-[48px] w-[48px]"
            />
            <p>刪除</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-6">
            <Image
              src="/icon/circle-pack-main.svg"
              alt="circle-pack-main"
              className="h-[48px] w-[48px]"
            />
            <p>主決議</p>
          </div>
        </div>
        {activeTab === "legislator" && <CirclePackChart />}
        {activeTab === "department" && <DepartmentChart />}
      </div>
    </div>
  );
};

export default Visualization;
