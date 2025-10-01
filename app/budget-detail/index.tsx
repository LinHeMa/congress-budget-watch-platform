import { NavLink } from "react-router";
import BudgetHeader from "~/components/budget-header";
import { Timeline } from "../components/timeline/Timeline";
import Image from "~/components/image";
import { useMediaQuery } from "usehooks-ts";

const MOCK_DATA = [
  {
    id: 1,
    date: "2024年2月1日",
    title: "立法院三讀通過",
    description: "院會進行最終表決，正式通過預算案。",
  },
  {
    id: 2,
    date: "2024年1月15日",
    title: "委員會完成審查",
    description: "相關委員會完成所有預算的審查與協商。",
  },
  {
    id: 3,
    date: "2023年12月5日",
    title: "行政院提交預算草案",
    description: "行政院向立法院提交下一年度的總預算案草案。",
  },
];

const BudgetDetail = ({ hasImage = true }: { hasImage?: boolean }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop)
    return (
      <div>
        <div className="mb-8">
          <BudgetHeader />
        </div>
        <div className="mx-2.5 flex flex-col">
          <NavLink to="/all-budgets" className="underline">
            {"<" + "回到列表頁"}
          </NavLink>
          <div className="relative mt-6">
            <div className="absolute h-full w-full translate-x-3 -translate-y-3 rounded-lg border-2 bg-[#C1C1C1]" />
            <div className="relative flex flex-col rounded-lg border-2 bg-[#F6F6F6] p-5 pb-30">
              <div className="mb-4 flex gap-5 border-b-2 p-3 text-xl font-bold">
                <p>編號</p>
                <p className="text-[#D18081]">99</p>
              </div>
              <div className="flex flex-col gap-y-10">
                {/* row 1 */}
                <section className="flex">
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      分類
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 pr-12">經濟部</p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      部會
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 pr-12">
                      台灣自來水股份有限公司
                    </p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      提案人（連署）
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 pr-14">
                      李柏毅
                      <br />
                      （王美惠、張宏陸）
                    </p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      提案
                    </p>
                    <p className="flex w-fit border-t-1 pt-4 pr-16">凍結</p>
                  </div>
                  <div className="grow">
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      審議結果
                    </p>
                    <p className="flex border-t-1 pt-4 pr-12">通過</p>
                  </div>
                </section>
                {/* row 2 */}
                <section className="flex">
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      審議階段
                    </p>
                    <div className="flex w-fit border-t-1 pt-4 pr-13">
                      <Timeline items={MOCK_DATA} />
                    </div>
                  </div>
                  <div className="grow">
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      是否併案
                    </p>
                    <div className="flex flex-col gap-y-4 border-t-1 pt-4">
                      <p>是</p>
                      <div className="grid-rows-auto grid grid-cols-3 gap-4.5">
                        <div className="flex gap-x-2">
                          <div className="mt-2 size-2 rounded-full bg-black" />
                          <div className="text-[#868686]">
                            <p className="underline">2025/08/01 </p>
                            <p>徐巧芯</p>
                          </div>
                        </div>
                        <div className="flex gap-x-2">
                          <div className="mt-2 size-2 rounded-full bg-black" />
                          <div className="text-[#868686]">
                            <p className="underline">2025/08/01 </p>
                            <p>徐巧芯、林昶佐、蔡其昌</p>
                          </div>
                        </div>
                        <div className="flex gap-x-2">
                          <div className="mt-2 size-2 rounded-full bg-black" />
                          <div className="text-[#868686]">
                            <p className="underline">2025/08/01 </p>
                            <p>徐巧芯、林昶佐、蔡其昌</p>
                          </div>
                        </div>
                        <div className="flex gap-x-2">
                          <div className="mt-2 size-2 rounded-full bg-black" />
                          <div className="text-[#868686]">
                            <p className="underline">2025/08/01 </p>
                            <p>徐巧芯</p>
                          </div>
                        </div>
                        <div className="flex gap-x-2">
                          <div className="mt-2 size-2 rounded-full bg-black" />
                          <div className="text-[#868686]">
                            <p className="underline">2025/08/01 </p>
                            <p>徐巧芯、林昶佐、蔡其昌</p>
                          </div>
                        </div>
                        <div className="flex gap-x-2">
                          <div className="mt-2 size-2 rounded-full bg-black" />
                          <div className="text-[#868686]">
                            <p className="underline">2025/08/01 </p>
                            <p>徐巧芯、林昶佐、蔡其昌</p>
                          </div>
                        </div>
                      </div>
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
                      <p className="text-sm">
                        原住民族委員會為深化民族教育內涵，促進原住民族族語、教育及文化推廣，提升大眾傳播媒體及其他公共領域原住民族史觀、文化、藝術能見度之目標，近年每年均編列「原住民族教育推展」媒體政策及業務宣導費，其預算數自111年度之475萬2千元逐年增加至113年度之1,560萬元，增加1,084萬8千元(增加約2.28倍)；且「原住民族教育推展」之媒體政策及業務宣導費占該項費用整體預算經費之比率，由111年度30.77%增至113年度60.34%，呈上升之勢。原住民族委員會賡續於114年度預算案「原住民族教育推展」工作計畫編列媒體政策及業務宣導費2,120萬元，包括辦理「原住民族教育協調與發展」及「原住民族文化維護與發展」等相關工作，預計辦理內容與113年度預算相近，惟該媒體政策及業務宣傳經費卻較113年度預算數1,560萬元增加35.90%，且較112年度決算數1,122萬5元增加88.86%，爰請原住民族委員會於2月內，向立法院內政委員會提出書面報告，說明預算相關運用規劃。【208】
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
                      <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold text-[#E9808E]">
                        21,200,000
                      </p>
                    </div>
                    <div>
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        減列金額
                      </p>
                      <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold text-[#E9808E]">
                        21,200,000
                      </p>
                    </div>
                    <div className="grow">
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        凍結金額
                      </p>
                      <p className="flex border-t-1 border-black pt-4 font-bold text-[#E9808E]">
                        1,200,000
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
                          <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold text-[#E9808E]">
                            21,200,000
                          </p>
                        </div>
                        <div>
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            減列金額
                          </p>
                          <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold text-[#E9808E]">
                            21,200,000
                          </p>
                        </div>
                        <div className="grow">
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            凍結金額
                          </p>
                          <p className="flex border-t-1 border-black pt-4 pr-[93px] font-bold text-[#E9808E]">
                            1,200,000
                          </p>
                        </div>
                      </div>
                      <div className="mt-9 flex max-w-5/6 flex-col gap-y-9">
                        <div className="grow">
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            科目/計畫
                          </p>
                          <p className="flex border-t-1 border-black pt-4 pr-9">
                            3703610100 一般行政 {">"} 02 基本行政工作維持費{" "}
                            {">"} 計畫 1090000
                          </p>
                        </div>
                        <div className="">
                          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                            計畫說明
                          </p>
                          <p className="flex border-t-1 border-black pt-4">
                            大樓管理費11815千元、保全人員及保全系統等費用270千元、新聞連絡聯誼費用100千元、文宣用品60千元、國會聯繫工作等費用150千元、政風及主計工作費用81千元、線上新聞資料庫維護及授權費用335千元、文康活動723千元(3000元*241人)、辦公室清潔維護費用及勞務外包協助行政事務等所需經費2690千元、員工協助方案150千元、辦理特種考試原住民族考試之分發所需經費140千元、檔案搬遷所需經費1000千元，合計17514千元。
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
                          src="/image/proposal-image-example.png"
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
                        3703610100 一般行政 {">"} 02 基本行政工作維持費 {">"}{" "}
                        計畫 1090000
                      </p>
                    </div>

                    <div className="w-[478px] max-w-[478px]">
                      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                        計畫說明
                      </p>
                      <p className="flex border-t-1 border-black pt-4">
                        大樓管理費11815千元、保全人員及保全系統等費用270千元、新聞連絡聯誼費用100千元、文宣用品60千元、國會聯繫工作等費用150千元、政風及主計工作費用81千元、線上新聞資料庫維護及授權費用335千元、文康活動723千元(3000元*241人)、辦公室清潔維護費用及勞務外包協助行政事務等所需經費2690千元、員工協助方案150千元、辦理特種考試原住民族考試之分發所需經費140千元、檔案搬遷所需經費1000千元，合計17514千元。
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
                      21,200,000
                    </p>
                  </div>
                  <div>
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      上年度法定預算
                    </p>
                    <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold">
                      21,200,000
                    </p>
                  </div>
                  <div className="grow">
                    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
                      與上年度比較
                    </p>
                    <p className="flex border-t-1 border-black pt-4 font-bold text-[#3E51FF]">
                      1,200,000
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
      <div className="mb-8">
        <BudgetHeader />
      </div>
      <div className="mx-2.5 flex flex-col">
        <NavLink to="/all-budgets" className="underline">
          {"<" + "回到列表頁"}
        </NavLink>
        <div className="mt-2 border-2 px-2 py-3">
          <section className="flex gap-6">
            <p>編號</p>
            <p className="text-[#D18081]">99</p>
          </section>
          <section className="flex gap-10">
            <div className="flex flex-col gap-y-4 font-bold">
              <p>分類</p>
              <p>經濟部</p>
            </div>
            <div className="flex flex-col gap-y-4 font-bold">
              <p>部會</p>
              <p>台灣自來水股份有限公司</p>
            </div>
          </section>
          <section>
            <p className="text-lg font-bold">審議階段/審議結果</p>
            <div>
              <Timeline items={MOCK_DATA} />
            </div>
          </section>
          <div className="mt-3 flex flex-col gap-y-3">
            <p className="font-bold">是否併案</p>
            <p>是</p>
          </div>
          <ul className="timeline timeline-vertical timeline-compact text-[#868686]">
            <li>
              <div className="timeline-middle">
                <div className="h-3 w-3 rounded-full bg-gray-900"></div>
              </div>
              <div className="timeline-end rounded-xl bg-transparent px-6">
                <p>2025/08/01</p>
                <p>徐巧芯</p>
              </div>
            </li>
            <li>
              <div className="timeline-middle">
                <div className="h-3 w-3 rounded-full bg-gray-900"></div>
              </div>
              <div className="timeline-end rounded-xl bg-transparent px-6">
                <p>2025/08/01</p>
                <p>徐巧芯、林昶佐、蔡其昌</p>
              </div>
            </li>
          </ul>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex flex-col gap-y-3">
            <p className="font-bold">提案人（連署）</p>
            <section>
              <p>李柏毅</p>
              <p>（王美惠、張宏陸）</p>
            </section>
          </div>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex justify-between">
            <section className="flex gap-x-12">
              <section className="flex-col">
                <p className="font-bold">提案</p>
                <p>凍結</p>
              </section>
              <section className="flex-col">
                <p className="font-bold">審議結果</p>
                <p>通過</p>
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
            <p>
              原住民族委員會為深化民族教育內涵，促進原住民族族語、教育及文化推廣，提升大眾傳播媒體及其他公共領域原住民族史觀、文化、藝術能見度之目標，近年每年均編列「原住民族教育推展」媒體政策及業務宣導費，其預算數自111年度之475萬2千元逐年增加至113年度之1,560萬元，增加1,084萬8千元(增加約2.28倍)；且「原住民族教育推展」之媒體政策及業務宣導費占該項費用整體預算經費之比率，由111年度30.77%增至113年度60.34%，呈上升之勢。原住民族委員會賡續於114年度預算案「原住民族教育推展」工作計畫編列媒體政策及業務宣導費2,120萬元，包括辦理「原住民族教育協調與發展」及「原住民族文化維護與發展」等相關工作，預計辦理內容與113年度預算相近，惟該媒體政策及業務宣傳經費卻較113年度預算數1,560萬元增加35.90%，且較112年度決算數1,122萬5元增加88.86%，爰請原住民族委員會於2月內，向立法院內政委員會提出書面報告，說明預算相關運用規劃。【208】
            </p>
          </div>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex gap-x-10">
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">預算金額</p>
              <p className="text-[#D18081]">21,200,000</p>
            </section>
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">減列金額</p>
              <p className="text-[#D18081]">21,200,000</p>
            </section>
          </div>
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex gap-x-10">
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">凍結金額</p>
              <p className="text-[#D18081]">21,200,000</p>
            </section>
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">預算書圖檔</p>
              <Image
                src="/icon/default-image.svg"
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
            <p>
              3703610100 一般行政 &gt; 02 基本行政工作維持費 &gt; 計畫 1090000
            </p>
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
            <p>
              大樓管理費11815千元、保全人員及保全系統等費用270千元、新聞連絡聯誼費用100千元、文宣用品60千元、國會聯繫工作等費用150千元、政風及主計工作費用81千元、線上新聞資料庫維護及授權費用335千元、文康活動723千元(3000元*241人)、辦公室清潔維護費用及勞務外包協助行政事務等所需經費2690千元、員工協助方案150千元、辦理特種考試原住民族考試之分發所需經費140千元、檔案搬遷所需經費1000千元，合計17514千元。
            </p>
          </div>
          {/* divider */}
          <div className="my-4 h-[1px] w-full bg-gray-300" />
          <div className="flex">
            <div className="flex flex-col gap-y-4">
              <p className="font-bold">上年度決算</p>
              <p>21200000</p>
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="font-bold">上年度法定預算</p>
              <p>21200000</p>
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="font-bold">與上年度比較</p>
              <p>+50%</p>
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
