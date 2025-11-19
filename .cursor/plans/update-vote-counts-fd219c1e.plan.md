<!-- fd219c1e-dca3-495e-9848-14b039f38afc 8e3ff508-a074-4fc6-a0d6-ec0f077671d3 -->
# 實作心情投票功能

本計畫將在預算詳細頁面中，實作完整的心情投票功能，包含後端更新、本機狀態儲存與樂觀更新。

## 實作步驟

### 1. 增強 `app/stores/vote.store.ts`

為了要能記住使用者的投票選擇，我會修改現有的 Zustand store：

-   **整合 `persist` middleware**：我會使用 Zustand 內建的 `persist` middleware，將使用者的投票紀錄 `{ [proposalId: string]: ReactType }` 自動儲存到 `localStorage` 中。這比直接使用 `useLocalStorage` hook 更適合在 store 中進行。
-   **擴充 Actions**：我會擴充 store 中的 `actions`，使其能夠處理新增、取消、以及更換投票的邏輯。

### 2. 建立新的投票元件 `app/components/VoteButtons.tsx`

為了程式碼的複用性與清晰度，我會建立一個新的 React 元件：

-   **功能**：此元件將負責顯示四個心情投票按鈕，並封裝所有點擊事件的處理邏輯。
-   **Props**：它會接收 `proposal` 物件作為 props，以便取得 `proposalId` 和目前的總投票數。

### 3. 在 `VoteButtons.tsx` 中實作投票邏輯

這是核心步驟，我會在這個新元件中：

-   **引入 Hooks**：使用我們已經確認存在的 `useVoteMutation` hook，以及從 `vote.store.ts` 來的 state 和 actions。
-   **處理點擊事件**：為每個按鈕加上 `onClick` 事件處理器。
-   **實作投票情境**：

    1.  **新投票**：如果使用者從未對此提案投票，點擊後會呼叫 mutation，並將對應的心情計數 `+1`。
    2.  **取消投票**：如果使用者點擊了與上次相同的投票，會呼叫 mutation，將該心情計數 `-1`。
    3.  **更換投票**：如果使用者點擊了不同的心情，會呼叫 mutation，將上一次的心情計數 `-1`，並將新選擇的心情計數 `+1`。

-   **視覺回饋**：根據 `vote.store.ts` 中儲存的狀態，為使用者已投票的選項提供視覺上的回饋（例如，高亮或不同的樣式）。

### 4. 整合 `VoteButtons.tsx` 到 `app/budget-detail/index.tsx`

最後，我會修改預算詳細頁面：

-   **替換靜態區塊**：將目前寫死的投票區塊（桌面版與行動版兩個地方）都替換為我們新建立的 `<VoteButtons />` 元件。
-   **傳遞 Props**：將 `proposal` 物件傳遞給新的元件。

### To-dos

- [ ] 修改 `app/stores/vote.store.ts`，使用 `persist` middleware 將投票紀錄儲存至 `localStorage`，並擴充 actions。
- [ ] 建立新的投票元件 `app/components/VoteButtons.tsx`，用於顯示投票按鈕。
- [ ] 在 `VoteButtons.tsx` 中使用 `useVoteMutation` 和 Zustand store，實作新增、取消、更換投票的完整點擊邏輯。
- [ ] 將新的 `VoteButtons.tsx` 元件整合進 `app/budget-detail/index.tsx`，替換掉原有的靜態區塊。