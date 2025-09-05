/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "query GetBudgets {\n  budgets {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    majorCategory\n    mediumCategory\n    minorCategory\n    description\n  }\n  budgetsCount\n}\n\nquery GetBudget($id: ID!) {\n  budget(where: {id: $id}) {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    lastYearSettlement\n    majorCategory\n    mediumCategory\n    minorCategory\n    budgetUrl\n    description\n    government {\n      id\n    }\n  }\n}": typeof types.GetBudgetsDocument;
  "query GetMeetings {\n  meetings {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n  }\n  meetingsCount\n}\n\nquery GetMeeting($id: ID!) {\n  meeting(where: {id: $id}) {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n    committee {\n      id\n    }\n  }\n}": typeof types.GetMeetingsDocument;
  "query GetProposals {\n  proposals {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    description\n  }\n  proposalsCount\n}\n\nquery GetProposal($id: ID!) {\n  proposal(where: {id: $id}) {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    budgetImageUrl\n    description\n    meetingsCount\n    proposersCount\n    coSignersCount\n    government {\n      id\n    }\n    budget {\n      id\n      projectName\n    }\n  }\n}": typeof types.GetProposalsDocument;
};
const documents: Documents = {
  "query GetBudgets {\n  budgets {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    majorCategory\n    mediumCategory\n    minorCategory\n    description\n  }\n  budgetsCount\n}\n\nquery GetBudget($id: ID!) {\n  budget(where: {id: $id}) {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    lastYearSettlement\n    majorCategory\n    mediumCategory\n    minorCategory\n    budgetUrl\n    description\n    government {\n      id\n    }\n  }\n}":
    types.GetBudgetsDocument,
  "query GetMeetings {\n  meetings {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n  }\n  meetingsCount\n}\n\nquery GetMeeting($id: ID!) {\n  meeting(where: {id: $id}) {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n    committee {\n      id\n    }\n  }\n}":
    types.GetMeetingsDocument,
  "query GetProposals {\n  proposals {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    description\n  }\n  proposalsCount\n}\n\nquery GetProposal($id: ID!) {\n  proposal(where: {id: $id}) {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    budgetImageUrl\n    description\n    meetingsCount\n    proposersCount\n    coSignersCount\n    government {\n      id\n    }\n    budget {\n      id\n      projectName\n    }\n  }\n}":
    types.GetProposalsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetBudgets {\n  budgets {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    majorCategory\n    mediumCategory\n    minorCategory\n    description\n  }\n  budgetsCount\n}\n\nquery GetBudget($id: ID!) {\n  budget(where: {id: $id}) {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    lastYearSettlement\n    majorCategory\n    mediumCategory\n    minorCategory\n    budgetUrl\n    description\n    government {\n      id\n    }\n  }\n}"
): (typeof documents)["query GetBudgets {\n  budgets {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    majorCategory\n    mediumCategory\n    minorCategory\n    description\n  }\n  budgetsCount\n}\n\nquery GetBudget($id: ID!) {\n  budget(where: {id: $id}) {\n    id\n    type\n    year\n    projectName\n    projectDescription\n    budgetAmount\n    lastYearSettlement\n    majorCategory\n    mediumCategory\n    minorCategory\n    budgetUrl\n    description\n    government {\n      id\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetMeetings {\n  meetings {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n  }\n  meetingsCount\n}\n\nquery GetMeeting($id: ID!) {\n  meeting(where: {id: $id}) {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n    committee {\n      id\n    }\n  }\n}"
): (typeof documents)["query GetMeetings {\n  meetings {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n  }\n  meetingsCount\n}\n\nquery GetMeeting($id: ID!) {\n  meeting(where: {id: $id}) {\n    id\n    type\n    location\n    meetingDate\n    meetingRecordUrl\n    description\n    committee {\n      id\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetProposals {\n  proposals {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    description\n  }\n  proposalsCount\n}\n\nquery GetProposal($id: ID!) {\n  proposal(where: {id: $id}) {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    budgetImageUrl\n    description\n    meetingsCount\n    proposersCount\n    coSignersCount\n    government {\n      id\n    }\n    budget {\n      id\n      projectName\n    }\n  }\n}"
): (typeof documents)["query GetProposals {\n  proposals {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    description\n  }\n  proposalsCount\n}\n\nquery GetProposal($id: ID!) {\n  proposal(where: {id: $id}) {\n    id\n    proposalTypes\n    result\n    reductionAmount\n    freezeAmount\n    unfreezeStatus\n    budgetImageUrl\n    description\n    meetingsCount\n    proposersCount\n    coSignersCount\n    government {\n      id\n    }\n    budget {\n      id\n      projectName\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
