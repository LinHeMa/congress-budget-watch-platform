import { NavLink } from "react-router";
import BudgetHeader from "~/components/budget-header";
import { Timeline } from "../components/timeline/Timeline";

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

const BudgetDetail = () => {
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
            <div className="">
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
          <div className="flex flex-col gap-y-3">
            <p className="font-bold">提案人（連署）</p>
            <section>
              <p>李柏毅</p>
              <p>（王美惠、張宏陸）</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetail;
