import{p as l}from"./chunk-OIYGIGL5-DIb7gZ_H.js";import{t}from"./gql-DSg_pHIo.js";const u="/project/3/dev-congress-budget-watch/".replace(/\/$/,""),m=u,g=500,P=({src:e,...o})=>l.jsx("img",{src:m+e,...o});t(`
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
`);const _=t(`
  query GetGovernments {
    governments {
      id
      name
      category
      description
    }
  }
`),a={all:["governments"],lists:()=>[...a.all,"list"],list:e=>[...a.lists(),{filters:e}]},A=t(`
  query GetPeopleList {
    peopleList(orderBy: [{ name: asc }]) {
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
`),s={all:["people"],lists:()=>[...s.all,"list"],list:e=>[...s.lists(),{filters:e}]};t(`
  query GetProposalsOrderedByIdDesc {
    proposals(orderBy: [{ id: desc }]) {
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
`);const E=t(`
  query GetProposalById($id: ID!) {
    proposal(where: { id: $id }) {
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
      react_angry
      react_disappoint
      react_good
      react_whatever
      budgetImageUrl
      historicalProposals {
        id
        meetings {
          id
        }
      }
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
      meetings(orderBy: [{ meetingDate: desc }]) {
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
`),h=t(`
  query GetProposalYears {
    budgetYears(orderBy: [{ year: desc }]) {
      id
      year
    }
  }
`),r={all:["proposals"],lists:()=>[...r.all,"list"],list:e=>[...r.lists(),{filters:e}],paginated:(e,o,n,p,d)=>[...r.lists(),"paginated",{page:e,pageSize:o,sortBy:n,where:p,year:d}],details:()=>[...r.all,"detail"],detail:e=>[...r.details(),e],years:()=>[...r.all,"years"]},I=t(`
  query GetPaginatedProposals(
    $skip: Int!
    $take: Int!
    $orderBy: [ProposalOrderByInput!]!
    $where: ProposalWhereInput!
  ) {
    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
      id
      description
      year {
        id
        year
      }
      meetings {
        id
        type
        committee {
          endDate
          startDate
        }
      }
      reason
      result
      freezeAmount
      reductionAmount
      proposalTypes
      react_angry
      react_disappoint
      react_good
      react_whatever
      government {
        id
        name
      }
      budget {
        id
        budgetAmount
      }
      proposers {
        id
        name
      }
    }
    proposalsCount(where: $where)
  }
`),S=t(`
  mutation UPDATE_PROPOSAL_REACTS(
    $where: ProposalWhereUniqueInput!
    $data: ProposalUpdateInput!
  ) {
    updateProposal(where: $where, data: $data) {
      id
      react_angry
      react_disappoint
      react_good
      react_whatever
    }
  }
`),$=t(`
  query GetLatestBudgetYear($skip: Int!, $take: Int!) {
    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {
      year
      budgetProgress
      dataProgress
    }
  }
`),i={all:["budgetYear"],list:(e=0,o=1)=>[...i.all,"list",{skip:e,take:o}],latest:()=>[...i.all,"latest"]},T=t(`
  query GetVisualizationProposals(
    $skip: Int!
    $take: Int!
    $orderBy: [ProposalOrderByInput!]!
    $where: ProposalWhereInput!
  ) {
    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
      ...VisualizationProposalWithContext
    }
  }

  fragment VisualizationProposalWithContext on Proposal {
    ...VisualizationProposalBase
    government {
      name
      category
    }
    year {
      year
    }
  }

  fragment VisualizationProposalBase on Proposal {
    id
    freezeAmount
    reductionAmount
    proposalTypes
    proposers {
      id
      name
      party {
        name
        color
      }
    }
  }
`);export{$ as G,P as I,m as S,S as U,g as a,i as b,h as c,I as d,T as e,E as f,a as g,_ as h,s as i,A as j,r as p};
