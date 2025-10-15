## FEATs

# CirclePackChart 互動調整：移除使用者縮放功能

本計畫旨在調整 `CirclePackChart` D3 圖表元件的互動行為。主要目標是移除由使用者手動觸發的縮放與平移功能（例如滑鼠滾輪縮放、拖曳平移），以避免在瀏覽頁面時產生非預期的圖表互動，但同時保留原有的點擊節點聚焦放大之動畫效果。

---

## 元件與職責

- **目標元件**: `CirclePackChart`
- **檔案路徑**: `app/visualization/circle-pack-chart.tsx`
- **核心職責**:
  - **移除**: 使用者透過滑鼠滾輪、觸控板手勢或拖曳方式對圖表進行的縮放與平移。
  - **保留**: 使用者點擊圖表中具有子節點的區塊時，畫面會平滑地聚焦並放大到該區塊的動畫效果。

---

## Props 介面

本次調整不涉及元件 Props 的變更，`CirclePackChartProps` 介面將維持不變。

---

## 設計理由

- **提升使用者體驗**: 避免使用者在滾動整個網頁時，滑鼠指標不小心停留在圖表上而觸發非預期的縮放，從而干擾正常的頁面瀏覽。
- **簡化互動模型**: 將圖表的互動方式限制在點擊聚焦，讓功能更明確、單純。
- **保留核心功能**: 保留點擊聚焦的動畫對於探索圖表層次結構至關重要，因此予以保留。

---

## 實作細節分析

`CirclePackChart` 元件使用 `d3-zoom` 來處理所有縮放相關邏輯。

1.  **`zoomBehavior` 物件**:
    - 此物件在 `useEffect` 中被建立，負責定義縮放的範圍與事件處理。
    - 它同時被用於處理使用者手動縮放（透過事件監聽器）與程式化縮放（點擊節點時呼叫）。

2.  **事件監聽器綁定**:
    - `svg.call(zoomBehavior)` 這一行是關鍵。它將 `d3-zoom` 產生的所有事件監聽器（如 `wheel`, `mousedown`, `touchmove` 等）綁定到 SVG 畫布上。
    - **這是需要移除的部分**。只要移除這個綁定，使用者就無法再透過手勢或滾輪來觸發縮放。

3.  **程式化縮放 (點擊觸發)**:
    - 在 `zoom` 函式中，透過 `svg.transition().call(zoomBehavior.transform, ...)` 來實現點擊聚焦的平滑動畫。
    - 這個呼叫是程式化的，不依賴於先前綁定的事件監聽器。
    - 因此，即使移除了 `svg.call(zoomBehavior)`，這個功能依然能正常運作。

---

## 後續實作建議

1.  **編輯檔案**: 開啟 `app/visualization/circle-pack-chart.tsx`。
2.  **定位程式碼**: 在 `useEffect` hook 內，找到以下這行程式碼（大約在 401 行附近）：
    ```typescript
    // 綁定 zoom behavior 到 SVG
    svg.call(
      zoomBehavior as (
        selection: d3.Selection<SVGSVGElement, undefined, null, undefined>
      ) => void
    );
    ```
3.  **執行修改**: 將上述整段 `svg.call(...)` 程式碼移除或註解掉。
4.  **驗證**:
    - （可選）手動測試，確認在圖表上使用滑鼠滾輪或拖曳不再有任何縮放/平移效果。
    - （可選）點擊一個較大的圓圈（父節點），確認圖表依然會放大並聚焦到該圓圈。
