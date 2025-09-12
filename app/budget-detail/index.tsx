import { NavLink } from "react-router";
import BudgetHeader from "~/components/budget-header";
import { Timeline } from '../components/timeline/Timeline';

const MOCK_DATA = [
  {
    id: 1,
    date: '2024年2月1日',
    title: '立法院三讀通過',
    description: '院會進行最終表決，正式通過預算案。',
  },
  {
    id: 2,
    date: '2024年1月15日',
    title: '委員會完成審查',
    description: '相關委員會完成所有預算的審查與協商。',
  },
  {
    id: 3,
    date: '2023年12月5日',
    title: '行政院提交預算草案',
    description: '行政院向立法院提交下一年度的總預算案草案。',
  },
];

const BudgetDetail = () => {
  return (
    <div className="flex flex-col px-2 py-3">
      <BudgetHeader />
      <NavLink to="/all-budgets">回到列表頁</NavLink>
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
        <div>審議階段/審議結果</div>
        {/* insert here start */}
        <div className="mt-8">
          <Timeline items={MOCK_DATA} />
        </div>
        {/* insert here end */}
      </section>
    </div>
  );
};

export default BudgetDetail;
