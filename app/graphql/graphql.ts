/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AuthenticatedItem = User;

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilter>;
};

export type Budget = {
  __typename?: 'Budget';
  budgetAmount?: Maybe<Scalars['Float']['output']>;
  budgetUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  government?: Maybe<Government>;
  id: Scalars['ID']['output'];
  lastYearSettlement?: Maybe<Scalars['Float']['output']>;
  majorCategory?: Maybe<Scalars['String']['output']>;
  mediumCategory?: Maybe<Scalars['String']['output']>;
  minorCategory?: Maybe<Scalars['String']['output']>;
  projectDescription?: Maybe<Scalars['String']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type BudgetCreateInput = {
  budgetAmount?: InputMaybe<Scalars['Float']['input']>;
  budgetUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForCreateInput>;
  lastYearSettlement?: InputMaybe<Scalars['Float']['input']>;
  majorCategory?: InputMaybe<Scalars['String']['input']>;
  mediumCategory?: InputMaybe<Scalars['String']['input']>;
  minorCategory?: InputMaybe<Scalars['String']['input']>;
  projectDescription?: InputMaybe<Scalars['String']['input']>;
  projectName?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type BudgetOrderByInput = {
  budgetAmount?: InputMaybe<OrderDirection>;
  budgetUrl?: InputMaybe<OrderDirection>;
  description?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  lastYearSettlement?: InputMaybe<OrderDirection>;
  majorCategory?: InputMaybe<OrderDirection>;
  mediumCategory?: InputMaybe<OrderDirection>;
  minorCategory?: InputMaybe<OrderDirection>;
  projectDescription?: InputMaybe<OrderDirection>;
  projectName?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
  year?: InputMaybe<OrderDirection>;
};

export type BudgetRelateToOneForCreateInput = {
  connect?: InputMaybe<BudgetWhereUniqueInput>;
  create?: InputMaybe<BudgetCreateInput>;
};

export type BudgetRelateToOneForUpdateInput = {
  connect?: InputMaybe<BudgetWhereUniqueInput>;
  create?: InputMaybe<BudgetCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BudgetUpdateArgs = {
  data: BudgetUpdateInput;
  where: BudgetWhereUniqueInput;
};

export type BudgetUpdateInput = {
  budgetAmount?: InputMaybe<Scalars['Float']['input']>;
  budgetUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForUpdateInput>;
  lastYearSettlement?: InputMaybe<Scalars['Float']['input']>;
  majorCategory?: InputMaybe<Scalars['String']['input']>;
  mediumCategory?: InputMaybe<Scalars['String']['input']>;
  minorCategory?: InputMaybe<Scalars['String']['input']>;
  projectDescription?: InputMaybe<Scalars['String']['input']>;
  projectName?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type BudgetWhereInput = {
  AND?: InputMaybe<Array<BudgetWhereInput>>;
  NOT?: InputMaybe<Array<BudgetWhereInput>>;
  OR?: InputMaybe<Array<BudgetWhereInput>>;
  budgetAmount?: InputMaybe<FloatFilter>;
  budgetUrl?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  government?: InputMaybe<GovernmentWhereInput>;
  id?: InputMaybe<IdFilter>;
  lastYearSettlement?: InputMaybe<FloatNullableFilter>;
  majorCategory?: InputMaybe<StringFilter>;
  mediumCategory?: InputMaybe<StringFilter>;
  minorCategory?: InputMaybe<StringFilter>;
  projectDescription?: InputMaybe<StringNullableFilter>;
  projectName?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringFilter>;
  year?: InputMaybe<IntFilter>;
};

export type BudgetWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Committee = {
  __typename?: 'Committee';
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  key?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<People>>;
  membersCount?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  session?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  term?: Maybe<Term>;
};


export type CommitteeMembersArgs = {
  cursor?: InputMaybe<PeopleWhereUniqueInput>;
  orderBy?: Array<PeopleOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PeopleWhereInput;
};


export type CommitteeMembersCountArgs = {
  where?: PeopleWhereInput;
};

export type CommitteeCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  members?: InputMaybe<PeopleRelateToManyForCreateInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  session?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  term?: InputMaybe<TermRelateToOneForCreateInput>;
};

export type CommitteeManyRelationFilter = {
  every?: InputMaybe<CommitteeWhereInput>;
  none?: InputMaybe<CommitteeWhereInput>;
  some?: InputMaybe<CommitteeWhereInput>;
};

export type CommitteeOrderByInput = {
  description?: InputMaybe<OrderDirection>;
  endDate?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  session?: InputMaybe<OrderDirection>;
  startDate?: InputMaybe<OrderDirection>;
};

export type CommitteeRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
  create?: InputMaybe<Array<CommitteeCreateInput>>;
};

export type CommitteeRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
  create?: InputMaybe<Array<CommitteeCreateInput>>;
  disconnect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
  set?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
};

export type CommitteeRelateToOneForCreateInput = {
  connect?: InputMaybe<CommitteeWhereUniqueInput>;
  create?: InputMaybe<CommitteeCreateInput>;
};

export type CommitteeRelateToOneForUpdateInput = {
  connect?: InputMaybe<CommitteeWhereUniqueInput>;
  create?: InputMaybe<CommitteeCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CommitteeUpdateArgs = {
  data: CommitteeUpdateInput;
  where: CommitteeWhereUniqueInput;
};

export type CommitteeUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  members?: InputMaybe<PeopleRelateToManyForUpdateInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  session?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  term?: InputMaybe<TermRelateToOneForUpdateInput>;
};

export type CommitteeWhereInput = {
  AND?: InputMaybe<Array<CommitteeWhereInput>>;
  NOT?: InputMaybe<Array<CommitteeWhereInput>>;
  OR?: InputMaybe<Array<CommitteeWhereInput>>;
  description?: InputMaybe<StringNullableFilter>;
  endDate?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<IdFilter>;
  members?: InputMaybe<PeopleManyRelationFilter>;
  name?: InputMaybe<StringFilter>;
  session?: InputMaybe<StringFilter>;
  startDate?: InputMaybe<DateTimeFilter>;
  term?: InputMaybe<TermWhereInput>;
};

export type CommitteeWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateInitialUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type FloatFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<FloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type FloatNullableFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<FloatNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type Government = {
  __typename?: 'Government';
  category?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type GovernmentCreateInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GovernmentOrderByInput = {
  category?: InputMaybe<OrderDirection>;
  description?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type GovernmentRelateToOneForCreateInput = {
  connect?: InputMaybe<GovernmentWhereUniqueInput>;
  create?: InputMaybe<GovernmentCreateInput>;
};

export type GovernmentRelateToOneForUpdateInput = {
  connect?: InputMaybe<GovernmentWhereUniqueInput>;
  create?: InputMaybe<GovernmentCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GovernmentUpdateArgs = {
  data: GovernmentUpdateInput;
  where: GovernmentWhereUniqueInput;
};

export type GovernmentUpdateInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GovernmentWhereInput = {
  AND?: InputMaybe<Array<GovernmentWhereInput>>;
  NOT?: InputMaybe<Array<GovernmentWhereInput>>;
  OR?: InputMaybe<Array<GovernmentWhereInput>>;
  category?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
};

export type GovernmentWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type IdFilter = {
  equals?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilter>;
  notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type KeystoneAdminMeta = {
  __typename?: 'KeystoneAdminMeta';
  list?: Maybe<KeystoneAdminUiListMeta>;
  lists: Array<KeystoneAdminUiListMeta>;
};


export type KeystoneAdminMetaListArgs = {
  key: Scalars['String']['input'];
};

export type KeystoneAdminUiFieldGroupMeta = {
  __typename?: 'KeystoneAdminUIFieldGroupMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  label: Scalars['String']['output'];
};

export type KeystoneAdminUiFieldMeta = {
  __typename?: 'KeystoneAdminUIFieldMeta';
  createView: KeystoneAdminUiFieldMetaCreateView;
  customViewsIndex?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fieldMeta?: Maybe<Scalars['JSON']['output']>;
  isFilterable: Scalars['Boolean']['output'];
  isNonNull?: Maybe<Array<KeystoneAdminUiFieldMetaIsNonNull>>;
  isOrderable: Scalars['Boolean']['output'];
  itemView?: Maybe<KeystoneAdminUiFieldMetaItemView>;
  label: Scalars['String']['output'];
  listView: KeystoneAdminUiFieldMetaListView;
  path: Scalars['String']['output'];
  search?: Maybe<QueryMode>;
  viewsIndex: Scalars['Int']['output'];
};


export type KeystoneAdminUiFieldMetaItemViewArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type KeystoneAdminUiFieldMetaCreateView = {
  __typename?: 'KeystoneAdminUIFieldMetaCreateView';
  fieldMode: KeystoneAdminUiFieldMetaCreateViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaCreateViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden'
}

export enum KeystoneAdminUiFieldMetaIsNonNull {
  Create = 'create',
  Read = 'read',
  Update = 'update'
}

export type KeystoneAdminUiFieldMetaItemView = {
  __typename?: 'KeystoneAdminUIFieldMetaItemView';
  fieldMode?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldMode>;
  fieldPosition?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldPosition>;
};

export enum KeystoneAdminUiFieldMetaItemViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden',
  Read = 'read'
}

export enum KeystoneAdminUiFieldMetaItemViewFieldPosition {
  Form = 'form',
  Sidebar = 'sidebar'
}

export type KeystoneAdminUiFieldMetaListView = {
  __typename?: 'KeystoneAdminUIFieldMetaListView';
  fieldMode: KeystoneAdminUiFieldMetaListViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaListViewFieldMode {
  Hidden = 'hidden',
  Read = 'read'
}

export type KeystoneAdminUiListMeta = {
  __typename?: 'KeystoneAdminUIListMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  groups: Array<KeystoneAdminUiFieldGroupMeta>;
  hideCreate: Scalars['Boolean']['output'];
  hideDelete: Scalars['Boolean']['output'];
  initialColumns: Array<Scalars['String']['output']>;
  initialSort?: Maybe<KeystoneAdminUiSort>;
  isHidden: Scalars['Boolean']['output'];
  isSingleton: Scalars['Boolean']['output'];
  itemQueryName: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  labelField: Scalars['String']['output'];
  listQueryName: Scalars['String']['output'];
  pageSize: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  plural: Scalars['String']['output'];
  singular: Scalars['String']['output'];
};

export type KeystoneAdminUiSort = {
  __typename?: 'KeystoneAdminUISort';
  direction: KeystoneAdminUiSortDirection;
  field: Scalars['String']['output'];
};

export enum KeystoneAdminUiSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type KeystoneMeta = {
  __typename?: 'KeystoneMeta';
  adminMeta: KeystoneAdminMeta;
};

export type Meeting = {
  __typename?: 'Meeting';
  committee?: Maybe<Committee>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  government?: Maybe<Government>;
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  meetingDate?: Maybe<Scalars['DateTime']['output']>;
  meetingRecordUrl?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type MeetingCreateInput = {
  committee?: InputMaybe<CommitteeRelateToOneForCreateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForCreateInput>;
  location?: InputMaybe<Scalars['String']['input']>;
  meetingDate?: InputMaybe<Scalars['DateTime']['input']>;
  meetingRecordUrl?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type MeetingManyRelationFilter = {
  every?: InputMaybe<MeetingWhereInput>;
  none?: InputMaybe<MeetingWhereInput>;
  some?: InputMaybe<MeetingWhereInput>;
};

export type MeetingOrderByInput = {
  description?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  location?: InputMaybe<OrderDirection>;
  meetingDate?: InputMaybe<OrderDirection>;
  meetingRecordUrl?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
};

export type MeetingRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<MeetingWhereUniqueInput>>;
  create?: InputMaybe<Array<MeetingCreateInput>>;
};

export type MeetingRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<MeetingWhereUniqueInput>>;
  create?: InputMaybe<Array<MeetingCreateInput>>;
  disconnect?: InputMaybe<Array<MeetingWhereUniqueInput>>;
  set?: InputMaybe<Array<MeetingWhereUniqueInput>>;
};

export type MeetingRelateToOneForCreateInput = {
  connect?: InputMaybe<MeetingWhereUniqueInput>;
  create?: InputMaybe<MeetingCreateInput>;
};

export type MeetingRelateToOneForUpdateInput = {
  connect?: InputMaybe<MeetingWhereUniqueInput>;
  create?: InputMaybe<MeetingCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MeetingUpdateArgs = {
  data: MeetingUpdateInput;
  where: MeetingWhereUniqueInput;
};

export type MeetingUpdateInput = {
  committee?: InputMaybe<CommitteeRelateToOneForUpdateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForUpdateInput>;
  location?: InputMaybe<Scalars['String']['input']>;
  meetingDate?: InputMaybe<Scalars['DateTime']['input']>;
  meetingRecordUrl?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type MeetingWhereInput = {
  AND?: InputMaybe<Array<MeetingWhereInput>>;
  NOT?: InputMaybe<Array<MeetingWhereInput>>;
  OR?: InputMaybe<Array<MeetingWhereInput>>;
  committee?: InputMaybe<CommitteeWhereInput>;
  description?: InputMaybe<StringFilter>;
  government?: InputMaybe<GovernmentWhereInput>;
  id?: InputMaybe<IdFilter>;
  location?: InputMaybe<StringNullableFilter>;
  meetingDate?: InputMaybe<DateTimeNullableFilter>;
  meetingRecordUrl?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringNullableFilter>;
};

export type MeetingWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticateUserWithPassword?: Maybe<UserAuthenticationWithPasswordResult>;
  createBudget?: Maybe<Budget>;
  createBudgets?: Maybe<Array<Maybe<Budget>>>;
  createCommittee?: Maybe<Committee>;
  createCommittees?: Maybe<Array<Maybe<Committee>>>;
  createGovernment?: Maybe<Government>;
  createGovernments?: Maybe<Array<Maybe<Government>>>;
  createInitialUser: UserAuthenticationWithPasswordSuccess;
  createMeeting?: Maybe<Meeting>;
  createMeetings?: Maybe<Array<Maybe<Meeting>>>;
  createParties?: Maybe<Array<Maybe<Party>>>;
  createParty?: Maybe<Party>;
  createPeople?: Maybe<People>;
  createPeopleList?: Maybe<Array<Maybe<People>>>;
  createProposal?: Maybe<Proposal>;
  createProposals?: Maybe<Array<Maybe<Proposal>>>;
  createRecognitionImage?: Maybe<RecognitionImage>;
  createRecognitionImages?: Maybe<Array<Maybe<RecognitionImage>>>;
  createRecognitionStatus?: Maybe<RecognitionStatus>;
  createRecognitionStatuses?: Maybe<Array<Maybe<RecognitionStatus>>>;
  createTerm?: Maybe<Term>;
  createTerms?: Maybe<Array<Maybe<Term>>>;
  createUser?: Maybe<User>;
  createUsers?: Maybe<Array<Maybe<User>>>;
  deleteBudget?: Maybe<Budget>;
  deleteBudgets?: Maybe<Array<Maybe<Budget>>>;
  deleteCommittee?: Maybe<Committee>;
  deleteCommittees?: Maybe<Array<Maybe<Committee>>>;
  deleteGovernment?: Maybe<Government>;
  deleteGovernments?: Maybe<Array<Maybe<Government>>>;
  deleteMeeting?: Maybe<Meeting>;
  deleteMeetings?: Maybe<Array<Maybe<Meeting>>>;
  deleteParties?: Maybe<Array<Maybe<Party>>>;
  deleteParty?: Maybe<Party>;
  deletePeople?: Maybe<People>;
  deletePeopleList?: Maybe<Array<Maybe<People>>>;
  deleteProposal?: Maybe<Proposal>;
  deleteProposals?: Maybe<Array<Maybe<Proposal>>>;
  deleteRecognitionImage?: Maybe<RecognitionImage>;
  deleteRecognitionImages?: Maybe<Array<Maybe<RecognitionImage>>>;
  deleteRecognitionStatus?: Maybe<RecognitionStatus>;
  deleteRecognitionStatuses?: Maybe<Array<Maybe<RecognitionStatus>>>;
  deleteTerm?: Maybe<Term>;
  deleteTerms?: Maybe<Array<Maybe<Term>>>;
  deleteUser?: Maybe<User>;
  deleteUsers?: Maybe<Array<Maybe<User>>>;
  endSession: Scalars['Boolean']['output'];
  updateBudget?: Maybe<Budget>;
  updateBudgets?: Maybe<Array<Maybe<Budget>>>;
  updateCommittee?: Maybe<Committee>;
  updateCommittees?: Maybe<Array<Maybe<Committee>>>;
  updateGovernment?: Maybe<Government>;
  updateGovernments?: Maybe<Array<Maybe<Government>>>;
  updateMeeting?: Maybe<Meeting>;
  updateMeetings?: Maybe<Array<Maybe<Meeting>>>;
  updateParties?: Maybe<Array<Maybe<Party>>>;
  updateParty?: Maybe<Party>;
  updatePeople?: Maybe<People>;
  updatePeopleList?: Maybe<Array<Maybe<People>>>;
  updateProposal?: Maybe<Proposal>;
  updateProposals?: Maybe<Array<Maybe<Proposal>>>;
  updateRecognitionImage?: Maybe<RecognitionImage>;
  updateRecognitionImages?: Maybe<Array<Maybe<RecognitionImage>>>;
  updateRecognitionStatus?: Maybe<RecognitionStatus>;
  updateRecognitionStatuses?: Maybe<Array<Maybe<RecognitionStatus>>>;
  updateTerm?: Maybe<Term>;
  updateTerms?: Maybe<Array<Maybe<Term>>>;
  updateUser?: Maybe<User>;
  updateUsers?: Maybe<Array<Maybe<User>>>;
};


export type MutationAuthenticateUserWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationCreateBudgetArgs = {
  data: BudgetCreateInput;
};


export type MutationCreateBudgetsArgs = {
  data: Array<BudgetCreateInput>;
};


export type MutationCreateCommitteeArgs = {
  data: CommitteeCreateInput;
};


export type MutationCreateCommitteesArgs = {
  data: Array<CommitteeCreateInput>;
};


export type MutationCreateGovernmentArgs = {
  data: GovernmentCreateInput;
};


export type MutationCreateGovernmentsArgs = {
  data: Array<GovernmentCreateInput>;
};


export type MutationCreateInitialUserArgs = {
  data: CreateInitialUserInput;
};


export type MutationCreateMeetingArgs = {
  data: MeetingCreateInput;
};


export type MutationCreateMeetingsArgs = {
  data: Array<MeetingCreateInput>;
};


export type MutationCreatePartiesArgs = {
  data: Array<PartyCreateInput>;
};


export type MutationCreatePartyArgs = {
  data: PartyCreateInput;
};


export type MutationCreatePeopleArgs = {
  data: PeopleCreateInput;
};


export type MutationCreatePeopleListArgs = {
  data: Array<PeopleCreateInput>;
};


export type MutationCreateProposalArgs = {
  data: ProposalCreateInput;
};


export type MutationCreateProposalsArgs = {
  data: Array<ProposalCreateInput>;
};


export type MutationCreateRecognitionImageArgs = {
  data: RecognitionImageCreateInput;
};


export type MutationCreateRecognitionImagesArgs = {
  data: Array<RecognitionImageCreateInput>;
};


export type MutationCreateRecognitionStatusArgs = {
  data: RecognitionStatusCreateInput;
};


export type MutationCreateRecognitionStatusesArgs = {
  data: Array<RecognitionStatusCreateInput>;
};


export type MutationCreateTermArgs = {
  data: TermCreateInput;
};


export type MutationCreateTermsArgs = {
  data: Array<TermCreateInput>;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateUsersArgs = {
  data: Array<UserCreateInput>;
};


export type MutationDeleteBudgetArgs = {
  where: BudgetWhereUniqueInput;
};


export type MutationDeleteBudgetsArgs = {
  where: Array<BudgetWhereUniqueInput>;
};


export type MutationDeleteCommitteeArgs = {
  where: CommitteeWhereUniqueInput;
};


export type MutationDeleteCommitteesArgs = {
  where: Array<CommitteeWhereUniqueInput>;
};


export type MutationDeleteGovernmentArgs = {
  where: GovernmentWhereUniqueInput;
};


export type MutationDeleteGovernmentsArgs = {
  where: Array<GovernmentWhereUniqueInput>;
};


export type MutationDeleteMeetingArgs = {
  where: MeetingWhereUniqueInput;
};


export type MutationDeleteMeetingsArgs = {
  where: Array<MeetingWhereUniqueInput>;
};


export type MutationDeletePartiesArgs = {
  where: Array<PartyWhereUniqueInput>;
};


export type MutationDeletePartyArgs = {
  where: PartyWhereUniqueInput;
};


export type MutationDeletePeopleArgs = {
  where: PeopleWhereUniqueInput;
};


export type MutationDeletePeopleListArgs = {
  where: Array<PeopleWhereUniqueInput>;
};


export type MutationDeleteProposalArgs = {
  where: ProposalWhereUniqueInput;
};


export type MutationDeleteProposalsArgs = {
  where: Array<ProposalWhereUniqueInput>;
};


export type MutationDeleteRecognitionImageArgs = {
  where: RecognitionImageWhereUniqueInput;
};


export type MutationDeleteRecognitionImagesArgs = {
  where: Array<RecognitionImageWhereUniqueInput>;
};


export type MutationDeleteRecognitionStatusArgs = {
  where: RecognitionStatusWhereUniqueInput;
};


export type MutationDeleteRecognitionStatusesArgs = {
  where: Array<RecognitionStatusWhereUniqueInput>;
};


export type MutationDeleteTermArgs = {
  where: TermWhereUniqueInput;
};


export type MutationDeleteTermsArgs = {
  where: Array<TermWhereUniqueInput>;
};


export type MutationDeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationDeleteUsersArgs = {
  where: Array<UserWhereUniqueInput>;
};


export type MutationUpdateBudgetArgs = {
  data: BudgetUpdateInput;
  where: BudgetWhereUniqueInput;
};


export type MutationUpdateBudgetsArgs = {
  data: Array<BudgetUpdateArgs>;
};


export type MutationUpdateCommitteeArgs = {
  data: CommitteeUpdateInput;
  where: CommitteeWhereUniqueInput;
};


export type MutationUpdateCommitteesArgs = {
  data: Array<CommitteeUpdateArgs>;
};


export type MutationUpdateGovernmentArgs = {
  data: GovernmentUpdateInput;
  where: GovernmentWhereUniqueInput;
};


export type MutationUpdateGovernmentsArgs = {
  data: Array<GovernmentUpdateArgs>;
};


export type MutationUpdateMeetingArgs = {
  data: MeetingUpdateInput;
  where: MeetingWhereUniqueInput;
};


export type MutationUpdateMeetingsArgs = {
  data: Array<MeetingUpdateArgs>;
};


export type MutationUpdatePartiesArgs = {
  data: Array<PartyUpdateArgs>;
};


export type MutationUpdatePartyArgs = {
  data: PartyUpdateInput;
  where: PartyWhereUniqueInput;
};


export type MutationUpdatePeopleArgs = {
  data: PeopleUpdateInput;
  where: PeopleWhereUniqueInput;
};


export type MutationUpdatePeopleListArgs = {
  data: Array<PeopleUpdateArgs>;
};


export type MutationUpdateProposalArgs = {
  data: ProposalUpdateInput;
  where: ProposalWhereUniqueInput;
};


export type MutationUpdateProposalsArgs = {
  data: Array<ProposalUpdateArgs>;
};


export type MutationUpdateRecognitionImageArgs = {
  data: RecognitionImageUpdateInput;
  where: RecognitionImageWhereUniqueInput;
};


export type MutationUpdateRecognitionImagesArgs = {
  data: Array<RecognitionImageUpdateArgs>;
};


export type MutationUpdateRecognitionStatusArgs = {
  data: RecognitionStatusUpdateInput;
  where: RecognitionStatusWhereUniqueInput;
};


export type MutationUpdateRecognitionStatusesArgs = {
  data: Array<RecognitionStatusUpdateArgs>;
};


export type MutationUpdateTermArgs = {
  data: TermUpdateInput;
  where: TermWhereUniqueInput;
};


export type MutationUpdateTermsArgs = {
  data: Array<TermUpdateArgs>;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};


export type MutationUpdateUsersArgs = {
  data: Array<UserUpdateArgs>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Party = {
  __typename?: 'Party';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type PartyCreateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PartyOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type PartyRelateToOneForCreateInput = {
  connect?: InputMaybe<PartyWhereUniqueInput>;
  create?: InputMaybe<PartyCreateInput>;
};

export type PartyRelateToOneForUpdateInput = {
  connect?: InputMaybe<PartyWhereUniqueInput>;
  create?: InputMaybe<PartyCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PartyUpdateArgs = {
  data: PartyUpdateInput;
  where: PartyWhereUniqueInput;
};

export type PartyUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PartyWhereInput = {
  AND?: InputMaybe<Array<PartyWhereInput>>;
  NOT?: InputMaybe<Array<PartyWhereInput>>;
  OR?: InputMaybe<Array<PartyWhereInput>>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
};

export type PartyWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PasswordState = {
  __typename?: 'PasswordState';
  isSet: Scalars['Boolean']['output'];
};

export type People = {
  __typename?: 'People';
  committees?: Maybe<Array<Committee>>;
  committeesCount?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  party?: Maybe<Party>;
  term?: Maybe<Term>;
  type?: Maybe<Scalars['String']['output']>;
};


export type PeopleCommitteesArgs = {
  cursor?: InputMaybe<CommitteeWhereUniqueInput>;
  orderBy?: Array<CommitteeOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: CommitteeWhereInput;
};


export type PeopleCommitteesCountArgs = {
  where?: CommitteeWhereInput;
};

export type PeopleCreateInput = {
  committees?: InputMaybe<CommitteeRelateToManyForCreateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  party?: InputMaybe<PartyRelateToOneForCreateInput>;
  term?: InputMaybe<TermRelateToOneForCreateInput>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type PeopleManyRelationFilter = {
  every?: InputMaybe<PeopleWhereInput>;
  none?: InputMaybe<PeopleWhereInput>;
  some?: InputMaybe<PeopleWhereInput>;
};

export type PeopleOrderByInput = {
  description?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
};

export type PeopleRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PeopleWhereUniqueInput>>;
  create?: InputMaybe<Array<PeopleCreateInput>>;
};

export type PeopleRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PeopleWhereUniqueInput>>;
  create?: InputMaybe<Array<PeopleCreateInput>>;
  disconnect?: InputMaybe<Array<PeopleWhereUniqueInput>>;
  set?: InputMaybe<Array<PeopleWhereUniqueInput>>;
};

export type PeopleUpdateArgs = {
  data: PeopleUpdateInput;
  where: PeopleWhereUniqueInput;
};

export type PeopleUpdateInput = {
  committees?: InputMaybe<CommitteeRelateToManyForUpdateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  party?: InputMaybe<PartyRelateToOneForUpdateInput>;
  term?: InputMaybe<TermRelateToOneForUpdateInput>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type PeopleWhereInput = {
  AND?: InputMaybe<Array<PeopleWhereInput>>;
  NOT?: InputMaybe<Array<PeopleWhereInput>>;
  OR?: InputMaybe<Array<PeopleWhereInput>>;
  committees?: InputMaybe<CommitteeManyRelationFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
  party?: InputMaybe<PartyWhereInput>;
  term?: InputMaybe<TermWhereInput>;
  type?: InputMaybe<StringFilter>;
};

export type PeopleWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Proposal = {
  __typename?: 'Proposal';
  budget?: Maybe<Budget>;
  budgetImageUrl?: Maybe<Scalars['String']['output']>;
  coSigners?: Maybe<Array<People>>;
  coSignersCount?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  freezeAmount?: Maybe<Scalars['Int']['output']>;
  government?: Maybe<Government>;
  historicalProposals?: Maybe<Array<Proposal>>;
  historicalProposalsCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  meetings?: Maybe<Array<Meeting>>;
  meetingsCount?: Maybe<Scalars['Int']['output']>;
  mergedProposals?: Maybe<Array<Proposal>>;
  mergedProposalsCount?: Maybe<Scalars['Int']['output']>;
  proposalTypes?: Maybe<Array<ProposalProposalTypeType>>;
  proposers?: Maybe<Array<People>>;
  proposersCount?: Maybe<Scalars['Int']['output']>;
  publishStatus?: Maybe<Scalars['String']['output']>;
  react_angry?: Maybe<Scalars['Int']['output']>;
  react_disappoint?: Maybe<Scalars['Int']['output']>;
  react_good?: Maybe<Scalars['Int']['output']>;
  react_whatever?: Maybe<Scalars['Int']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  recognitionAnswer?: Maybe<Scalars['String']['output']>;
  reductionAmount?: Maybe<Scalars['Int']['output']>;
  result?: Maybe<Scalars['String']['output']>;
  unfreezeHistory?: Maybe<Array<Meeting>>;
  unfreezeHistoryCount?: Maybe<Scalars['Int']['output']>;
  unfreezeStatus?: Maybe<Scalars['String']['output']>;
};


export type ProposalCoSignersArgs = {
  cursor?: InputMaybe<PeopleWhereUniqueInput>;
  orderBy?: Array<PeopleOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PeopleWhereInput;
};


export type ProposalCoSignersCountArgs = {
  where?: PeopleWhereInput;
};


export type ProposalHistoricalProposalsArgs = {
  cursor?: InputMaybe<ProposalWhereUniqueInput>;
  orderBy?: Array<ProposalOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProposalWhereInput;
};


export type ProposalHistoricalProposalsCountArgs = {
  where?: ProposalWhereInput;
};


export type ProposalMeetingsArgs = {
  cursor?: InputMaybe<MeetingWhereUniqueInput>;
  orderBy?: Array<MeetingOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: MeetingWhereInput;
};


export type ProposalMeetingsCountArgs = {
  where?: MeetingWhereInput;
};


export type ProposalMergedProposalsArgs = {
  cursor?: InputMaybe<ProposalWhereUniqueInput>;
  orderBy?: Array<ProposalOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProposalWhereInput;
};


export type ProposalMergedProposalsCountArgs = {
  where?: ProposalWhereInput;
};


export type ProposalProposersArgs = {
  cursor?: InputMaybe<PeopleWhereUniqueInput>;
  orderBy?: Array<PeopleOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PeopleWhereInput;
};


export type ProposalProposersCountArgs = {
  where?: PeopleWhereInput;
};


export type ProposalUnfreezeHistoryArgs = {
  cursor?: InputMaybe<MeetingWhereUniqueInput>;
  orderBy?: Array<MeetingOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: MeetingWhereInput;
};


export type ProposalUnfreezeHistoryCountArgs = {
  where?: MeetingWhereInput;
};

export type ProposalCreateInput = {
  budget?: InputMaybe<BudgetRelateToOneForCreateInput>;
  budgetImageUrl?: InputMaybe<Scalars['String']['input']>;
  coSigners?: InputMaybe<PeopleRelateToManyForCreateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  freezeAmount?: InputMaybe<Scalars['Int']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForCreateInput>;
  historicalProposals?: InputMaybe<ProposalRelateToManyForCreateInput>;
  meetings?: InputMaybe<MeetingRelateToManyForCreateInput>;
  mergedProposals?: InputMaybe<ProposalRelateToManyForCreateInput>;
  proposalTypes?: InputMaybe<Array<ProposalProposalTypeType>>;
  proposers?: InputMaybe<PeopleRelateToManyForCreateInput>;
  publishStatus?: InputMaybe<Scalars['String']['input']>;
  react_angry?: InputMaybe<Scalars['Int']['input']>;
  react_disappoint?: InputMaybe<Scalars['Int']['input']>;
  react_good?: InputMaybe<Scalars['Int']['input']>;
  react_whatever?: InputMaybe<Scalars['Int']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  recognitionAnswer?: InputMaybe<Scalars['String']['input']>;
  reductionAmount?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  unfreezeHistory?: InputMaybe<MeetingRelateToManyForCreateInput>;
  unfreezeStatus?: InputMaybe<Scalars['String']['input']>;
};

export type ProposalManyRelationFilter = {
  every?: InputMaybe<ProposalWhereInput>;
  none?: InputMaybe<ProposalWhereInput>;
  some?: InputMaybe<ProposalWhereInput>;
};

export type ProposalOrderByInput = {
  budgetImageUrl?: InputMaybe<OrderDirection>;
  description?: InputMaybe<OrderDirection>;
  freezeAmount?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  publishStatus?: InputMaybe<OrderDirection>;
  react_angry?: InputMaybe<OrderDirection>;
  react_disappoint?: InputMaybe<OrderDirection>;
  react_good?: InputMaybe<OrderDirection>;
  react_whatever?: InputMaybe<OrderDirection>;
  reason?: InputMaybe<OrderDirection>;
  recognitionAnswer?: InputMaybe<OrderDirection>;
  reductionAmount?: InputMaybe<OrderDirection>;
  result?: InputMaybe<OrderDirection>;
  unfreezeStatus?: InputMaybe<OrderDirection>;
};

export enum ProposalProposalTypeType {
  Freeze = 'freeze',
  Other = 'other',
  Reduce = 'reduce'
}

export type ProposalRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<ProposalWhereUniqueInput>>;
  create?: InputMaybe<Array<ProposalCreateInput>>;
};

export type ProposalRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<ProposalWhereUniqueInput>>;
  create?: InputMaybe<Array<ProposalCreateInput>>;
  disconnect?: InputMaybe<Array<ProposalWhereUniqueInput>>;
  set?: InputMaybe<Array<ProposalWhereUniqueInput>>;
};

export type ProposalUpdateArgs = {
  data: ProposalUpdateInput;
  where: ProposalWhereUniqueInput;
};

export type ProposalUpdateInput = {
  budget?: InputMaybe<BudgetRelateToOneForUpdateInput>;
  budgetImageUrl?: InputMaybe<Scalars['String']['input']>;
  coSigners?: InputMaybe<PeopleRelateToManyForUpdateInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  freezeAmount?: InputMaybe<Scalars['Int']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForUpdateInput>;
  historicalProposals?: InputMaybe<ProposalRelateToManyForUpdateInput>;
  meetings?: InputMaybe<MeetingRelateToManyForUpdateInput>;
  mergedProposals?: InputMaybe<ProposalRelateToManyForUpdateInput>;
  proposalTypes?: InputMaybe<Array<ProposalProposalTypeType>>;
  proposers?: InputMaybe<PeopleRelateToManyForUpdateInput>;
  publishStatus?: InputMaybe<Scalars['String']['input']>;
  react_angry?: InputMaybe<Scalars['Int']['input']>;
  react_disappoint?: InputMaybe<Scalars['Int']['input']>;
  react_good?: InputMaybe<Scalars['Int']['input']>;
  react_whatever?: InputMaybe<Scalars['Int']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  recognitionAnswer?: InputMaybe<Scalars['String']['input']>;
  reductionAmount?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  unfreezeHistory?: InputMaybe<MeetingRelateToManyForUpdateInput>;
  unfreezeStatus?: InputMaybe<Scalars['String']['input']>;
};

export type ProposalWhereInput = {
  AND?: InputMaybe<Array<ProposalWhereInput>>;
  NOT?: InputMaybe<Array<ProposalWhereInput>>;
  OR?: InputMaybe<Array<ProposalWhereInput>>;
  budget?: InputMaybe<BudgetWhereInput>;
  budgetImageUrl?: InputMaybe<StringNullableFilter>;
  coSigners?: InputMaybe<PeopleManyRelationFilter>;
  description?: InputMaybe<StringNullableFilter>;
  freezeAmount?: InputMaybe<IntNullableFilter>;
  government?: InputMaybe<GovernmentWhereInput>;
  historicalProposals?: InputMaybe<ProposalManyRelationFilter>;
  id?: InputMaybe<IdFilter>;
  meetings?: InputMaybe<MeetingManyRelationFilter>;
  mergedProposals?: InputMaybe<ProposalManyRelationFilter>;
  proposers?: InputMaybe<PeopleManyRelationFilter>;
  publishStatus?: InputMaybe<StringNullableFilter>;
  react_angry?: InputMaybe<IntNullableFilter>;
  react_disappoint?: InputMaybe<IntNullableFilter>;
  react_good?: InputMaybe<IntNullableFilter>;
  react_whatever?: InputMaybe<IntNullableFilter>;
  reason?: InputMaybe<StringNullableFilter>;
  recognitionAnswer?: InputMaybe<StringNullableFilter>;
  reductionAmount?: InputMaybe<IntNullableFilter>;
  result?: InputMaybe<StringNullableFilter>;
  unfreezeHistory?: InputMaybe<MeetingManyRelationFilter>;
  unfreezeStatus?: InputMaybe<StringNullableFilter>;
};

export type ProposalWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Query = {
  __typename?: 'Query';
  authenticatedItem?: Maybe<AuthenticatedItem>;
  budget?: Maybe<Budget>;
  budgets?: Maybe<Array<Budget>>;
  budgetsCount?: Maybe<Scalars['Int']['output']>;
  committee?: Maybe<Committee>;
  committees?: Maybe<Array<Committee>>;
  committeesCount?: Maybe<Scalars['Int']['output']>;
  government?: Maybe<Government>;
  governments?: Maybe<Array<Government>>;
  governmentsCount?: Maybe<Scalars['Int']['output']>;
  keystone: KeystoneMeta;
  meeting?: Maybe<Meeting>;
  meetings?: Maybe<Array<Meeting>>;
  meetingsCount?: Maybe<Scalars['Int']['output']>;
  parties?: Maybe<Array<Party>>;
  partiesCount?: Maybe<Scalars['Int']['output']>;
  party?: Maybe<Party>;
  people?: Maybe<People>;
  peopleList?: Maybe<Array<People>>;
  peopleListCount?: Maybe<Scalars['Int']['output']>;
  proposal?: Maybe<Proposal>;
  proposals?: Maybe<Array<Proposal>>;
  proposalsCount?: Maybe<Scalars['Int']['output']>;
  recognitionImage?: Maybe<RecognitionImage>;
  recognitionImages?: Maybe<Array<RecognitionImage>>;
  recognitionImagesCount?: Maybe<Scalars['Int']['output']>;
  recognitionStatus?: Maybe<RecognitionStatus>;
  recognitionStatuses?: Maybe<Array<RecognitionStatus>>;
  recognitionStatusesCount?: Maybe<Scalars['Int']['output']>;
  term?: Maybe<Term>;
  terms?: Maybe<Array<Term>>;
  termsCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  usersCount?: Maybe<Scalars['Int']['output']>;
};


export type QueryBudgetArgs = {
  where: BudgetWhereUniqueInput;
};


export type QueryBudgetsArgs = {
  cursor?: InputMaybe<BudgetWhereUniqueInput>;
  orderBy?: Array<BudgetOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: BudgetWhereInput;
};


export type QueryBudgetsCountArgs = {
  where?: BudgetWhereInput;
};


export type QueryCommitteeArgs = {
  where: CommitteeWhereUniqueInput;
};


export type QueryCommitteesArgs = {
  cursor?: InputMaybe<CommitteeWhereUniqueInput>;
  orderBy?: Array<CommitteeOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: CommitteeWhereInput;
};


export type QueryCommitteesCountArgs = {
  where?: CommitteeWhereInput;
};


export type QueryGovernmentArgs = {
  where: GovernmentWhereUniqueInput;
};


export type QueryGovernmentsArgs = {
  cursor?: InputMaybe<GovernmentWhereUniqueInput>;
  orderBy?: Array<GovernmentOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: GovernmentWhereInput;
};


export type QueryGovernmentsCountArgs = {
  where?: GovernmentWhereInput;
};


export type QueryMeetingArgs = {
  where: MeetingWhereUniqueInput;
};


export type QueryMeetingsArgs = {
  cursor?: InputMaybe<MeetingWhereUniqueInput>;
  orderBy?: Array<MeetingOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: MeetingWhereInput;
};


export type QueryMeetingsCountArgs = {
  where?: MeetingWhereInput;
};


export type QueryPartiesArgs = {
  cursor?: InputMaybe<PartyWhereUniqueInput>;
  orderBy?: Array<PartyOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PartyWhereInput;
};


export type QueryPartiesCountArgs = {
  where?: PartyWhereInput;
};


export type QueryPartyArgs = {
  where: PartyWhereUniqueInput;
};


export type QueryPeopleArgs = {
  where: PeopleWhereUniqueInput;
};


export type QueryPeopleListArgs = {
  cursor?: InputMaybe<PeopleWhereUniqueInput>;
  orderBy?: Array<PeopleOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PeopleWhereInput;
};


export type QueryPeopleListCountArgs = {
  where?: PeopleWhereInput;
};


export type QueryProposalArgs = {
  where: ProposalWhereUniqueInput;
};


export type QueryProposalsArgs = {
  cursor?: InputMaybe<ProposalWhereUniqueInput>;
  orderBy?: Array<ProposalOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProposalWhereInput;
};


export type QueryProposalsCountArgs = {
  where?: ProposalWhereInput;
};


export type QueryRecognitionImageArgs = {
  where: RecognitionImageWhereUniqueInput;
};


export type QueryRecognitionImagesArgs = {
  cursor?: InputMaybe<RecognitionImageWhereUniqueInput>;
  orderBy?: Array<RecognitionImageOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: RecognitionImageWhereInput;
};


export type QueryRecognitionImagesCountArgs = {
  where?: RecognitionImageWhereInput;
};


export type QueryRecognitionStatusArgs = {
  where: RecognitionStatusWhereUniqueInput;
};


export type QueryRecognitionStatusesArgs = {
  cursor?: InputMaybe<RecognitionStatusWhereUniqueInput>;
  orderBy?: Array<RecognitionStatusOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: RecognitionStatusWhereInput;
};


export type QueryRecognitionStatusesCountArgs = {
  where?: RecognitionStatusWhereInput;
};


export type QueryTermArgs = {
  where: TermWhereUniqueInput;
};


export type QueryTermsArgs = {
  cursor?: InputMaybe<TermWhereUniqueInput>;
  orderBy?: Array<TermOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: TermWhereInput;
};


export type QueryTermsCountArgs = {
  where?: TermWhereInput;
};


export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryUsersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  orderBy?: Array<UserOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: UserWhereInput;
};


export type QueryUsersCountArgs = {
  where?: UserWhereInput;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type RecognitionImage = {
  __typename?: 'RecognitionImage';
  description?: Maybe<Scalars['String']['output']>;
  government?: Maybe<Government>;
  historicalProposals?: Maybe<Array<Proposal>>;
  historicalProposalsCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  meeting?: Maybe<Meeting>;
  mergedProposals?: Maybe<Array<Proposal>>;
  mergedProposalsCount?: Maybe<Scalars['Int']['output']>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  result?: Maybe<Scalars['String']['output']>;
  verificationStatus?: Maybe<Scalars['String']['output']>;
};


export type RecognitionImageHistoricalProposalsArgs = {
  cursor?: InputMaybe<ProposalWhereUniqueInput>;
  orderBy?: Array<ProposalOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProposalWhereInput;
};


export type RecognitionImageHistoricalProposalsCountArgs = {
  where?: ProposalWhereInput;
};


export type RecognitionImageMergedProposalsArgs = {
  cursor?: InputMaybe<ProposalWhereUniqueInput>;
  orderBy?: Array<ProposalOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProposalWhereInput;
};


export type RecognitionImageMergedProposalsCountArgs = {
  where?: ProposalWhereInput;
};

export type RecognitionImageCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForCreateInput>;
  historicalProposals?: InputMaybe<ProposalRelateToManyForCreateInput>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  meeting?: InputMaybe<MeetingRelateToOneForCreateInput>;
  mergedProposals?: InputMaybe<ProposalRelateToManyForCreateInput>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  verificationStatus?: InputMaybe<Scalars['String']['input']>;
};

export type RecognitionImageOrderByInput = {
  description?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  imageUrl?: InputMaybe<OrderDirection>;
  pageNumber?: InputMaybe<OrderDirection>;
  result?: InputMaybe<OrderDirection>;
  verificationStatus?: InputMaybe<OrderDirection>;
};

export type RecognitionImageRelateToOneForCreateInput = {
  connect?: InputMaybe<RecognitionImageWhereUniqueInput>;
  create?: InputMaybe<RecognitionImageCreateInput>;
};

export type RecognitionImageRelateToOneForUpdateInput = {
  connect?: InputMaybe<RecognitionImageWhereUniqueInput>;
  create?: InputMaybe<RecognitionImageCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RecognitionImageUpdateArgs = {
  data: RecognitionImageUpdateInput;
  where: RecognitionImageWhereUniqueInput;
};

export type RecognitionImageUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  government?: InputMaybe<GovernmentRelateToOneForUpdateInput>;
  historicalProposals?: InputMaybe<ProposalRelateToManyForUpdateInput>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  meeting?: InputMaybe<MeetingRelateToOneForUpdateInput>;
  mergedProposals?: InputMaybe<ProposalRelateToManyForUpdateInput>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  verificationStatus?: InputMaybe<Scalars['String']['input']>;
};

export type RecognitionImageWhereInput = {
  AND?: InputMaybe<Array<RecognitionImageWhereInput>>;
  NOT?: InputMaybe<Array<RecognitionImageWhereInput>>;
  OR?: InputMaybe<Array<RecognitionImageWhereInput>>;
  description?: InputMaybe<StringNullableFilter>;
  government?: InputMaybe<GovernmentWhereInput>;
  historicalProposals?: InputMaybe<ProposalManyRelationFilter>;
  id?: InputMaybe<IdFilter>;
  imageUrl?: InputMaybe<StringFilter>;
  meeting?: InputMaybe<MeetingWhereInput>;
  mergedProposals?: InputMaybe<ProposalManyRelationFilter>;
  pageNumber?: InputMaybe<IntNullableFilter>;
  result?: InputMaybe<StringNullableFilter>;
  verificationStatus?: InputMaybe<StringNullableFilter>;
};

export type RecognitionImageWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type RecognitionStatus = {
  __typename?: 'RecognitionStatus';
  budgetAmountResult?: Maybe<Scalars['String']['output']>;
  budgetCategoryResult?: Maybe<Scalars['String']['output']>;
  budgetTypeResult?: Maybe<Scalars['String']['output']>;
  coSigners?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  freezeAmountResult?: Maybe<Scalars['String']['output']>;
  governmentBudgetResult?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<RecognitionImage>;
  lineuserid?: Maybe<Scalars['String']['output']>;
  proposers?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  reductionAmountResult?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type RecognitionStatusCreateInput = {
  budgetAmountResult?: InputMaybe<Scalars['String']['input']>;
  budgetCategoryResult?: InputMaybe<Scalars['String']['input']>;
  budgetTypeResult?: InputMaybe<Scalars['String']['input']>;
  coSigners?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  freezeAmountResult?: InputMaybe<Scalars['String']['input']>;
  governmentBudgetResult?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<RecognitionImageRelateToOneForCreateInput>;
  lineuserid?: InputMaybe<Scalars['String']['input']>;
  proposers?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reductionAmountResult?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type RecognitionStatusOrderByInput = {
  budgetAmountResult?: InputMaybe<OrderDirection>;
  budgetCategoryResult?: InputMaybe<OrderDirection>;
  budgetTypeResult?: InputMaybe<OrderDirection>;
  coSigners?: InputMaybe<OrderDirection>;
  description?: InputMaybe<OrderDirection>;
  freezeAmountResult?: InputMaybe<OrderDirection>;
  governmentBudgetResult?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  lineuserid?: InputMaybe<OrderDirection>;
  proposers?: InputMaybe<OrderDirection>;
  reason?: InputMaybe<OrderDirection>;
  reductionAmountResult?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
};

export type RecognitionStatusUpdateArgs = {
  data: RecognitionStatusUpdateInput;
  where: RecognitionStatusWhereUniqueInput;
};

export type RecognitionStatusUpdateInput = {
  budgetAmountResult?: InputMaybe<Scalars['String']['input']>;
  budgetCategoryResult?: InputMaybe<Scalars['String']['input']>;
  budgetTypeResult?: InputMaybe<Scalars['String']['input']>;
  coSigners?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  freezeAmountResult?: InputMaybe<Scalars['String']['input']>;
  governmentBudgetResult?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<RecognitionImageRelateToOneForUpdateInput>;
  lineuserid?: InputMaybe<Scalars['String']['input']>;
  proposers?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reductionAmountResult?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type RecognitionStatusWhereInput = {
  AND?: InputMaybe<Array<RecognitionStatusWhereInput>>;
  NOT?: InputMaybe<Array<RecognitionStatusWhereInput>>;
  OR?: InputMaybe<Array<RecognitionStatusWhereInput>>;
  budgetAmountResult?: InputMaybe<StringNullableFilter>;
  budgetCategoryResult?: InputMaybe<StringNullableFilter>;
  budgetTypeResult?: InputMaybe<StringNullableFilter>;
  coSigners?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  freezeAmountResult?: InputMaybe<StringNullableFilter>;
  governmentBudgetResult?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IdFilter>;
  image?: InputMaybe<RecognitionImageWhereInput>;
  lineuserid?: InputMaybe<StringNullableFilter>;
  proposers?: InputMaybe<StringNullableFilter>;
  reason?: InputMaybe<StringNullableFilter>;
  reductionAmountResult?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringFilter>;
};

export type RecognitionStatusWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Term = {
  __typename?: 'Term';
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  termNumber?: Maybe<Scalars['Int']['output']>;
};

export type TermCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  termNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type TermOrderByInput = {
  description?: InputMaybe<OrderDirection>;
  endDate?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  startDate?: InputMaybe<OrderDirection>;
  termNumber?: InputMaybe<OrderDirection>;
};

export type TermRelateToOneForCreateInput = {
  connect?: InputMaybe<TermWhereUniqueInput>;
  create?: InputMaybe<TermCreateInput>;
};

export type TermRelateToOneForUpdateInput = {
  connect?: InputMaybe<TermWhereUniqueInput>;
  create?: InputMaybe<TermCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TermUpdateArgs = {
  data: TermUpdateInput;
  where: TermWhereUniqueInput;
};

export type TermUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  termNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type TermWhereInput = {
  AND?: InputMaybe<Array<TermWhereInput>>;
  NOT?: InputMaybe<Array<TermWhereInput>>;
  OR?: InputMaybe<Array<TermWhereInput>>;
  description?: InputMaybe<StringNullableFilter>;
  endDate?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<IdFilter>;
  startDate?: InputMaybe<DateTimeFilter>;
  termNumber?: InputMaybe<IntFilter>;
};

export type TermWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  termNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<PasswordState>;
  role?: Maybe<Scalars['String']['output']>;
};

export type UserAuthenticationWithPasswordFailure = {
  __typename?: 'UserAuthenticationWithPasswordFailure';
  message: Scalars['String']['output'];
};

export type UserAuthenticationWithPasswordResult = UserAuthenticationWithPasswordFailure | UserAuthenticationWithPasswordSuccess;

export type UserAuthenticationWithPasswordSuccess = {
  __typename?: 'UserAuthenticationWithPasswordSuccess';
  item: User;
  sessionToken: Scalars['String']['output'];
};

export type UserCreateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  isProtected?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type UserOrderByInput = {
  email?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  isProtected?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  role?: InputMaybe<OrderDirection>;
};

export type UserUpdateArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  isProtected?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  isProtected?: InputMaybe<BooleanFilter>;
  name?: InputMaybe<StringFilter>;
  role?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type GetBudgetsWithGovernmentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBudgetsWithGovernmentQuery = { __typename?: 'Query', budgetsCount?: number | null, budgets?: Array<{ __typename?: 'Budget', id: string, type?: string | null, year?: number | null, projectName?: string | null, projectDescription?: string | null, budgetAmount?: number | null, majorCategory?: string | null, mediumCategory?: string | null, minorCategory?: string | null, description?: string | null, government?: { __typename?: 'Government', id: string, name?: string | null, category?: string | null } | null }> | null };

export type GetGovernmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGovernmentsQuery = { __typename?: 'Query', governments?: Array<{ __typename?: 'Government', id: string, name?: string | null, category?: string | null, description?: string | null }> | null };

export type GetPeopleListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPeopleListQuery = { __typename?: 'Query', peopleList?: Array<{ __typename?: 'People', id: string, name?: string | null, type?: string | null, description?: string | null, party?: { __typename?: 'Party', id: string, name?: string | null } | null }> | null };

export type GetProposalsOrderedByIdDescQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProposalsOrderedByIdDescQuery = { __typename?: 'Query', proposalsCount?: number | null, proposals?: Array<{ __typename?: 'Proposal', id: string, description?: string | null, reason?: string | null, publishStatus?: string | null, result?: string | null, freezeAmount?: number | null, reductionAmount?: number | null, budgetImageUrl?: string | null, proposalTypes?: Array<ProposalProposalTypeType> | null, recognitionAnswer?: string | null, unfreezeStatus?: string | null, government?: { __typename?: 'Government', id: string, name?: string | null, category?: string | null, description?: string | null } | null, budget?: { __typename?: 'Budget', id: string, projectName?: string | null, budgetAmount?: number | null, year?: number | null, type?: string | null, majorCategory?: string | null, mediumCategory?: string | null, minorCategory?: string | null } | null, proposers?: Array<{ __typename?: 'People', id: string, name?: string | null, type?: string | null, description?: string | null }> | null, coSigners?: Array<{ __typename?: 'People', id: string, name?: string | null, type?: string | null }> | null }> | null };

export type GetProposalByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProposalByIdQuery = { __typename?: 'Query', proposal?: { __typename?: 'Proposal', id: string, description?: string | null, reason?: string | null, publishStatus?: string | null, result?: string | null, freezeAmount?: number | null, reductionAmount?: number | null, budgetImageUrl?: string | null, proposalTypes?: Array<ProposalProposalTypeType> | null, recognitionAnswer?: string | null, unfreezeStatus?: string | null, government?: { __typename?: 'Government', id: string, name?: string | null, category?: string | null, description?: string | null } | null, budget?: { __typename?: 'Budget', id: string, projectName?: string | null, projectDescription?: string | null, budgetAmount?: number | null, budgetUrl?: string | null, lastYearSettlement?: number | null, year?: number | null, type?: string | null, majorCategory?: string | null, mediumCategory?: string | null, minorCategory?: string | null, description?: string | null } | null, proposers?: Array<{ __typename?: 'People', id: string, name?: string | null, type?: string | null, description?: string | null }> | null, coSigners?: Array<{ __typename?: 'People', id: string, name?: string | null, type?: string | null }> | null, meetings?: Array<{ __typename?: 'Meeting', id: string, displayName?: string | null, meetingDate?: any | null, description?: string | null, location?: string | null, meetingRecordUrl?: string | null, type?: string | null }> | null, mergedProposals?: Array<{ __typename?: 'Proposal', id: string, proposers?: Array<{ __typename?: 'People', id: string, name?: string | null }> | null }> | null, historicalProposals?: Array<{ __typename?: 'Proposal', id: string, proposers?: Array<{ __typename?: 'People', id: string, name?: string | null }> | null }> | null } | null };

export type GetPaginatedProposalsQueryVariables = Exact<{
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  orderBy: Array<ProposalOrderByInput> | ProposalOrderByInput;
  where: ProposalWhereInput;
}>;


export type GetPaginatedProposalsQuery = { __typename?: 'Query', proposalsCount?: number | null, proposals?: Array<{ __typename?: 'Proposal', id: string, description?: string | null, reason?: string | null, publishStatus?: string | null, result?: string | null, freezeAmount?: number | null, reductionAmount?: number | null, budgetImageUrl?: string | null, proposalTypes?: Array<ProposalProposalTypeType> | null, recognitionAnswer?: string | null, unfreezeStatus?: string | null, government?: { __typename?: 'Government', id: string, name?: string | null, category?: string | null, description?: string | null } | null, budget?: { __typename?: 'Budget', id: string, projectName?: string | null, budgetAmount?: number | null, year?: number | null, type?: string | null, majorCategory?: string | null, mediumCategory?: string | null, minorCategory?: string | null } | null, proposers?: Array<{ __typename?: 'People', id: string, name?: string | null, type?: string | null, description?: string | null, party?: { __typename?: 'Party', name?: string | null } | null }> | null, coSigners?: Array<{ __typename?: 'People', id: string, name?: string | null, type?: string | null }> | null }> | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetBudgetsWithGovernmentDocument = new TypedDocumentString(`
    query GetBudgetsWithGovernment {
  budgets {
    id
    type
    year
    projectName
    projectDescription
    budgetAmount
    majorCategory
    mediumCategory
    minorCategory
    description
    government {
      id
      name
      category
    }
  }
  budgetsCount
}
    `) as unknown as TypedDocumentString<GetBudgetsWithGovernmentQuery, GetBudgetsWithGovernmentQueryVariables>;
export const GetGovernmentsDocument = new TypedDocumentString(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `) as unknown as TypedDocumentString<GetGovernmentsQuery, GetGovernmentsQueryVariables>;
export const GetPeopleListDocument = new TypedDocumentString(`
    query GetPeopleList {
  peopleList(orderBy: [{name: asc}]) {
    id
    name
    type
    description
    party {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<GetPeopleListQuery, GetPeopleListQueryVariables>;
export const GetProposalsOrderedByIdDescDocument = new TypedDocumentString(`
    query GetProposalsOrderedByIdDesc {
  proposals(orderBy: [{id: desc}]) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      budgetAmount
      year
      type
      majorCategory
      mediumCategory
      minorCategory
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
  }
  proposalsCount
}
    `) as unknown as TypedDocumentString<GetProposalsOrderedByIdDescQuery, GetProposalsOrderedByIdDescQueryVariables>;
export const GetProposalByIdDocument = new TypedDocumentString(`
    query GetProposalById($id: ID!) {
  proposal(where: {id: $id}) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      projectDescription
      budgetAmount
      budgetUrl
      lastYearSettlement
      year
      type
      majorCategory
      mediumCategory
      minorCategory
      description
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
    meetings(orderBy: [{meetingDate: desc}]) {
      id
      displayName
      meetingDate
      description
      location
      meetingRecordUrl
      type
    }
    mergedProposals {
      id
      proposers {
        id
        name
      }
    }
    historicalProposals {
      id
      proposers {
        id
        name
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetProposalByIdQuery, GetProposalByIdQueryVariables>;
export const GetPaginatedProposalsDocument = new TypedDocumentString(`
    query GetPaginatedProposals($skip: Int!, $take: Int!, $orderBy: [ProposalOrderByInput!]!, $where: ProposalWhereInput!) {
  proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      budgetAmount
      year
      type
      majorCategory
      mediumCategory
      minorCategory
    }
    proposers {
      id
      name
      type
      description
      party {
        name
      }
    }
    coSigners {
      id
      name
      type
    }
  }
  proposalsCount(where: $where)
}
    `) as unknown as TypedDocumentString<GetPaginatedProposalsQuery, GetPaginatedProposalsQueryVariables>;