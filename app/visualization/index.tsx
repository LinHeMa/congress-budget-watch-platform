import { useState } from "react";
import BudgetHeader from "~/components/budget-header";
import { VisualizationSelector } from "~/components/visualization-selector";
import CirclePackChart from "./circle-pack-chart";

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
  const [activeTab, setActiveTab] = useState("legislator");
  const [mode, setMode] = useState<"amount" | "count">("amount");
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(yearOptions);

  return (
    <div>
      <BudgetHeader />
      <div className="flex flex-col gap-y-3 p-4">
        <div className="flex items-center justify-center">
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
            onChange={(option: OptionType) => setSelectOptions([option])}
          />
        </div>
        <div>
          <div className="flex flex-col items-center justify-center gap-4">
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
        <div className="flex flex-col items-center justify-center rounded-lg border-2 p-2.5">
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
        <CirclePackChart />
      </div>
    </div>
  );
};

export default Visualization;
