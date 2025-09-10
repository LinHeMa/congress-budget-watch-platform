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
          <p className="flex w-full items-center justify-center border-b-2 bg-white font-bold">
            部會
          </p>
          <p className="flex w-full items-center justify-start border-b-2 py-3">
            {item.department}
          </p>
          <p className="flex w-full items-center justify-center border-b-2 bg-white font-bold">
            審議日期（階段）
          </p>
          <p className="flex w-full items-center justify-start border-b-2 py-3">
            {item.reviewDate}
          </p>
          <p className="flex w-full items-center justify-center border-b-2 bg-white font-bold">
            提案人（連署）
          </p>
          <p className="flex w-full items-center justify-start border-b-2 py-3">
            {item.proposer}
          </p>
          {/* grid start */}
          <div className="grid-rows-auto grid grid-cols-4 justify-items-center text-center">
            <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold">
              提案
            </p>
            <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold">
              審議結果
            </p>
            <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold">
              預算金額
            </p>
            <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold">
              減列/凍結金額
            </p>
            <p className="w-full py-2">{item.proposalType}</p>
            <p className="w-full py-2">{item.proposalResult}</p>
            <p className="w-full py-2">{item.originalAmount}</p>
            <p className="w-full py-2">{item.reducedAmount}</p>
          </div>
          {/* grid end */}

          {/* proposal content start */}
          <p className="flex w-full items-center justify-center border-y-2 bg-white font-bold">
            提案內容
          </p>
          <div className="w-full border-b-2 py-3">
            <div className="relative flex items-start gap-2">
              <p className="line-clamp-8 flex-1">{item.proposalContent}</p>
              <div className="absolute right-0 bottom-0">
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button className="shrink-0 text-blue-600 hover:underline">
                      [更多]
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[80vh] w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-4 shadow-lg">
                      <div className="leading-relaxed whitespace-pre-wrap">
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
          <p className="flex w-full items-center justify-center border-b-2 bg-white font-bold">
            關心數
          </p>
          <p className="flex w-full items-center justify-center border-b-2 py-3">
            999999
          </p>
          <p className="flex w-full items-center justify-center border-b-2 bg-white font-bold">
            我要關心這個
          </p>
          <p className="flex w-full flex-col items-center justify-center gap-y-4 border-b-2 py-3">
            <button className="rounded-sm border-2 px-0.5 py-1">
              請支援心情
            </button>
            <ul className="flex grow gap-1 rounded-3xl border-2 bg-white p-2.5">
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
