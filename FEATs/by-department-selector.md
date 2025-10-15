## Feats

1. 透過GQL fetch 目前已經存在的department清單
   example

```gql
query DepartmentQuery {
  governments {
    id
    name
    description
    category
  }
}
```

2. 搭配使用 react-query and zustand
3. 第一個select 用 governments.category; 第二個select 用 governments.name
4. 兩個select都選擇完之後在去filter `all-budgets`的資料，filter 部會的欄位。
5. 篩選完之後要保持排序，排序功能請參考`app/components/sort-toolbar.tsx`

## Reminders

1. 不用run pnpm dev
2. 不要破壞現有的邏輯
3. 不要破壞現有的排版
