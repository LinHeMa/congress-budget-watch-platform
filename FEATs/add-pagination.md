## Feats
1. 加入 pagination到 `/all-budgets`頁面
2. 每一頁預設拿10筆
    2-1. GQL也要改成拿10筆
    2-2. 使用 Map物件記住已經拿過的proposal id，用於檢查是否有拿到重複的
3. pagination的元件在  `{/* 使用新的表格組件渲染清單 */}
        <BudgetTable isDesktop={isDesktop} data={tableData} className="mt-4" />`上下都加入一樣的元件（要符合DRY原則）
4. 狀態管理 (State Management) 使用zustand會不會比較好？幫我評估
5. 修改 GraphQL 查詢：正如您所提到的，我們需要修改 GET_PROPOSALS_QUERY。可能將其更新為一個接受 take (每頁筆數) 和 skip (略過筆數) 參數的新查詢，例如 GET_PAGINATED_PROPOSALS_QUERY。
6. 
## Reminders
1. 不用run pnpm dev
2. 不要破壞現有的邏輯
3. 不要破壞現有的排版

