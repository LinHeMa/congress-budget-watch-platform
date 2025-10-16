## 專案架構

### 目錄結構概覽

以下是 `app/` 目錄的主要結構：

```
app/
├── all-budgets/       # 總預算案列表頁面
├── budget-detail/     # 單一預算案詳細頁面
├── components/        # 可重用的 React 元件
├── constants/         # 應用程式的全域常數
├── graphql/           # GraphQL 客戶端與程式碼生成
├── hooks/             # 自定義 React Hooks
├── queries/           # GraphQL 查詢語句
├── routes/            # 頁面級元件與路由定義
├── stores/            # Zustand 狀態管理
├── utils/             # 共用的輔助函式
└── visualization/     # 資料視覺化元件
```

### 核心概念

1.  **路由中心化 (`routes/`)**
    -   所有頁面級的元件都存放在 `routes/` 中，例如 `home.tsx`。
    -   每個路由對應一個檔案，負責組織該頁面所需的元件與資料。

2.  **元件化 (`components/`)**
    -   我們遵循「原子化設計」原則，將 UI 拆分為小而可重用的元件。
    -   複雜元件（如 `timeline`）或特定用途的元件（如 `skeleton`）會建立自己的子目錄。

3.  **資料驅動 (`graphql/`, `queries/`)**
    -   本專案使用 GraphQL 進行資料通訊。
    -   `graphql/` 目錄包含由 `graphql-codegen` 自動生成的型別與客戶端設定。
    -   `queries/` 目錄存放所有手動編寫的 GraphQL 查詢、變更與片段，方便管理與重用。

4.  **狀態管理 (`stores/`)**
    -   請參閱下方的「狀態管理 (Zustand)」章節。

---

## 狀態管理 (Zustand)

本專案使用 [Zustand](https://github.com/pmndrs/zustand) 作為跨元件/全域狀態管理的解決方案。

### 核心原則

我們遵循以下原則來確保狀態管理的一致性與可維護性：

1.  **保持 Store 專注**：每個 store 只負責一塊特定的業務領域（例如 `paginationStore` 只管理分頁狀態）。避免建立一個龐大的單一 store。
2.  **分離 Actions 與 State**：在 store 內部，將更新狀態的函式（actions）與狀態本身（state）分開，以優化效能並提升程式碼清晰度。
3.  **只導出 Selector Hooks**：永遠不要直接導出整個 store 實例。應該為 store 中的每個 state 片段建立並導出專屬的 selector hook（例如 `usePagination()`），以避免不必要的重新渲染。

### 範例

以 `paginationStore.ts` 為例：

```typescript
// store 內部結構
const usePaginationStore = create((set) => ({
  page: 1,
  actions: {
    setPage: (page) => set({ page }),
  },
}));

// 導出 selector hooks
export const usePage = () => usePaginationStore((state) => state.page);
export const usePaginationActions = () => usePaginationStore((state) => state.actions);
```

### 何時使用 Zustand？

-   當多個無直接父子關係的元件需要共享狀態時。
-   當需要跨頁面持久化某些狀態時。
-   對於僅在單一元件或其子元件中使用的狀態，優先使用 React 內建的 `useState` 或 `useReducer`。

---

## 其他重要部分

### 視覺化 (`visualization/`)

-   此目錄包含所有與 D3.js 或其他圖表庫相關的複雜視覺化元件，例如 `circle-pack-chart.tsx`。
-   目標是將視覺化邏輯與業務邏輯分離，使其成為可獨立運作的單元。

### 常數管理 (`constants/`)

-   `config.ts`: 環境變數與應用程式級別的設定。
-   `endpoints.ts`: 所有 API 的端點路徑。
-   `legends.ts`: 圖表中使用的圖例定義。

## 深色模式設定

### 目前狀態：深色模式已暫停

深色模式功能目前已被暫停，只使用淺色模式。

### 如何重新啟用深色模式

如需重新啟用深色模式功能，請在 `app/app.css` 中進行以下修改：

```css
html,
body {
  @apply bg-background dark:bg-gray-950;

  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}
```

### 修改記錄

- **暫停日期**：2025年1月
- **修改檔案**：`app/app.css`
- **修改內容**：
  - 移除 `dark:bg-gray-950` 深色背景類別
  - 移除 `@media (prefers-color-scheme: dark)` 媒體查詢
  - 保留基本的 `@apply bg-background` 設定

---
