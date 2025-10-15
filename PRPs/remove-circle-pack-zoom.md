# PRP: 移除 CirclePackChart 使用者縮放功能

## 概述

調整 `CirclePackChart` D3.js 視覺化元件的互動行為，移除使用者手動觸發的縮放與平移功能（滑鼠滾輪縮放、拖曳平移），同時保留點擊節點時的聚焦放大動畫效果。

## 背景與研究發現

### 當前 Codebase 狀態

- **目標檔案**: `app/visualization/circle-pack-chart.tsx` (461 行)
- **框架**: React Router v7 with React 19.1.0
- **D3 版本**: d3 v7.9.0
- **TypeScript**: v5.8.3
- **建置工具**: Vite v6.3.3

### 關鍵程式碼分析

#### 1. 當前 Zoom 實作架構 (行 324-405)

```typescript
// 建立 d3-zoom behavior
const zoomBehavior = d3
  .zoom<SVGSVGElement, unknown>()
  .scaleExtent([0.5, 10])
  .on("zoom", (event) => {
    applyZoomTransform(event.transform);
  });

// ⚠️ 這是需要移除的關鍵行 (401-405)
svg.call(
  zoomBehavior as (
    selection: d3.Selection<SVGSVGElement, undefined, null, undefined>
  ) => void
);
```

**問題點**：`svg.call(zoomBehavior)` 將所有 d3-zoom 的事件監聽器（`wheel`, `mousedown`, `touchstart`, `touchmove` 等）綁定到 SVG 元素上，這會攔截使用者的滾動手勢。

#### 2. 程式化縮放功能 (行 332-398)

```typescript
function zoom(
  event: (MouseEvent & { altKey?: boolean }) | null,
  d: d3.HierarchyCircularNode<NodeDatum>
) {
  focus = d;
  const targetView: [number, number, number] = [d.x, d.y, d.r * 2];

  // 使用 d3-zoom 的程式化縮放
  svg
    .transition()
    .duration(750)
    .call(zoomBehavior.transform, viewToTransform(targetView));
}
```

**關鍵發現**：這個函式使用 `svg.transition().call(zoomBehavior.transform, ...)` 來實現程式化縮放，這是**獨立於事件監聽器**的。即使移除 `svg.call(zoomBehavior)`，此功能仍可正常運作。

#### 3. 初始視圖設定 (行 407-417)

```typescript
// 設定初始視圖
const initialView: [number, number, number] = [root.x, root.y, root.r * 2];
const initialTransform = viewToTransform(initialView);
svg.call(zoomBehavior.transform, initialTransform);
zoomTo(initialView);
```

**分析**：410-416 行使用 `zoomBehavior.transform` 來同步 zoom behavior 的內部狀態。移除 `svg.call(zoomBehavior)` 後，這個同步可能不再必要，因為我們不再依賴 zoom behavior 追蹤使用者互動。

#### 4. 點擊事件處理 (行 420-441)

```typescript
svg.on("click", (event) => {
  if (event.defaultPrevented) return;
  zoom(event as unknown as MouseEvent, root);
});

node.on("click", (event, d) => {
  if (event.defaultPrevented) return;
  if (d.data.id) {
    navigate(`/visualization/legislator/${d.data.id}`);
    event.stopPropagation();
    return;
  }
  if (focus !== d) {
    zoom(event as unknown as MouseEvent, d);
    event.stopPropagation();
  }
});
```

**保留原因**：這些點擊事件處理器觸發程式化縮放，與使用者手動縮放無關，必須保留。

### 外部研究

#### D3.js v7 Zoom Behavior 文檔

- **官方文檔**: https://d3js.org/d3-zoom
- **關鍵概念**:
  - `selection.call(zoom)` - 綁定事件監聽器到選取的元素
  - `zoom.transform(selection, transform)` - 程式化地設定縮放變換
  - `transition.call(zoom.transform, transform)` - 帶動畫的程式化變換

#### Stack Overflow 範例

- **移除使用者互動但保留程式化縮放**: 
  - 方法：不呼叫 `selection.call(zoom)`，只使用 `zoom.transform()` API
  - 參考：https://stackoverflow.com/questions/tagged/d3-zoom
  
#### GitHub 討論

- **d3-zoom 事件過濾**:
  - `zoom.filter()` 可用於選擇性地禁用某些事件
  - 完全移除 `call(zoom)` 是最簡潔的方法
  - 參考：https://github.com/d3/d3-zoom/issues

### 設計決策理由

