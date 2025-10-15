import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { FROZEN_PATH_D } from "~/constants/svg-paths";

type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id?: string;
  isFrozen?: boolean;
  children?: NodeDatum[];
};

const FAKE_DATA: NodeDatum = {
  name: "root",
  children: [
    {
      name: "徐巧芯\n中國國民黨\n999999萬",
      value: 999999,
      color: "#6B7FFF",
      isFrozen: true,
      id: "1-14-1-05-024-7990",
    },
    {
      name: "徐巧芯\n中國國民黨\n689998萬",
      value: 689998,
      color: "#6B7FFF",
      id: "1-14-1-05-024-7991",
      children: [
        // { name: "B-1", value: 1600 },
        // { name: "B-2", value: 300 },
      ],
    },
    {
      name: "徐巧芯\n中國國民黨\n70000萬",
      value: 70000,
      color: "#6B7FFF",
      id: "1-14-1-05-024-7992",
      children: [
        // { name: "C-1", value: 600 },
        // { name: "C-2", value: 500 },
        // { name: "C-3", value: 400 },
        // { name: "C-4", value: 300 },
      ],
    },
  ],
};

type CirclePackChartProps = {
  data?: NodeDatum;
  width?: number;
  height?: number;
  padding?: number;
};

const CirclePackChart = ({
  data = FAKE_DATA,
  width: customWidth = 720,
  height: customHeight,
  padding = 3,
}: CirclePackChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { root, width, height, color } = useMemo(() => {
    const width = customWidth;
    const height = customHeight ?? width;

    const color = d3
      .scaleLinear<string>()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    const pack = (data: NodeDatum) =>
      d3.pack<NodeDatum>().size([width, height]).padding(padding)(
        d3
          .hierarchy<NodeDatum>(data)
          .sum((d) => (typeof d.value === "number" ? d.value : 0))
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      );

    const root = pack(data);
    return { root, width, height, color };
  }, [data, customWidth, customHeight, padding]);

  useEffect(() => {
    if (!containerRef.current) return;

    const svg = d3
      .create("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr(
        "style",
        `max-width: 100%; height: auto; display: block; cursor: default;`
      );

    const nodesData: d3.HierarchyCircularNode<NodeDatum>[] = root
      .descendants()
      .slice(1) as d3.HierarchyCircularNode<NodeDatum>[];

    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodesData)
      .join("g")
      .attr("pointer-events", (d) =>
        d.children || d.data.id ? "auto" : "none"
      )
      .style("cursor", (d) =>
        d.data.id ? "pointer" : d.children ? "pointer" : "default"
      )
      .on("mouseover", function () {
        d3.select(this).select("circle").attr("stroke-width", 1);
        d3.select(this).select("path").attr("stroke-width", 1);
      })
      .on("mouseout", function () {
        d3.select(this).select("circle").attr("stroke-width", 1);
        d3.select(this).select("path").style("filter", "none");
      });

    node
      .filter((d) => !d.data.isFrozen)
      .append("circle")
      .attr("r", (d) => d.r)
      .attr(
        "fill",
        (d) => d.data.color ?? (d.children ? color(d.depth) : "white")
      )
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    const frozenNodes = node.filter((d) => d.data.isFrozen ?? false);

    // Render an inner circle for the original fill color first
    frozenNodes
      .append("circle")
      .attr("r", (d) => d.r)
      .attr(
        "fill",
        (d) => d.data.color ?? (d.children ? color(d.depth) : "white")
      );

    // Render the border from SVG path on top of the circle
    // Layer 1: Outer border (pink) - defines the outer size
    frozenNodes
      .append("path")
      .attr("d", FROZEN_PATH_D)
      .attr("fill", "#FF43D3")
      .attr(
        "transform",
        (d) => `scale(${((d.r * 2) / 55) * 1.2}) translate(-26.5, -27.5)`
      );

    // Layer 2: Inner border (same color as circle) - creates the thin border effect
    frozenNodes
      .append("path")
      .attr("d", FROZEN_PATH_D)
      .attr("fill", (d) => d.data.color ?? "#6B7FFF")
      .attr(
        "transform",
        (d) => `scale(${((d.r * 2) / 55) * 1.13}) translate(-26.5, -27.5)`
      );

    const label = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll<SVGTextElement, d3.HierarchyCircularNode<NodeDatum>>("text")
      .data(root.descendants() as d3.HierarchyCircularNode<NodeDatum>[])
      .join("text")
      .style("fill-opacity", (d) =>
        d.parent === root || d.parent?.parent === root ? "1" : "0"
      )
      .style("display", (d) =>
        d.parent === root || d.parent?.parent === root ? "inline" : "none"
      )
      .style("font-size", (d) => `${Math.max(18, Math.min(24, d.r / 4))}px`)
      .style("font-family", "sans-serif")
      .each(function (this: SVGTextElement, d) {
        const textSel = d3.select<
          SVGTextElement,
          d3.HierarchyCircularNode<NodeDatum>
        >(this);
        const name = d.data.name;
        // 支援手動分行：\n 或 |
        const manualLines = name.split(/\n|\|/);
        if (manualLines.length > 1) {
          textSel.text(null);
          const lineHeightEm = 1.1;
          manualLines.forEach((ln, idx) => {
            textSel
              .append("tspan")
              .attr("x", 0)
              .attr("dy", idx === 0 ? "0em" : `${lineHeightEm}em`)
              .text(ln);
          });
          const tspans = textSel.selectAll<SVGTSpanElement, unknown>("tspan");
          const total = tspans.size();
          if (total > 1) {
            const offsetEm = -((total - 1) / 2) * lineHeightEm;
            let isFirst = true;
            tspans.each(function () {
              const span = this as SVGTSpanElement;
              span.setAttribute("x", "0");
              span.setAttribute(
                "dy",
                isFirst ? `${offsetEm}em` : `${lineHeightEm}em`
              );
              isFirst = false;
            });
          }
          return;
        }
        const words = name.split(/\s+/);
        // 如果沒有空白可切，就維持單行文字
        if (words.length <= 1) {
          textSel.text(name);
          return;
        }
        const lineHeightEm = 1.1;
        const maxWidth = Math.max(24, d.r * 1.6);
        textSel.text(null);
        let line: string[] = [];
        let tspan = textSel.append("tspan").attr("x", 0).attr("dy", "0em");
        for (const word of words) {
          line.push(word);
          tspan.text(line.join(" "));
          const len = (tspan.node() as SVGTextElement).getComputedTextLength();
          if (len > maxWidth && line.length > 1) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = textSel
              .append("tspan")
              .attr("x", 0)
              .attr("dy", `${lineHeightEm}em`)
              .text(word);
          }
        }
        // 垂直置中：將第一行往上偏移一半行數
        const tspans = textSel.selectAll<SVGTSpanElement, unknown>("tspan");
        const total = tspans.size();
        if (total > 1) {
          const offsetEm = -((total - 1) / 2) * lineHeightEm;
          let isFirst = true;
          tspans.each(function () {
            const span = this as SVGTSpanElement;
            span.setAttribute("x", "0");
            span.setAttribute(
              "dy",
              isFirst ? `${offsetEm}em` : `${lineHeightEm}em`
            );
            isFirst = false;
          });
        }
      });

    let focus: d3.HierarchyCircularNode<NodeDatum> = root;

    function zoomTo(v: [number, number, number]) {
      const k = width / v[2];
      label.attr("transform", (d) => {
        const x = (d.x - v[0]) * k;
        const y = (d.y - v[1]) * k;
        // 如果有子節點，將文字移到圓圈頂部
        if (d.children && d.children.length > 0) {
          const offsetY = -d.r * k * 0.7;
          return `translate(${x}, ${y + offsetY})`;
        }
        return `translate(${x}, ${y})`;
      });
      node.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );

      // Adapt scaling for different node types
      node
        .filter((d) => !d.data.isFrozen)
        .select("circle")
        .attr("r", (d) => d.r * k);

      const frozenNodes = node.filter((d) => d.data.isFrozen ?? false);
      // Update outer border (first path)
      frozenNodes
        .select("path:nth-child(2)")
        .attr(
          "transform",
          (d) => `scale(${((d.r * k * 2) / 55) * 1.2}) translate(-26.5, -27.5)`
        );
      // Update inner border (second path)
      frozenNodes
        .select("path:nth-child(3)")
        .attr(
          "transform",
          (d) => `scale(${((d.r * k * 2) / 55) * 1.13}) translate(-26.5, -27.5)`
        );
      frozenNodes.select("circle").attr("r", (d) => d.r * k);
    }

    // 將 view 轉換為 d3.ZoomTransform
    function viewToTransform(v: [number, number, number]): d3.ZoomTransform {
      const k = width / v[2];
      return d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(k)
        .translate(-v[0], -v[1]);
    }

    // 從 d3.ZoomTransform 更新視圖
    function applyZoomTransform(transform: d3.ZoomTransform) {
      const k = transform.k;
      const x = (width / 2 - transform.x) / k;
      const y = (height / 2 - transform.y) / k;
      const newView: [number, number, number] = [x, y, width / k];
      zoomTo(newView);
    }

    // 建立 d3-zoom behavior 用於程式化縮放動畫
    // 注意：我們不呼叫 svg.call(zoomBehavior) 來綁定事件監聽器，
    // 因為我們想禁用使用者的手動縮放（滾輪、拖曳），
    // 只保留程式化的點擊聚焦功能。
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10]) // 限制縮放範圍：最小 0.5 倍，最大 10 倍
      .on("zoom", (event) => {
        // 這個事件處理器只會在程式化縮放時被觸發
        applyZoomTransform(event.transform);
      });

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

      // 使用 d3-zoom 的程式化縮放
      svg
        .transition()
        .duration(isSlow ? 7500 : 750)
        .call(
          zoomBehavior.transform as (
            transition: d3.Transition<
              SVGSVGElement,
              undefined,
              null,
              undefined
            >,
            transform: d3.ZoomTransform
          ) => void,
          viewToTransform(targetView)
        )
        .on("end", () => {
          // 更新標籤顯示
          label
            .style("fill-opacity", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
              dd.parent === focus || dd === focus ? "1" : "0"
            )
            .style("display", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
              dd.parent === focus || dd === focus ? "inline" : "none"
            );
        });

      // 立即開始標籤過渡動畫
      label
        .transition()
        .duration(isSlow ? 7500 : 750)
        .style("fill-opacity", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
          dd.parent === focus || dd === focus ? "1" : "0"
        )
        .on(
          "start",
          function (
            this: SVGTextElement,
            dd: d3.HierarchyCircularNode<NodeDatum>
          ) {
            if (dd.parent === focus || dd === focus)
              this.style.display = "inline";
          }
        )
        .on(
          "end",
          function (
            this: SVGTextElement,
            dd: d3.HierarchyCircularNode<NodeDatum>
          ) {
            if (dd.parent !== focus && dd !== focus)
              this.style.display = "none";
          }
        );
    }

    // 設定初始視圖
    const initialView: [number, number, number] = [root.x, root.y, root.r * 2];
    zoomTo(initialView);

    // initial interactions
    svg.on("click", (event) => {
      // 防止在拖曳後觸發點擊
      if (event.defaultPrevented) return;
      zoom(event as unknown as MouseEvent, root);
    });

    node.on("click", (event, d) => {
      // 防止在拖曳後觸發點擊
      if (event.defaultPrevented) return;

      // 如果節點有 id，則導航到詳情頁
      if (d.data.id) {
        navigate(`/visualization/legislator/${d.data.id}`);
        event.stopPropagation();
        return;
      }
      // 否則執行 zoom 效果
      if (focus !== d) {
        zoom(event as unknown as MouseEvent, d);
        event.stopPropagation();
      }
    });

    // mount
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg.node() as SVGSVGElement);

    // cleanup
    return () => {
      svg.remove();
    };
  }, [root, width, height, color, navigate]);

  return (
    <div className="flex w-full items-center justify-center">
      <div ref={containerRef} />
    </div>
  );
};

export default CirclePackChart;
