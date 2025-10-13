import { NavLink, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Timeline } from "../components/timeline/Timeline";
import Image from "~/components/image";
import { useMediaQuery } from "usehooks-ts";
import { execute } from "~/graphql/execute";
import { GET_PROPOSAL_BY_ID_QUERY, proposalQueryKeys } from "~/queries";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { redirect } from "react-router";
import BudgetDetailSkeleton from "~/components/skeleton/budget-detail-skeleton";
import {
  formatBudgetCategory,
  formatMergedProposals,
  formatNumber,
  getProposalTypeDisplay,
  getResultDisplay,
  hasMergedProposals,
  meetingsToTimeline,
} from "./helpers";
import type { Proposal } from "~/graphql/graphql";

const BudgetDetail = () => {
  const { id } = useParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch proposal data
  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.detail(id!),
    queryFn: () => execute(GET_PROPOSAL_BY_ID_QUERY, { id: id! }),
    enabled: !!id, // Only run query if id exists
  });

  // Handle loading and error states
  if (isLoading) return <BudgetDetailSkeleton isDesktop={isDesktop} />;
  if (isError || !data?.proposal) return redirect(ERROR_REDIRECT_ROUTE);

  const proposal = data.proposal as Proposal;
  console.log({ proposal });

  // Transform data for rendering
  const timelineData = meetingsToTimeline(proposal.meetings);
  const mergedProposalsData = formatMergedProposals(proposal.mergedProposals);
  const hasMerged = hasMergedProposals(proposal);
  const hasImage = !!proposal.budgetImageUrl;

  // Prepare display values
  const proposerName = proposal.proposers
    ?.map((proposer) => proposer.name)
    .join("、");
  const cosignersText =
    proposal.coSigners && proposal.coSigners.length > 0
      ? proposal.coSigners.map((s) => s.name).join("、")
      : "無";
  const proposalType = getProposalTypeDisplay(proposal.proposalTypes);
  const resultText = getResultDisplay(proposal.result);
  const budgetCategory = formatBudgetCategory(
    proposal.budget?.majorCategory,
    proposal.budget?.mediumCategory,
    proposal.budget?.minorCategory
  );

  if (isDesktop)
    return (
      <div className="pb-8 text-sm">
        <div className="mx-2.5 flex flex-col md:mx-8">
          <NavLink to="/all-budgets" className="underline">
            {"<回到列表頁"}
          </NavLink>
          <div className="relative mt-6">
            <div className="absolute h-full w-full translate-x-3 -translate-y-3 rounded-lg border-2 bg-[#C1C1C1]" />
            <div className="relative flex flex-col rounded-lg border-2 bg-[#F6F6F6] p-5 pb-30">
              <div className="mb-4 flex gap-5 border-b-2 p-3 text-xl font-bold">
                <p>編號</p>
                <p className="text-[#D18081]">{proposal.id}</p>
              </div>
              <div className="flex flex-col gap-y-10">
                {/* row 1 */}
                <section className="flex">
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      分類
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 md:pr-8 lg:pr-12">
                      {proposal.government?.category || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      部會
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 md:pr-8 lg:pr-12">
                      {proposal.government?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      提案人（連署）
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 md:pr-18 lg:pr-32">
                      {proposerName}
                      <br />（{cosignersText}）
                    </p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      提案
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 md:pr-12">
                      {proposalType}
                    </p>
                  </div>
                  <div className="grow">
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      審議結果
                    </p>
                    <p className="flex border-t-1 pt-4 pr-12">{resultText}</p>
                  </div>
                </section>
                {/* row 2 */}
                <section className="flex">
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      審議階段
                    </p>
                    <div className="flex w-fit border-t-1 pt-4 pr-13 md:pr-24">
                      {timelineData.length > 0 ? (
                        <Timeline items={timelineData} />
                      ) : (
                        <p className="text-gray-500">暫無審議資料</p>
                      )}
                    </div>
                  </div>
                  <div className="grow">
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      是否併案
                    </p>
                    <div className="flex flex-col gap-y-4 border-t-1 pt-4">
                      <p>{hasMerged ? "是" : "否"}</p>
                      {hasMerged && mergedProposalsData.length > 0 && (
                        <div className="grid-rows-auto grid grid-cols-3 gap-4.5">
                          {mergedProposalsData.map((merged) => (
                            <div key={merged.id} className="flex gap-x-2">
                              <div className="mt-2 size-2 rounded-full bg-black" />
                              <div className="text-[#868686]">
                                <p className="underline">{merged.date}</p>
                                <p>{merged.proposers}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                {/* row 3 */}
                <section className="flex">
                  <div className="grow">
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      提案內容
                    </p>
                    <div className="flex flex-col gap-y-4 border-t-1 pt-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {proposal.reason ||
                          proposal.description ||
                          "無提案內容"}
                      </p>
                    </div>
                  </div>
                </section>
                {/* row 4 without image */}
                {!hasImage && (
                  <section className="flex">
                    <div>
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        預算金額
                      </p>
                      <p className="flex w-fit border-t-1 border-black pt-4 pr-32 font-bold text-[#E9808E]">
                        {formatNumber(proposal.budget?.budgetAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        減列金額
                      </p>
                      <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold text-[#E9808E]">
                        {formatNumber(proposal.reductionAmount)}
                      </p>
                    </div>
                    <div className="grow">
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        凍結金額
                      </p>
                      <p className="flex border-t-1 border-black pt-4 font-bold text-[#E9808E]">
                        {formatNumber(proposal.freezeAmount)}
                      </p>
                    </div>
                  </section>
                )}
                {/* row 4 with image */}
                {hasImage && (
                  <section className="flex">
                    <div id="left" className="flex w-6/11 flex-col">
                      <div className="flex">
                        <div>
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            預算金額
                          </p>
                          <p className="flex w-fit border-t-1 border-black pt-4 font-bold text-[#E9808E] md:pr-8 lg:pr-16 xl:pr-32">
                            {formatNumber(proposal.budget?.budgetAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            減列金額
                          </p>
                          <p className="flex w-fit border-t-1 border-black pt-4 font-bold text-[#E9808E] md:pr-8 lg:pr-16 xl:pr-32">
                            {formatNumber(proposal.reductionAmount)}
                          </p>
                        </div>
                        <div className="grow">
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            凍結金額
                          </p>
                          <p className="flex border-t-1 border-black pt-4 pr-[93px] font-bold text-[#E9808E]">
                            {formatNumber(proposal.freezeAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-9 flex max-w-5/6 flex-col gap-y-9">
                        <div className="grow">
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            科目/計畫
                          </p>
                          <p className="flex border-t-1 border-black pt-4 pr-9">
                            {budgetCategory}
                          </p>
                        </div>
                        <div className="">
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            計畫說明
                          </p>
                          <p className="flex border-t-1 border-black pt-4 whitespace-pre-wrap">
                            {proposal.budget?.projectDescription || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div id="right" className="w-5/11">
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        提案單圖檔
                      </p>
                      <div className="flex border-t-1 border-black pt-4 font-bold">
                        <Image
                          src={
                            proposal.budgetImageUrl || "/icon/default-image.svg"
                          }
                          alt="proposal-image"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </section>
                )}
                {/* row 5 without image */}
                {!hasImage && (
                  <section className="flex">
                    <div className="grow">
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        科目/計畫
                      </p>
                      <p className="flex border-t-1 border-black pt-4 pr-9">
                        {budgetCategory}
                      </p>
                    </div>

                    <div className="w-[478px] max-w-[478px]">
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        計畫說明
                      </p>
                      <p className="flex border-t-1 border-black pt-4 whitespace-pre-wrap">
                        {proposal.budget?.projectDescription || "N/A"}
                      </p>
                    </div>
                  </section>
                )}
                {/* row 6 */}
                <section className="flex">
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      上年度決算
                    </p>
                    <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold">
                      {formatNumber(proposal.budget?.lastYearSettlement)}
                    </p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      上年度法定預算
                    </p>
                    <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold">
                      N/A
                    </p>
                  </div>
                  <div className="grow">
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      與上年度比較
                    </p>
                    <p className="flex border-t-1 border-black pt-4 font-bold text-[#3E51FF]">
                      N/A
                    </p>
                  </div>
                </section>
                {/* row 7 */}
                <section className="mt-25 flex justify-center gap-x-10">
                  <div className="flex flex-col items-center">
                    <p className="mb-2">我覺得很讚</p>
                    <p className="mb-5">999999</p>
                    <Image
                      src="/image/vote-good.svg"
                      alt="vote-good"
                      className="w-30"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="mb-2">我感到生氣</p>
                    <p className="mb-5">999999</p>
                    <Image
                      src="/image/vote-angry.svg"
                      alt="vote-angry"
                      className="w-30"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="mb-2">我有點失望</p>
                    <p className="mb-5">999999</p>
                    <Image
                      src="/image/vote-sad.svg"
                      alt="vote-sad"
                      className="w-30"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="mb-2">我不在意</p>
                    <p className="mb-5">999999</p>
                    <Image
                      src="/image/vote-neutral.svg"
                      alt="vote-neutral"
                      className="w-30"
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <>
      <div className="mx-2.5 flex flex-col">
        <NavLink to="/all-budgets" className="underline">
          {"<" + "回到列表頁"}
        </NavLink>
        <div className="mt-2 border-2 px-2 py-3">
          <section className="flex gap-6">
            <p>編號</p>
            <p className="text-[#D18081]">{proposal.id}</p>
          </section>
          <section className="flex gap-10">
            <div className="flex flex-col gap-y-4 font-bold">
              <p>分類</p>
              <p>{proposal.government?.category || "N/A"}</p>
            </div>
            <div className="flex flex-col gap-y-4 font-bold">
              <p>部會</p>
              <p>{proposal.government?.name || "N/A"}</p>
            </div>
          </section>
          <section>
            <p className="text-lg font-bold">審議階段/審議結果</p>
            <div>
              {timelineData.length > 0 ? (
                <Timeline items={timelineData} />
              ) : (
                <p className="text-gray-500">暫無審議資料</p>
              )}
            </div>
          </section>
          <div className="mt-3 flex flex-col gap-y-3">
            <p className="font-bold">是否併案</p>
            <p>{hasMerged ? "是" : "否"}</p>
          </div>
          <ul className="timeline timeline-vertical timeline-compact text-[#868686]">
            {mergedProposalsData.map((merged) => (
              <li key={merged.id}>
                <div className="timeline-middle">
                  <div className="h-3 w-3 rounded-full bg-gray-900"></div>
                </div>
                <div className="timeline-end rounded-xl bg-transparent px-6">
                  <p>{merged.date}</p>
                  <p>{merged.proposers}</p>
                </div>
              </li>
            ))}
          </ul>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex flex-col gap-y-3">
            <p className="font-bold">提案人（連署）</p>
            <section>
              <p>{proposerName}</p>
              <p>（{cosignersText}）</p>
            </section>
          </div>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex justify-between">
            <section className="flex gap-x-12">
              <section className="flex-col">
                <p className="font-bold">提案</p>
                <p>{proposalType}</p>
              </section>
              <section className="flex-col">
                <p className="font-bold">審議結果</p>
                <p>{resultText}</p>
              </section>
            </section>
            {/* fake link */}
            <a href="#" className="underline" target="_blank">
              資料來源
            </a>
          </div>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div>
            <p className="mb-4 font-bold">提案內容</p>
            <p className="whitespace-pre-wrap">
              {proposal.reason || proposal.description || "無提案內容"}
            </p>
          </div>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex gap-x-10">
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">預算金額</p>
              <p className="text-[#D18081]">
                {formatNumber(proposal.budget?.budgetAmount)}
              </p>
            </section>
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">減列金額</p>
              <p className="text-[#D18081]">
                {formatNumber(proposal.reductionAmount)}
              </p>
            </section>
          </div>
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex gap-x-10">
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">凍結金額</p>
              <p className="text-[#D18081]">
                {formatNumber(proposal.freezeAmount)}
              </p>
            </section>
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">預算書圖檔</p>
              <Image
                src={proposal.budgetImageUrl || "/icon/default-image.svg"}
                alt="default-image"
                className="size-5"
              />
            </section>
          </div>
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-x-2">
                <p className="font-bold">科目/計畫</p>
                <button>
                  <Image
                    src="/icon/explain-term.svg"
                    alt="explain-term"
                    className="size-5"
                  />
                </button>
              </div>
              <a href="#" className="text-[#3E51FF] underline" target="_blank">
                預算書連結
              </a>
            </div>
            <p>{budgetCategory}</p>
            <div className="flex items-center gap-x-2">
              <p className="font-bold">科目/計畫</p>
              <button>
                <Image
                  src="/icon/explain-term.svg"
                  alt="explain-term"
                  className="size-5"
                />
              </button>
            </div>
            <p className="whitespace-pre-wrap">
              {proposal.budget?.projectDescription || "N/A"}
            </p>
          </div>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex">
            <div className="flex flex-col gap-y-4">
              <p className="font-bold">上年度決算</p>
              <p>{formatNumber(proposal.budget?.lastYearSettlement)}</p>
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="font-bold">上年度法定預算</p>
              <p>N/A</p>
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="font-bold">與上年度比較</p>
              <p>N/A</p>
            </div>
          </div>
          <section className="grid grid-cols-2 items-center justify-items-center gap-10">
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 font-bold">我覺得很讚</p>
              <p className="mb-6">999999</p>
              <Image
                src="/image/vote-good.svg"
                alt="vote-good"
                className="w-32"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 font-bold">我感到生氣</p>
              <p className="mb-6">999999</p>
              <Image
                src="/image/vote-angry.svg"
                alt="vote-angry"
                className="w-32"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 font-bold">我有點失望</p>
              <p className="mb-6">999999</p>
              <Image
                src="/image/vote-sad.svg"
                alt="vote-sad"
                className="w-32"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 font-bold">我不在意</p>
              <p className="mb-6">999999</p>
              <Image
                src="/image/vote-neutral.svg"
                alt="vote-neutral"
                className="w-32"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BudgetDetail;