1. **使用者體驗**: 防止使用者滾動頁面時，滑鼠指標意外停留在圖表上觸發縮放，干擾正常瀏覽
2. **互動簡化**: 將圖表互動限制在點擊聚焦，讓功能更明確、單純
3. **保留核心功能**: 點擊聚焦的動畫對於探索圖表層次結構至關重要

### 技術風險評估

- **風險等級**: 極低
- **影響範圍**: 僅限 `circle-pack-chart.tsx` 檔案
- **向後相容性**: 不影響，僅改變使用者互動方式
- **測試複雜度**: 低，主要是手動功能測試

## 實作藍圖

### 階段一：移除事件監聽器綁定

#### 步驟 1.1: 移除主要的 zoom behavior 綁定

**檔案**: `app/visualization/circle-pack-chart.tsx`

**位置**: 行 400-405

**操作**: 移除或註解掉以下程式碼

```typescript
// 綁定 zoom behavior 到 SVG
svg.call(
  zoomBehavior as (
    selection: d3.Selection<SVGSVGElement, undefined, null, undefined>
  ) => void
);
```

**理由**: 這是唯一將事件監聽器綁定到 SVG 的地方。移除後，滑鼠滾輪和拖曳將不再觸發縮放。

### 階段二：清理初始視圖設定

#### 步驟 2.1: 評估初始 transform 設定的必要性

**檔案**: `app/visualization/circle-pack-chart.tsx`

**位置**: 行 407-417

**當前程式碼**:
```typescript
// 設定初始視圖
const initialView: [number, number, number] = [root.x, root.y, root.r * 2];
const initialTransform = viewToTransform(initialView);
svg.call(
  zoomBehavior.transform as (
    selection: d3.Selection<SVGSVGElement, undefined, null, undefined>,
    transform: d3.ZoomTransform
  ) => void,
  initialTransform
);
zoomTo(initialView);
```

**建議修改**:

**選項 A (推薦)**: 移除 `svg.call(zoomBehavior.transform, ...)` 行，只保留 `zoomTo`

```typescript
// 設定初始視圖
const initialView: [number, number, number] = [root.x, root.y, root.r * 2];
zoomTo(initialView);
```

**理由**: 
- `zoomTo(initialView)` 已經正確設定視覺呈現
- 不再需要同步 `zoomBehavior` 的內部狀態，因為我們不使用其事件處理器
- 簡化程式碼，減少不必要的 D3 transform 計算

**選項 B (保守)**: 保持原有程式碼不變

```typescript
// 保持原樣，先測試選項 A 是否工作
```

**建議**: 先實作選項 A。如果在測試階段發現程式化縮放動畫有問題，再回退到選項 B。

### 階段三：調整 CSS cursor 樣式 (可選)

#### 步驟 3.1: 移除拖曳 cursor 提示

**檔案**: `app/visualization/circle-pack-chart.tsx`

**位置**: 行 98

**當前程式碼**:
```typescript
.attr(
  "style",
  `max-width: 100%; height: auto; display: block; cursor: grab;`
)
```

**建議修改**:
```typescript
.attr(
  "style",
  `max-width: 100%; height: auto; display: block; cursor: default;`
)
```

**理由**: 移除 `cursor: grab` 可避免使用者誤以為圖表可以拖曳。

### 階段四：驗證程式化縮放仍正常運作

#### 步驟 4.1: 確認 zoom 函式不受影響

**檔案**: `app/visualization/circle-pack-chart.tsx`

**檢查點**: 行 332-398

**驗證項目**:
- [x] `zoom` 函式的實作不需修改
- [x] `svg.transition().call(zoomBehavior.transform, ...)` 仍可正常執行
- [x] 標籤動畫 (label transition) 仍正常運作

**程式碼片段** (無需修改，僅供參考):
```typescript
function zoom(
  event: (MouseEvent & { altKey?: boolean }) | null,
  d: d3.HierarchyCircularNode<NodeDatum>
) {
  focus = d;
  const isSlow = Boolean(event?.altKey);
  const targetView: [number, number, number] = [
    focus.x,
    focus.y,
    focus.r * 2,
  ];

  // 這個程式化縮放不依賴於 svg.call(zoomBehavior)
  svg
    .transition()
    .duration(isSlow ? 7500 : 750)
    .call(
      zoomBehavior.transform as (...args: any[]) => void,
      viewToTransform(targetView)
    )
    .on("end", () => {
      // 更新標籤顯示
    });
}
```

## 實作檢查清單

### 必要修改 (Must Have)

- [ ] **步驟 1.1**: 移除 `svg.call(zoomBehavior)` (行 400-405)

