## Feats

目標：提供一個可重用的「排序下拉選單」，用來決定資料清單的排序方式。支援數值與字串欄位、升冪/降冪切換，並具備良好的可用性與可存取性（a11y）。

- 放置位置：`app/all-budgets/index.tsx`（建議置於清單標題或工具列區塊）
- 相依套件：`react-select`
- 狀態管理：由頁面層持有排序 state，元件只回傳選中值

需求條件（Acceptance Criteria）：

- 使用者可以從下拉選單選擇排序方式
- 可支援至少下列選項：
  - 專案名稱（A→Z / Z→A）
  - 預算金額（高→低 / 低→高）
  - 年度（新→舊 / 舊→新）
- 切換選項後，清單排序即時更新（不重新載入頁面）
- 鍵盤可操作、提供基本 ARIA 屬性

不包含（Out of Scope）：

- 不在元件內直接操作遠端資料或快取
- 不在元件內進行排序，排序應由頁面層用 `useMemo` 處理

---

## Docs

- 套件文件：`https://react-select.com/home`

### 安裝

```bash
pnpm add react-select
```

### 型別與選項建議

```ts
export type SortOption {
  value: string; // ex: "projectName-asc"
  label: string; // ex: "專案名稱 (A-Z)"
  field: string; // ex: "projectName" | "budgetAmount" | "year"
  direction: "asc" | "desc";
}
```

### 排序策略建議

- 數值欄位（例如 `budgetAmount`, `year`）使用數值比較
- 字串欄位（例如 `projectName`）使用 `localeCompare('zh-TW')` 以符合繁中語系直覺
- 使用 `useMemo` 包裝排序結果，依賴項包含「清單資料、選中排序鍵」
- 欄位值可能為空：以 `String(value ?? '')` 與 `Number(value) || 0` 安全處理

---

## Examples

以下示例示範如何在 `app/all-budgets/index.tsx` 中整合 `react-select` 排序下拉，並套用到資料清單：

```tsx
import Select from "react-select";
import { useMemo, useState } from "react";

type Budget = {
  id: string;
  projectName: string | null;
  projectDescription?: string | null;
  budgetAmount?: number | null;
  year?: number | null;
};

type SortOption {
  value: string;
  label: string;
  field: "projectName" | "budgetAmount" | "year";
  direction: "asc" | "desc";
}

const sortOptions: SortOption[] = [
  {
    value: "projectName-asc",
    label: "專案名稱 (A-Z)",
    field: "projectName",
    direction: "asc",
  },
  {
    value: "projectName-desc",
    label: "專案名稱 (Z-A)",
    field: "projectName",
    direction: "desc",
  },
  {
    value: "budgetAmount-desc",
    label: "預算金額 (高到低)",
    field: "budgetAmount",
    direction: "desc",
  },
  {
    value: "budgetAmount-asc",
    label: "預算金額 (低到高)",
    field: "budgetAmount",
    direction: "asc",
  },
  {
    value: "year-desc",
    label: "年度 (新到舊)",
    field: "year",
    direction: "desc",
  },
  {
    value: "year-asc",
    label: "年度 (舊到新)",
    field: "year",
    direction: "asc",
  },
];

export function BudgetsWithSort({ budgets }: { budgets: Budget[] }) {
  const [selectedSort, setSelectedSort] = useState<string>(
    sortOptions[0].value
  );

  const sortedBudgets = useMemo(() => {
    if (!budgets?.length) return [];
    const selected = sortOptions.find((o) => o.value === selectedSort);
    if (!selected) return budgets;

    return [...budgets].sort((a, b) => {
      const aValue = a[selected.field as keyof Budget];
      const bValue = b[selected.field as keyof Budget];

      // 數值欄位
      if (selected.field === "budgetAmount" || selected.field === "year") {
        const aNum = Number(aValue) || 0;
        const bNum = Number(bValue) || 0;
        return selected.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      // 字串欄位
      const aStr = String(aValue ?? "").toLowerCase();
      const bStr = String(bValue ?? "").toLowerCase();
      return selected.direction === "asc"
        ? aStr.localeCompare(bStr, "zh-TW")
        : bStr.localeCompare(aStr, "zh-TW");
    });
  }, [budgets, selectedSort]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">排序方式：</span>
        <Select
          inputId="budget-sort-select"
          classNamePrefix="budget-sort"
          options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
          value={{
            value: selectedSort,
            label: sortOptions.find((o) => o.value === selectedSort)?.label,
          }}
          onChange={(opt) =>
            setSelectedSort(opt?.value ?? sortOptions[0].value)
          }
          aria-label="選擇排序方式"
          styles={{
            control: (base) => ({
              ...base,
              border: "2px solid black",
              boxShadow: "none",
            }),
            indicatorSeparator: () => ({ display: "none" }),
          }}
        />
      </div>

      <div className="space-y-2">
        {sortedBudgets.map((b) => (
          <div key={b.id} className="rounded border bg-white px-3 py-2">
            <div className="flex justify-between">
              <strong>{b.projectName ?? "（未命名）"}</strong>
              <span className="text-sm text-gray-500">{b.year ?? "—"} 年</span>
            </div>
            <div className="text-sm text-blue-700">
              預算金額：
              {typeof b.budgetAmount === "number"
                ? `NT$ ${b.budgetAmount.toLocaleString()}`
                : "未設定"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

整合步驟建議：

1. 於頁面載入資料後，將資料陣列傳入 `BudgetsWithSort`（或在頁面層直接依照以上範例嵌入 Select 與排序 useMemo）
2. 若需要客製選單 UI，可調整 `styles` 或改用 Tailwind + `classNamePrefix`
3. 未來若新增欄位，只需在 `sortOptions` 增加對應 `field` 與 `direction`
