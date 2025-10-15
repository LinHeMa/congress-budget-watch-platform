import * as Dialog from "@radix-ui/react-dialog";
import { useVoteActions, useVotes } from "../stores/vote.store";
import { NavLink } from "react-router";
import Image from "./image";
import { useRef, type RefObject } from "react";
import { useOnClickOutside, useToggle } from "usehooks-ts";
import React from "react";

export type BudgetTableData = {
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
};

type BudgetTableProps = {
  data: BudgetTableData[];
  className?: string;
  isDesktop?: boolean;
};

const TableRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col md:w-20 md:max-w-[138px]">
    <p className="flex w-full items-center justify-center border-y-2 bg-white font-bold md:h-[76px] md:border-y-2 md:bg-[#C7C7C7]">
      {label}
    </p>
    <div className="flex w-full items-center justify-start border-b-2 py-3 md:border-b-0">
      {children}
    </div>
  </div>
);

const ProposalContent = ({ content }: { content: string; itemId: string }) => (
  <div className="w-full py-3">
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
    <div className="flex flex-col md:w-full md:flex-row">
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

      <div className="grid grid-cols-[1fr_1fr_2fr_2fr] grid-rows-[76px] justify-items-center text-center">
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

const DesktopTableRow = ({ item }: { item: BudgetTableData }) => {
  const [isVoteMenuOpen, toggleIsVoteMenuOpen, setVoteMenuOpen] = useToggle();
  const voteMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutsideVoteMenu = () => {
    setVoteMenuOpen(false);
  };

  useOnClickOutside(
    voteMenuRef as RefObject<HTMLElement>,
    handleClickOutsideVoteMenu
  );

  return (
    <>
      <div className="flex flex-col items-start justify-start pt-3 text-sm">
        <NavLink
          to={`/budget/${item.id}`}
          className="text-[#D18081] hover:underline"
        >
          {item.id}
        </NavLink>
        <NavLink to={`/budget/${item.id}`} className="text-xs text-[#3E51FF]">
          [查看單頁]
        </NavLink>
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        {item.department}
      </div>
      <div className="flex flex-col items-start justify-start pt-3 text-sm">
        <div>{item.reviewDate}</div>
        <div className="text-gray-600">({item.reviewStage})</div>
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        {item.proposer}
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        {item.proposalType}
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        {item.proposalResult}
      </div>
      <div className="flex items-start justify-start pt-3 text-sm">
        <div className="relative w-full">
          <p className="line-clamp-4">{item.proposalContent}</p>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <span className="cursor-pointer text-xs text-blue-600 hover:underline">
                [更多]
              </span>
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
      <div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
        {item.reducedAmount.toLocaleString()}
      </div>
      <div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
        {item.originalAmount.toLocaleString()}
      </div>
      <div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
        999999
      </div>
      <div className="flex items-start justify-center pt-3">
        {/* <VoteButtons proposalId={item.id} /> */}
        <div
          ref={voteMenuRef}
          className="relative rounded-sm border-2 bg-white px-0.5 py-1 text-[8px]"
        >
          <span
            onClick={(e) => {
              e.preventDefault();
              toggleIsVoteMenuOpen();
            }}
            className="cursor-pointer"
          >
            請支援心情
          </span>
          {isVoteMenuOpen && (
            <div className="md: absolute right-0 bottom-0 z-10 w-[69px] rounded-[24px] border-2 bg-white p-2.5 text-[9px] md:translate-x-8 md:translate-y-[10.5rem] lg:translate-x-11 lg:translate-y-[10.5rem]">
              <div
                onClick={toggleIsVoteMenuOpen}
                className="flex flex-col items-center justify-center"
              >
                <Image
                  src="/image/vote-good.svg"
                  alt="vote-good"
                  className="w-12"
                />
                <p>我覺得很讚</p>
              </div>
              <div
                onClick={toggleIsVoteMenuOpen}
                className="mt-1.5 flex flex-col items-center justify-center"
              >
                <Image
                  src="/image/vote-angry.svg"
                  alt="vote-angry"
                  className="w-12"
                />
                <p>我感到生氣</p>
              </div>
              <div
                onClick={toggleIsVoteMenuOpen}
                className="mt-1.5 flex flex-col items-center justify-center"
              >
                <Image
                  src="/image/vote-sad.svg"
                  alt="vote-sad"
                  className="w-12"
                />
                <p>我有點失望</p>
              </div>
              <div
                onClick={toggleIsVoteMenuOpen}
                className="mt-1.5 flex flex-col items-center justify-center"
              >
                <Image
                  src="/image/vote-neutral.svg"
                  alt="vote-neutral"
                  className="w-12"
                />
                <p>我不在意</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const BudgetTable = ({ data, isDesktop, className = "" }: BudgetTableProps) => {
  if (isDesktop)
    return (
      <div className={`${className} space-y-10`}>
        {data.map((item) => (
          <div key={item.id}>
            {/* Header Row */}
            <div className="grid-rows-auto grid grid-cols-[1.2fr_1fr_1.5fr_1fr_1fr_1fr_2.5fr_1.5fr_1.5fr_1.3fr_1.2fr] bg-gray-100 font-bold">
              <div className="flex items-center justify-center border-y-2 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                編號
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                部會
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                審議日期 <br />
                （階段）
              </div>
              <div className="flex items-center justify-center border-y-2 px-2 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                提案人
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                提案
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                審議結果
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                提案內容
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                減列/
                <br /> 凍結金額
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                預算金額
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                關心數
              </div>
              <div className="flex items-center justify-center border-y-2 px-4 py-7 text-sm md:px-2 md:py-3.5 lg:px-4 lg:py-7">
                我關心這個
              </div>
            </div>
            <div className="grid grid-cols-[1.2fr_1fr_1.5fr_1fr_1fr_1fr_2.5fr_1.5fr_1.5fr_1.3fr_1.2fr]">
              <DesktopTableRow item={item} />
            </div>
          </div>
        ))}
      </div>
    );
  return (
    <div className={`flex flex-col ${className}`}>
      {data.map((item) => (
        <BudgetTableRow key={item.id} item={item} />
      ))}
    </div>
  );
};

export default BudgetTable;