### 建議修改 (Should Have)

- [ ] **步驟 2.1**: 移除初始 transform 同步，只保留 `zoomTo(initialView)` (行 410-416)
- [ ] **步驟 3.1**: 將 SVG cursor 從 `grab` 改為 `default` (行 98)

### 可選優化 (Nice to Have)

- [ ] 新增 JSDoc 註解說明為何使用 `zoomBehavior` 但不綁定事件
- [ ] 考慮重構：如果不需要 zoom behavior 的內部狀態管理，可以完全移除 `zoomBehavior` 的建立，直接使用 `zoomTo` 函式

## 驗證步驟

### 階段一：語法與類型檢查

```bash
# TypeScript 類型檢查
pnpm typecheck

# ESLint 檢查
pnpm lint:check

# 修復 lint 問題（如有需要）
pnpm lint
```

**預期結果**: 無錯誤，無警告

### 階段二：建置驗證

```bash
# 清除舊的建置
rm -rf build/

# 執行生產建置
pnpm build
```

**預期結果**: 建置成功，無錯誤

### 階段三：開發伺服器功能測試

```bash
# 啟動開發伺服器
pnpm dev
```

**手動測試清單**:

#### 測試 1: 驗證使用者縮放已禁用

1. **測試項目**: 滑鼠滾輪縮放
   - **操作**: 將滑鼠指標移至圖表上方，滾動滾輪
   - **預期結果**: 圖表不縮放，頁面正常滾動
   - **狀態**: [ ] Pass / [ ] Fail

2. **測試項目**: 拖曳平移
   - **操作**: 在圖表上按住滑鼠左鍵並拖曳
   - **預期結果**: 圖表不移動
   - **狀態**: [ ] Pass / [ ] Fail

3. **測試項目**: 觸控板手勢 (如適用)
   - **操作**: 在 MacBook 觸控板上使用雙指縮放手勢
   - **預期結果**: 圖表不縮放
   - **狀態**: [ ] Pass / [ ] Fail

#### 測試 2: 驗證點擊聚焦功能正常

4. **測試項目**: 點擊父節點聚焦
   - **操作**: 點擊一個有子節點的圓圈（較大的圓圈）
   - **預期結果**: 圖表平滑放大並聚焦到該圓圈，標籤更新顯示
   - **狀態**: [ ] Pass / [ ] Fail

5. **測試項目**: 點擊背景返回根節點
   - **操作**: 點擊圖表空白區域（非圓圈區域）
   - **預期結果**: 圖表平滑縮小回到根視圖
   - **狀態**: [ ] Pass / [ ] Fail

6. **測試項目**: 點擊葉節點導航
   - **操作**: 點擊一個有 `id` 的葉節點（沒有子節點的圓圈）
   - **預期結果**: 導航到詳情頁 `/visualization/legislator/{id}`
   - **狀態**: [ ] Pass / [ ] Fail

7. **測試項目**: Alt + 點擊慢速聚焦 (可選)
   - **操作**: 按住 Alt/Option 鍵並點擊圓圈
   - **預期結果**: 圖表以 7500ms 的慢速動畫聚焦
   - **狀態**: [ ] Pass / [ ] Fail

#### 測試 3: 驗證視覺呈現正確

8. **測試項目**: 初始視圖正確
   - **操作**: 重新載入頁面
   - **預期結果**: 圖表顯示完整的根視圖，所有第一層圓圈可見
   - **狀態**: [ ] Pass / [ ] Fail

9. **測試項目**: 標籤正確顯示
   - **操作**: 觀察不同層級的標籤
   - **預期結果**: 只有當前焦點層級的標籤可見，其他隱藏
   - **狀態**: [ ] Pass / [ ] Fail

10. **測試項目**: 冰凍節點樣式正確
    - **操作**: 檢查有 `isFrozen: true` 的節點
    - **預期結果**: 顯示特殊的粉紅色邊框 (`FROZEN_PATH_D`)
    - **狀態**: [ ] Pass / [ ] Fail

#### 測試 4: 響應式與效能測試

11. **測試項目**: 不同視窗大小
    - **操作**: 調整瀏覽器視窗大小
    - **預期結果**: 圖表正確縮放適應
    - **狀態**: [ ] Pass / [ ] Fail

12. **測試項目**: 動畫流暢度
    - **操作**: 快速連續點擊不同圓圈
    - **預期結果**: 動畫流暢，無卡頓
    - **狀態**: [ ] Pass / [ ] Fail

