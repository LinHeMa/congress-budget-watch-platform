/**
 * 圖例常數定義
 * 集中管理專案中使用的圖表圖例資料
 */

type LegendItem = {
  icon: string;
  label: string;
  alt: string;
};

/**
 * 預算類型圖例項目
 * 用於視覺化圖表中標示凍結、刪除、主決議三種狀態
 */
export const BUDGET_TYPE_LEGEND_ITEMS: LegendItem[] = [
  {
    icon: "/icon/circle-pack-frozen.svg",
    label: "凍結",
    alt: "circle-pack-frozen",
  },
  {
    icon: "/icon/circle-pack-default.svg",
    label: "刪除",
    alt: "circle-pack-default",
  },
  {
    icon: "/icon/circle-pack-main.svg",
    label: "主決議",
    alt: "circle-pack-main",
  },
];
