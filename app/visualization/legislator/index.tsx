import { useState } from "react";
import { Link } from "react-router";
import BudgetHeader from "~/components/budget-header";
import SessionChart from "./session-chart";
import BudgetTypeLegend from "~/components/budget-type-legend";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";

const VisualizationLegislator = () => {
  const [selectedType, setSelectedType] = useState<
    "proposal" | "proposal-cosign"
  >("proposal");
  const [mode, setMode] = useState<"amount" | "count">("amount");

  return (
    <div>
      <BudgetHeader />
      <div className="flex flex-col items-center justify-center px-3 md:mx-auto md:max-w-[800px]">
        <Link to="/visualization">{"<"} 回到視覺化主頁</Link>
        <div className="mt-4 flex flex-col items-center justify-center gap-y-2">
          <p>徐巧芯</p>
          <p>中國國民黨</p>
          <p>第OO-OO屆立法委員</p>
        </div>
        {/* buttons for selected type */}
        <div className="mt-6 flex items-center gap-x-4">
          <button
            className={`rounded border-2 border-black px-2.5 ${
              selectedType === "proposal" ? "bg-[#3E51FF] text-white" : ""
            }`}
            onClick={() => setSelectedType("proposal")}
          >
            提案
          </button>
          <button
            className={`rounded border-2 border-black px-2.5 ${
              selectedType === "proposal-cosign"
                ? "bg-[#3E51FF] text-white"
                : ""
            }`}
            onClick={() => setSelectedType("proposal-cosign")}
          >
            提案＋連署
          </button>
        </div>
        {/* radio buttons for sort by */}
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
        {/* statistics */}
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 p-2.5">
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
        <div className="mt-6">
          <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />
        </div>
        {/* session chart */}
        <SessionChart />
      </div>
    </div>
  );
};

export default VisualizationLegislator;