### 階段四：跨瀏覽器測試 (建議)

**測試瀏覽器**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)

**測試重點**: 重複上述測試 1-2 的關鍵項目

### 階段五：回歸測試

**檢查其他視覺化元件**:
- [ ] `app/visualization/department/index.tsx` - 確認部會視圖正常
- [ ] `app/visualization/legislator/index.tsx` - 確認立委視圖正常
- [ ] `app/visualization/legislator/session-chart.tsx` - 確認會期圖表正常

## 錯誤處理策略

### 潛在問題與解決方案

#### 問題 1: 程式化縮放動畫失效

**症狀**: 點擊圓圈後，圖表瞬間跳轉而非平滑動畫

**可能原因**: 移除初始 transform 設定後，`zoomBehavior` 的內部狀態未正確初始化

**解決方案**:
```typescript
// 恢復 svg.call(zoomBehavior.transform, initialTransform)
// 但仍保持 svg.call(zoomBehavior) 被移除
const initialView: [number, number, number] = [root.x, root.y, root.r * 2];
const initialTransform = viewToTransform(initialView);
svg.call(
  zoomBehavior.transform as (...args: any[]) => void,
  initialTransform
);
zoomTo(initialView);
```

#### 問題 2: 初始視圖顯示不正確

**症狀**: 頁面載入後，圖表顯示位置或大小錯誤

**可能原因**: `zoomTo` 函式依賴於某些未正確初始化的變數

**診斷步驟**:
1. 在瀏覽器開發者工具中檢查 `initialView` 的值
2. 確認 `root.x`, `root.y`, `root.r` 不是 `NaN` 或 `undefined`

**解決方案**:
```typescript
// 在 zoomTo 之前加入防禦性檢查
const initialView: [number, number, number] = [root.x, root.y, root.r * 2];
console.log('Initial view:', initialView); // 調試用

if (initialView.some(v => !isFinite(v))) {
  console.error('Invalid initial view values');
  return; // 或使用預設值
}

zoomTo(initialView);
```

#### 問題 3: TypeScript 類型錯誤

**症狀**: `pnpm typecheck` 報錯

**可能原因**: 移除程式碼後，某些變數或函式未使用

**解決方案**: 如果 `viewToTransform` 函式在移除初始 transform 設定後變成未使用：
- 選項 A: 保留函式（未來可能需要）
- 選項 B: 加上 ESLint ignore 註解
  ```typescript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function viewToTransform(v: [number, number, number]): d3.ZoomTransform {
    // ...
  }
  ```

#### 問題 4: 點擊事件的 `event.defaultPrevented` 判斷失效

**症狀**: 點擊圓圈後，同時觸發了節點點擊和背景點擊

**可能原因**: 移除 `svg.call(zoomBehavior)` 後，D3 不再管理拖曳檢測

**解決方案**: 
```typescript
// 在 zoom 函式中加入防止事件冒泡
node.on("click", (event, d) => {
  event.stopPropagation(); // 確保先執行
  
  if (d.data.id) {
    navigate(`/visualization/legislator/${d.data.id}`);
    return;
  }
  if (focus !== d) {
    zoom(event as unknown as MouseEvent, d);
  }
});
```

## 文檔需求

### 程式碼註解

在 `circle-pack-chart.tsx` 中加入以下註解：

```typescript
// 建立 d3-zoom behavior 用於程式化縮放動畫
// 注意：我們不呼叫 svg.call(zoomBehavior) 來綁定事件監聽器，
// 因為我們想禁用使用者的手動縮放（滾輪、拖曳），
// 只保留程式化的點擊聚焦功能。
const zoomBehavior = d3
  .zoom<SVGSVGElement, unknown>()
  .scaleExtent([0.5, 10])
  .on("zoom", (event) => {
    // 這個事件處理器只會在程式化縮放時被觸發
    applyZoomTransform(event.transform);
  });

// [移除] svg.call(zoomBehavior)
// 不綁定事件監聽器，避免攔截使用者的滾動手勢
```

### FEAT 文件更新

**檔案**: `FEATs/remove-circle-pack-zoom.md`

在文件末尾加入「實作完成」章節：

```markdown
## 實作完成

- **實作日期**: {完成日期}
- **修改檔案**: `app/visualization/circle-pack-chart.tsx`
- **修改內容**:
  1. 移除 `svg.call(zoomBehavior)` (行 400-405)
  2. 簡化初始視圖設定 (行 410-416)
  3. 調整 SVG cursor 樣式 (行 98)
- **測試結果**: 所有測試項目通過 ✓
- **已知問題**: 無
```

