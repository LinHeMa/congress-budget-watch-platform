# 排序方法優化 PRP

## 概要

本 PRP 旨在優化 `/all-budgets` 頁面的排序功能，將排序選項精簡為僅保留「編號升序」和「編號降序」兩種選項，並確保與現有分頁和 GraphQL 查詢機制無縫整合。

## 背景

目前的 `SortToolbar` 元件提供多種排序選項，包括提案描述、凍結金額和提案時間（ID）等。根據新需求，我們需要簡化排序選項，僅保留編號的升序和降序排序，同時確保不破壞現有的分頁和 GraphQL 查詢邏輯。

## 目標

1. 修改 `SortToolbar` 元件，僅保留編號升序和降序兩種排序選項
2. 確保排序功能與現有的分頁機制正確整合
3. 確保 GraphQL 查詢參數正確傳遞排序條件
4. 維持現有代碼結構和風格，不破壞現有邏輯

## 非目標

1. 重構整個排序或分頁系統
2. 修改 GraphQL schema 或後端 API
3. 更改排序邏輯的基本工作流程

## 實作細節

### 1. 修改 `SortToolbar` 元件中的排序選項

目前的 `sortOptions` 數組包含多種排序選項。我們需要修改這個數組，僅保留 ID（編號）的升序和降序選項。

```tsx
// 當前的 sortOptions
export const sortOptions = [
  {
    value: "description-asc",
    label: "提案描述 (A-Z)",
    field: "description",
    direction: "asc",
  },
  // ... 其他選項
  {
    value: "id-desc",
    label: "提案時間 (新到舊)",
    field: "id",
    direction: "desc",
  },
  {
    value: "id-asc",
    label: "提案時間 (舊到新)",
    field: "id",
    direction: "asc",
  },
] as const;

// 修改後的 sortOptions
export const sortOptions = [
  {
    value: "id-asc",
    label: "編號 (升序)",
    field: "id",
    direction: "asc",
  },
  {
    value: "id-desc",
    label: "編號 (降序)",
    field: "id",
    direction: "desc",
  },
] as const;
```

### 2. 更新 `budget-selector.tsx` 中的預設排序選項

在 `budget-selector.tsx` 中，預設的排序選項是 `"projectName-asc"`，我們需要將其更新為 `"id-asc"` 或 `"id-desc"`。

```tsx
const DEFAULT_PROPS: BudgetSelectProps = {
  selectedValue: "all",
  searchedValue: "",
  visible: true,
  selectedSort: "id-asc", // 更新預設排序選項
};
```

### 3. 確保 GraphQL 查詢參數正確傳遞

在 `all-budgets/index.tsx` 中，需要確保 `orderBy` 參數正確計算並傳遞到 GraphQL 查詢中。由於我們只保留了 ID 的排序選項，這部分邏輯可以保持不變，但我們需要確保它能正確處理簡化後的選項。

```tsx
// 計算 GraphQL 參數
const orderBy = useMemo((): ProposalOrderByInput[] => {
  // 將 sortOptions 的 value 轉換為 GraphQL orderBy 格式
  const sortOption = sortOptions.find((o) => o.value === selectedSort);
  if (!sortOption) return [{ id: OrderDirection.Asc }]; // 預設為 ID 升序

  return [
    {
      [sortOption.field]: sortOption.direction,
    },
  ];
}, [selectedSort]);
```

## 實作計劃

1. 修改 `app/components/sort-toolbar.tsx`，簡化排序選項
2. 更新 `app/stores/budget-selector.tsx` 中的預設排序選項
3. 確認 `app/all-budgets/index.tsx` 中的 GraphQL 查詢參數計算邏輯能正確處理簡化後的選項
4. 測試排序功能與分頁的整合

## 驗證方法

1. 確認 `SortToolbar` 只顯示編號升序和降序兩個選項
2. 確認選擇不同排序選項時，GraphQL 查詢參數正確更新
3. 確認排序變更時，分頁重置到第一頁
4. 確認排序結果符合預期

## 影響範圍

- `app/components/sort-toolbar.tsx`
- `app/stores/budget-selector.tsx`
- `app/all-budgets/index.tsx`（可能需要小幅調整）

## 替代方案

1. **保留所有排序選項但只顯示部分**：我們可以保留所有現有的排序選項，但在 UI 中只顯示編號的升序和降序選項。這樣可以減少代碼變更，但會保留未使用的代碼。

2. **完全重構排序邏輯**：我們可以重新設計排序系統，使其更簡潔和模塊化。但這超出了當前需求的範圍，且可能引入不必要的風險。

## 風險與緩解措施

| 風險 | 可能性 | 影響 | 緩解措施 |
|------|--------|------|----------|
| 排序邏輯與分頁整合出錯 | 低 | 中 | 確保排序變更時重置分頁，並全面測試 |
| GraphQL 查詢參數計算錯誤 | 低 | 高 | 確保 `orderBy` 計算邏輯正確處理簡化後的選項 |
| 預設排序選項不適用 | 低 | 低 | 確認新的預設排序選項能正確應用並顯示 |

## 實作任務清單

1. 修改 `app/components/sort-toolbar.tsx` 中的 `sortOptions` 數組
2. 更新 `app/stores/budget-selector.tsx` 中的 `DEFAULT_PROPS.selectedSort`
3. 檢查並確認 `app/all-budgets/index.tsx` 中的 `orderBy` 計算邏輯
4. 確認排序變更時分頁重置邏輯正常工作

## 參考資料

- [React Select 文檔](https://react-select.com/home)
- [Zustand 狀態管理最佳實踐](https://tkdodo.eu/blog/working-with-zustand)
- [GraphQL 排序參數](https://www.apollographql.com/docs/react/data/queries/#sorting)

## 自我評估

本 PRP 提供了一個清晰的實作計劃，專注於滿足特定需求而不引入不必要的變更。實作步驟簡單明確，風險較低，且不會破壞現有功能。

信心評分：9/10（一次性實作成功的可能性）
