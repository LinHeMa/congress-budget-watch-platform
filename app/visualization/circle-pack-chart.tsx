import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";

type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id?: string;
  children?: NodeDatum[];
};

const FAKE_DATA: NodeDatum = {
  name: "root",
  children: [
    {
      name: "徐巧芯\n中國國民黨\n999999萬",
      value: 999999,
      color: "#6B7FFF",
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
        `max-width: 100%; height: auto; display: block; cursor: pointer;`
      );

    const nodesData: d3.HierarchyCircularNode<NodeDatum>[] = root
      .descendants()
      .slice(1) as d3.HierarchyCircularNode<NodeDatum>[];

    const node = svg
      .append("g")
      .selectAll<SVGCircleElement, d3.HierarchyCircularNode<NodeDatum>>(
        "circle"
      )
      .data(nodesData)
      .join("circle")
      .attr(
        "fill",
        (d) => d.data.color ?? (d.children ? color(d.depth) : "white")
      )
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("pointer-events", (d) =>
        d.children || d.data.id ? "auto" : "none"
      )
      .style("cursor", (d) =>
        d.data.id ? "pointer" : d.children ? "pointer" : "default"
      )
      .on("mouseover", function () {
        d3.select(this).attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 1.5);
      });

    const label = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll<SVGTextElement, d3.HierarchyCircularNode<NodeDatum>>("text")
      .data(root.descendants() as d3.HierarchyCircularNode<NodeDatum>[])
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root || d.parent?.parent === root ? "1" : "0"))
      .style("display", (d) => (d.parent === root || d.parent?.parent === root ? "inline" : "none"))
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
    let view: [number, number, number];

    function zoomTo(v: [number, number, number]) {
      const k = width / v[2];
      view = v;
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
      node.attr("r", (d) => d.r * k);
    }

    function zoom(
      event: (MouseEvent & { altKey?: boolean }) | null,
      d: d3.HierarchyCircularNode<NodeDatum>
    ) {
      focus = d;
      const isSlow = Boolean(event?.altKey);
      const t = d3
        .transition()
        .duration(isSlow ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return (tt: number) => zoomTo(i(tt));
        });

      label
        .transition(t)
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

    // initial interactions
    svg.on("click", (event) => zoom(event as unknown as MouseEvent, root));

    node.on("click", (event, d) => {
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
    zoomTo([root.x, root.y, root.r * 2]);

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