## 預期交付成果

1. **修改檔案**:
   - `app/visualization/circle-pack-chart.tsx` - 移除使用者縮放功能

2. **驗證結果**:
   - TypeScript 類型檢查通過
   - ESLint 檢查通過
   - 生產建置成功
   - 所有手動測試項目通過

3. **文檔**:
   - 程式碼內適當的註解
   - 更新 FEAT 文件（可選）

## 成功標準

- ✅ 滑鼠滾輪不再觸發圖表縮放
- ✅ 拖曳不再觸發圖表平移
- ✅ 點擊圓圈仍能正常聚焦放大
- ✅ 點擊背景能返回根視圖
- ✅ 點擊葉節點能導航到詳情頁
- ✅ 動畫流暢自然（750ms 標準，7500ms 慢速）
- ✅ 標籤顯示/隱藏正確
- ✅ TypeScript 編譯無錯誤
- ✅ 不影響其他視覺化元件

## 風險緩解

### 回滾計畫

如果修改導致無法解決的問題：

```bash
# 使用 Git 回滾變更
git checkout HEAD -- app/visualization/circle-pack-chart.tsx

# 或者使用 Git 查看變更差異
git diff app/visualization/circle-pack-chart.tsx
```

### 漸進式實作建議

如果擔心一次性修改風險過高，可以採用以下順序：

1. **階段 A**: 只移除 `svg.call(zoomBehavior)` → 測試
2. **階段 B**: 簡化初始視圖設定 → 測試
3. **階段 C**: 調整 cursor 樣式 → 測試

每個階段都進行完整測試後再進入下一階段。

## 參考文檔

### 關鍵資源

- **D3.js v7 Zoom 文檔**: https://d3js.org/d3-zoom
  - 重點章節: `zoom.transform()` - 程式化變換
  - 重點章節: `selection.call(zoom)` - 事件綁定
  
- **D3.js GitHub Issues**:
  - 禁用使用者互動: https://github.com/d3/d3-zoom/issues/82
  - 程式化 zoom: https://github.com/d3/d3-zoom/issues/65

- **Stack Overflow 相關問題**:
  - "How to disable zoom in d3.js but keep programmatic zoom": https://stackoverflow.com/questions/tagged/d3-zoom
  
- **Observable 範例**:
  - D3 Zoom 官方範例: https://observablehq.com/@d3/zoom
  - Circle Packing 範例: https://observablehq.com/@d3/circle-packing

### 專案內部參考

- **相關元件**: 
  - `app/visualization/department/index.tsx` - 部會視圖
  - `app/visualization/legislator/index.tsx` - 立委視圖
  
- **常數檔案**:
  - `app/constants/svg-paths.ts` - `FROZEN_PATH_D` 定義

## 實作時間序列

1. **程式碼修改** (5 分鐘)
   - 移除 `svg.call(zoomBehavior)`
   - 簡化初始視圖設定
   - 調整 cursor 樣式

2. **語法與建置驗證** (3 分鐘)
   - 執行 `pnpm typecheck`
   - 執行 `pnpm lint`
   - 執行 `pnpm build`

3. **功能測試** (10 分鐘)
   - 驗證使用者縮放已禁用（測試 1-3）
   - 驗證點擊聚焦正常（測試 4-7）
   - 驗證視覺呈現正確（測試 8-10）

4. **回歸測試** (5 分鐘)
   - 檢查其他視覺化元件
   - 快速瀏覽應用程式其他功能

5. **文檔更新** (2 分鐘)
   - 加入程式碼註解
   - 更新 FEAT 文件（可選）

**總預估時間**: ~25 分鐘（完整實作與測試）

## 信心評分: 9.5/10

### 高信心理由

1. **技術明確性**: 修改點精確定位，只需移除一段程式碼
2. **影響範圍小**: 只涉及單一檔案，無外部依賴
3. **理論紮實**: D3.js 官方文檔支持此做法，程式化縮放不依賴事件綁定
4. **可逆性高**: 修改可輕易回滾，風險極低
5. **測試簡單**: 手動測試項目清晰，結果易於判斷

### 扣 0.5 分原因

- 需要手動功能測試確認初始視圖簡化後無副作用
- D3.js 內部狀態管理的邊緣情況可能需要微調

### 一次性實作成功機率

基於本 PRP 提供的詳細上下文、清晰的實作步驟、完整的錯誤處理策略和可執行的驗證步驟，AI Agent 應能在不需要額外澄清的情況下，一次性成功完成此功能實作。

