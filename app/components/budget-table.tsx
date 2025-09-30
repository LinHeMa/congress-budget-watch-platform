import * as Dialog from "@radix-ui/react-dialog";
import { useVoteActions, useVotes } from "../stores/vote.store";
import { NavLink } from "react-router";
import Image from "./image";

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

const TableRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex md:w-20 md:max-w-[138px] md:flex-col">
    <p className="flex w-full items-center justify-center border-b-2 bg-white font-bold md:h-[76px] md:border-y-2 md:bg-[#C7C7C7]">
      {label}
    </p>
    <div className="flex w-full items-center justify-start border-b-2 py-3 md:border-b-0">
      {children}
    </div>
  </div>
);

const ProposalContent = ({
  content,
  itemId,
}: {
  content: string;
  itemId: string;
}) => (
  <div className="w-full border-b-2 py-3">
    <div className="relative flex items-start gap-2">
      <p className="mb-5 line-clamp-8 flex-1">{content}</p>
      <div className="absolute right-0 bottom-0">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <span className="shrink-0 text-blue-600 hover:underline">
              [更多]
            </span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[80vh] w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-4 shadow-lg">
              <div className="leading-relaxed whitespace-pre-wrap">
                {content}
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
);

const VoteButtons = ({ proposalId }: { proposalId: string }) => {
  const { setVote } = useVoteActions();
  const votes = useVotes();
  const currentVote = votes[proposalId];

  const voteOptions = [
    { label: "sad", value: "sad" },
    { label: "angry", value: "angry" },
    { label: "neutral", value: "neutral" },
    { label: "good", value: "good" },
  ];

  return (
    <div className="flex w-full items-center justify-center gap-x-4">
      {voteOptions.map(({ label, value }) => (
        <button
          key={value}
          onClick={(e) => {
            e.preventDefault();
            setVote(proposalId, value);
          }}
          className={`rounded-full p-2 ${
            currentVote === value ? "bg-gray-300" : ""
          }`}
        >
          <Image src={`/image/vote-${label}.svg`} alt={label} />
        </button>
      ))}
    </div>
  );
};

const BudgetTableRow = ({ item }: { item: BudgetTableData }) => {
  return (
    <div className="flex flex-col md:flex-row md:w-full">
      <div className="flex items-center justify-start gap-x-2 border-y-2 bg-[#C7C7C7] py-2 md:min-w-16 md:flex-col md:border-y-0 md:bg-[#F5F5F5] md:py-0">
        <span className="flex items-center font-bold md:flex md:h-[76px] md:border-y-2 md:bg-[#C7C7C7] md:px-4 md:py-5">
          編號
        </span>
        <span className="md:text-md font-bold text-[#D18081] md:mt-4 md:bg-[#F5F5F5]">
          {item.id}
        </span>
        <NavLink
          to={`/budget/${item.id}`}
          className="ml-2 text-xs text-[#3E51FF] md:ml-0 md:bg-[#F5F5F5]"
        >
          [查看單頁]
        </NavLink>
      </div>
      <TableRow label="部會">{item.department}</TableRow>
      <TableRow label="審議日期（階段）">{item.reviewDate}</TableRow>
      <TableRow label="提案人（連署）">{item.proposer}</TableRow>

      <div className="grid grid-cols-[44px_45px_92px_92px] grid-rows-[76px] justify-items-center text-center">
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:border-y-2 md:bg-[#C7C7C7] md:p-0">
          提案
        </p>
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:w-[120px] md:border-y-2 md:bg-[#C7C7C7] md:p-0">
          審議結果
        </p>
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:border-y-2 md:bg-[#C7C7C7] md:p-0">
          預算金額
        </p>
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:border-y-2 md:bg-[#C7C7C7] md:p-0">
          減列/凍結金額
        </p>
        <p className="w-full py-2">{item.proposalType}</p>
        <p className="w-full py-2">{item.proposalResult}</p>
        <p className="w-full py-2">{item.originalAmount}</p>
        <p className="w-full py-2">{item.reducedAmount}</p>
      </div>

      <TableRow label="提案內容">
        <ProposalContent content={item.proposalContent} itemId={item.id} />
      </TableRow>
      <TableRow label="關心數">999999</TableRow>
      <TableRow label="我要關心這個">
        <div className="mb-9 flex w-full flex-col items-center justify-center gap-y-4">
          <button
            className="rounded-sm border-2 px-0.5 py-1"
            onClick={(e) => {
              e.preventDefault();
              // TODO: wire up this button's action
            }}
          >
            請支援心情
          </button>
          <div className="flex w-full items-center justify-center rounded-3xl border-2 bg-white">
            <VoteButtons proposalId={item.id} />
          </div>
        </div>
      </TableRow>
    </div>
  );
};

const BudgetTable = ({ data, className = "" }: BudgetTableProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {data.map((item) => (
        <BudgetTableRow key={item.id} item={item} />
      ))}
    </div>
  );
};

export default BudgetTable;
