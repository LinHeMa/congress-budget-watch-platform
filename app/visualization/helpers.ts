import type { GetPaginatedProposalsQuery } from "~/graphql/graphql";

export type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id: string;
  isFrozen?: boolean;
  children?: NodeDatum[];
};

const PARTY_COLORS = new Map<string, string>([
  ["中國國民黨", "#6B7FFF"],
  ["民主進步黨", "#00CD26"],
  ["親民黨", "#FF852E"],
  ["時代力量", "#F8E112"],
  ["台灣民眾黨", "#4EDEE6"],
  ["台灣基進", "#C45822"],
  ["台灣團結聯盟", "#B39171"],
  ["新黨", "#F3F08C"],
  ["社會民主黨", "#BC4CAB"],
  ["無黨團結聯盟", "#E5AEAF"],
  ["無黨籍", "#D5D5D5"],
]);
const DEFAULT_COLOR = "#D5D5D5"; // 無黨籍

export const transformToCirclePackData = (
  data: GetPaginatedProposalsQuery,
): NodeDatum => {
  const children = data.proposals?.map((proposal) => {
    const { id, proposers, freezeAmount, reductionAmount } = proposal;
    const proposer = proposers?.[0]; // Assuming the first proposer is the main one
    const party = proposer?.party?.name ?? "無黨籍";
    const value = freezeAmount || reductionAmount || 0;
    const name = `${proposer?.name}\n${party}\n${value.toLocaleString()}元`;

    const color = PARTY_COLORS.get(party) || DEFAULT_COLOR;

    return {
      name,
      value,
      color: color,
      isFrozen: !!freezeAmount,
      id: id,
      children: [],
    };
  });

  return {
    id: "root",
    name: "root",
    children: children,
  };
};
