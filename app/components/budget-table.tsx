import { Link } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";

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
          <p className="w-full flex items-center justify-center bg-white border-b-2 font-bold">
            部會
          </p>
          <p className="w-full flex items-center justify-start border-b-2 py-3">
            {item.department}
          </p>
          <p className="w-full flex items-center justify-center bg-white border-b-2 font-bold">
            審議日期（階段）
          </p>
          <p className="w-full flex items-center justify-start border-b-2 py-3">
            {item.reviewDate}
          </p>
          <p className="w-full flex items-center justify-center bg-white border-b-2 font-bold">
            提案人（連署）
          </p>
          <p className="w-full flex items-center justify-start border-b-2 py-3">
            {item.proposer}
          </p>
          {/* grid start */}
          <div className="grid grid-cols-4 grid-rows-auto justify-items-center text-center">
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b-2 flex items-center justify-center">
              提案
            </p>
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b-2 flex items-center justify-center">
              審議結果
            </p>
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b-2 flex items-center justify-center">
              預算金額
            </p>
            <p className="px-2 py-3.5 font-bold bg-white size-full border-b-2 flex items-center justify-center">
              減列/凍結金額
            </p>
            <p className="w-full py-2">{item.proposalType}</p>
            <p className="w-full py-2">{item.proposalResult}</p>
            <p className="w-full py-2">{item.originalAmount}</p>
            <p className="w-full py-2">{item.reducedAmount}</p>
          </div>
          {/* grid end */}

          {/* proposal content start */}
          <p className="w-full flex items-center justify-center bg-white border-y-2 font-bold">
            提案內容
          </p>
          <div className="w-full border-b-2 py-3">
            <div className="relative flex items-start gap-2">
              <p className="flex-1 line-clamp-8">{item.proposalContent}</p>
              <div className="absolute bottom-0 right-0">
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button className="shrink-0 text-blue-600 hover:underline">
                      [更多]
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-[720px] max-h-[80vh] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-4 shadow-lg">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {item.proposalContent}
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Dialog.Close asChild>
                          <button className="rounded bg-[#3E51FF] px-3 py-1 text-white">
                            關閉
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
          </div>
          {/* proposal content end */}
          <p className="w-full flex items-center justify-center bg-white border-b-2 font-bold">
            關心數
          </p>
          <p className="w-full flex items-center justify-center border-b-2 py-3">
            999999
          </p>
          <p className="w-full flex items-center justify-center bg-white border-b-2 font-bold">
            我要關心這個
          </p>
          <p className="w-full flex flex-col gap-y-4 items-center justify-center border-b-2 py-3">
            <button className="border-2 rounded-sm px-0.5 py-1">請支援心情</button>
            <ul className="grow flex gap-1 p-2.5 bg-white rounded-3xl border-2">
              <li>
                <img src="/image/vote-good.svg" alt="vote good" />
              </li>
              <li>
                <img src="/image/vote-angry.svg" alt="vote angry" />
              </li>
              <li>
                <img src="/image/vote-sad.svg" alt="vote sad" />
              </li>
              <li></li>
              <li>
                <img src="/image/vote-neutral.svg" alt="vote neutral" />
              </li>
            </ul>
          </p>
        </div>
      ))}
    </div>
  );
};

export default BudgetTable;
