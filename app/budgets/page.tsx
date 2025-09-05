import { GetBudgetsDocument } from "@/graphql/__generated__/graphql";
import queryGraphQL from "@/utils/fetch-gql";
import React from "react";
import ProgressBar from "./_components/progress-bar";
import Image from "next/image";

const content = {
  title: "114 年中央政府總預算",
  progressToggle: "114年度 (2025)",
  progressLabels: ["步驟 1", "步驟 2", "步驟 3", "步驟 4"],
};

const BudgetsPage = async () => {
  const data = await queryGraphQL(GetBudgetsDocument);
  console.log({ data });

  // Using JSON.stringify to display the object content for debugging
  return (
    <div className="p-5">
      <p className="w-full text-center font-bold text-xl mb-3">
        {content.title}
      </p>
      <div className="relative w-full h-0.5 bg-black mb-3">
        <Image
          src="/image/magnifier-eye.svg"
          height={63}
          width={55}
          alt="magnifier eye logo"
          className="absolute bg-red -top-[31.5px] z-10"
        />
        <div className="absolute h-[63px] w-[55px] bg-[#F6F6F6] -top-[31.5px]" />
      </div>
      <div className="border-b-[2px] border-black flex items-center justify-center mb-5">
        <div className="border-[2px] px-2.5 py-1 border-black border-b-0 rounded-t-md bg-[#E9808E] text-[#f6f6f6] font-bold text-[16px]">
          {content.progressToggle}
        </div>
      </div>
      <section className="flex justify-center w-full font-bold text-lg text-[#3E51FF] mb-2">
        <p>最新進度</p>
      </section>
      <div className="w-full h-fit flex justify-center items-center mb-5">
        <ProgressBar className="w-[165px]" labels={content.progressLabels} />
      </div>
      <div className="w-full h-0.5 bg-black" />
      {data?.budgets?.map((budget) => (
        <section key={budget.id}>
          <p>{budget.projectName}</p>
        </section>
      ))}
    </div>
  );
};

export default BudgetsPage;
