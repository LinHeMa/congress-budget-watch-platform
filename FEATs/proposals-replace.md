## Feats

1. 原本資料使用

```
  const { data, isLoading, isError } = useQuery({
    queryKey: budgetQueryKeys.lists(),
    queryFn: () => execute(GET_BUDGETS_QUERY),
  });
```

改成使用

```
const {
    data: proposals,
    isLoading: isProposalsLoading,
    isError: isProposalsError,
  } = useQuery({
    queryKey: proposalQueryKeys.lists(),
    queryFn: () => execute(GET_PROPOSALS_QUERY),
  });
```

2. 根據相關的欄位、語境去做帶入
3. 以上做完之後，實作AllBudgets的skeleton

## Reminders
1. 不要破壞現有的邏輯
2. 不要破壞現有的排版