import { Link } from "react-router";

interface BudgetTableData {
  id: string;
  department: string;
  reviewDate: string;
  reviewStage: string;
  proposer: string;
  cosigners?: string;
  proposalType: string;
  proposalResult: string;
  originalAmount: number;
  reducedAmount: number;
  proposalContent: string;
}

interface BudgetTableProps {
  data: BudgetTableData[];
  className?: string;
}

const BudgetTable = ({ data, className = "" }: BudgetTableProps) => {
  return (
    <div className="flex flex-col">
      {data.map((item) => (
        <div key={item.id} className="flex flex-col">
          <p>部會</p>
          <p>{item.department}</p>
          <p>審議日期（階段）</p>
          <p>{item.reviewDate}</p>
          <p>提案人（連署）</p>
          <p>{item.proposer}</p>
          <div className="grid grid-cols-4 grid-rows-2 justify-items-center text-center">
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b flex items-center justify-center">提案</p>
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b flex items-center justify-center">審議結果</p>
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b flex items-center justify-center">預算金額</p>
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b flex items-center justify-center">減列/凍結金額</p>
            <p className="w-full ">{item.proposalType}</p>
            <p className="w-full ">{item.proposalResult}</p>
            <p className="w-full ">{item.originalAmount}</p>
            <p className="w-full ">{item.reducedAmount}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetTable;
