# PRP: 數字格式轉換

## 1. 目的

根據功能需求，將應用程式中顯示的「預算金額」與「減列/凍結金額」進行格式轉換，以提高可讀性。

## 2. 背景與研究

- **功能需求**: [FEATs/number-transformation.md](FEATs/number-transformation.md)
- **分析**:
    - `app/budget-detail/index.tsx` 中的預算詳細資料頁面，目前使用 `app/budget-detail/helpers.ts` 裡的 `formatNumber` 函式來格式化金額。
    - `app/components/budget-table.tsx` 中的預算總覽表格，則直接顯示 `originalAmount` 和 `reducedAmount`，部分有使用 `.toLocaleString()`。
    - 資料轉換的源頭位於 `app/all-budgets/index.tsx` 的 `proposalToBudgetTableData` 函式，它將從 GraphQL API 獲取的提案資料轉換為表格所需的格式。

## 3. 實作藍圖

### 3.1. 建立通用的格式化輔助函式

我們將在 `app/budget-detail/helpers.ts` 中建立或修改現有的輔助函式，以統一處理數字格式化邏輯。

#### 3.1.1. 修改 `formatNumber` 函式

此函式將負責將單一數值轉換為帶有「萬」或「億」單位且至小數點後一位的字串。

**File**: `app/budget-detail/helpers.ts`

```typescript
// Pseudocode/Blueprint
export function formatNumber(num?: number | null): string {
  if (num === null || num === undefined) return 'N/A';

  if (Math.abs(num) < 10000) {
    return num.toLocaleString('zh-TW');
  }

  const inYi = num / 1_0000_0000;
  if (Math.abs(inYi) >= 1) {
    return `${inYi.toFixed(1)} 億`;
  }

  const inWan = num / 1_0000;
  return `${inWan.toFixed(1)} 萬`;
}
```

#### 3.1.2. 新增 `formatReducedAndFrozenAmount` 函式

此函式將處理「減列」與「凍結」金額。它會接收兩個數值，將它們分別格式化後，用 `/` 符號連接。

**File**: `app/budget-detail/helpers.ts`

```typescript
// Pseudocode/Blueprint
export function formatReducedAndFrozenAmount(
  reduced?: number | null,
  frozen?: number | null
): string {
  const formattedReduced = reduced ? formatNumber(reduced) : '0';
  const formattedFrozen = frozen ? formatNumber(frozen) : '0';

  if (formattedReduced === '0' && formattedFrozen === '0') return '0';

  return `${formattedReduced} / ${formattedFrozen}`;
}
```

### 3.2. 更新資料轉換邏輯

我們將修改 `app/all-budgets/index.tsx` 中的 `proposalToBudgetTableData` 函式，讓它在轉換資料時就呼叫新的格式化函式。

**File**: `app/all-budgets/index.tsx`

```typescript
// ... imports
import {
  formatNumber,
  formatReducedAndFrozenAmount,
  // ... other imports
} from '~/budget-detail/helpers';

// ... existing code ...

function proposalToBudgetTableData(proposal: Proposal): BudgetTableData {
  return {
    // ... other properties
    originalAmount: formatNumber(proposal.budget?.budgetAmount),
    reducedAmount: formatReducedAndFrozenAmount(
      proposal.reductionAmount,
      proposal.freezeAmount
    ),
    // ... other properties
  };
}
```

### 3.3. 更新元件以顯示格式化後的字串

由於格式化邏輯已移至 `proposalToBudgetTableData`，`app/components/budget-table.tsx` 現在只需要直接顯示傳入的字串即可。這將簡化元件內的邏輯。

**File**: `app/components/budget-table.tsx`

```typescript
// In DesktopTableRow component
// ... existing code ...
<div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
  {item.reducedAmount} // Remove .toLocaleString()
</div>
<div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
  {item.originalAmount} // Remove .toLocaleString()
</div>
// ... existing code ...

// In BudgetTableRow component (Mobile)
// ... existing code ...
<p className="w-full py-2">{item.originalAmount}</p>
<p className="w-full py-2">{item.reducedAmount}</p>
// ... existing code ...
```

### 3.4. 更新預算詳細頁面

`app/budget-detail/index.tsx` 也需要更新，以分開顯示減列與凍結金額，並使用新的 `formatReducedAndFrozenAmount`。但為了簡化，我們先專注於表格的修改。詳細頁面的格式化將遵循 `formatNumber` 的更新。

## 4. 待辦事項

- [ ] 在 `app/budget-detail/helpers.ts` 中修改 `formatNumber` 函式。
- [ ] 在 `app/budget-detail/helpers.ts` 中建立一個新的 `formatReducedAndFrozenAmount` 函式。
- [ ] 修改 `app/all-budgets/index.tsx` 中的 `proposalToBudgetTableData` 函式，以使用新的格式化函式。
- [ ] 移除 `app/components/budget-table.tsx` 中多餘的 `.toLocaleString()` 呼叫。
- [ ] 驗證預算總覽頁面 (`/all-budgets`) 的表格顯示是否正確。
- [ ] 驗證預算詳細資料頁面 (`/budget/:id`) 的金額顯示是否正確。


## 5. 驗證

1.  啟動開發伺服器。
2.  導航至 `/all-budgets` 頁面。
3.  檢查「預算金額」和「減列/凍結金額」欄位是否符合以下格式：
    -   `1.2 億`
    -   `345.6 萬`
    -   `500.0 萬 / 0`
4.  點擊任一提案進入詳細頁面。
5.  檢查頁面上的「預算金額」、「減列金額」、「凍結金額」是否也已正確格式化。

## 6. 預期風險

- **資料型別**: 需要確保傳入格式化函式的都是 `number` 或 `null`/`undefined`。GraphQL 的型別應已提供保障。
- **顯示空間**: 新的格式可能比純數字更長，需要確認 UI 在各種解析度下不會因此跑版。

---
**Confidence Score**: 9/10
