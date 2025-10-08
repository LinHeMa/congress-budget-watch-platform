import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";

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
        `max-width: 100%; height: auto; display: block; cursor: pointer;`
      );

    const nodesData: d3.HierarchyCircularNode<NodeDatum>[] = root
      .descendants()
      .slice(1) as d3.HierarchyCircularNode<NodeDatum>[];

    const frozenPathD =
      "M48.1015 31.8791L49.8978 32.7583V32.7583L48.1015 31.8791ZM46.8484 34.4393L45.052 33.5601V33.5601L46.8484 34.4393ZM46.1032 37.4436L44.1067 37.3255V37.3255L46.1032 37.4436ZM45.9096 40.7155L47.9061 40.8336L45.9096 40.7155ZM45.716 43.9873L43.7194 43.8692V43.8692L45.716 43.9873ZM44.2661 46.5668L43.1619 44.8992H43.1619L44.2661 46.5668ZM41.6452 48.3021L42.7494 49.9697L41.6452 48.3021ZM39.0244 50.0375L37.9202 48.3699L37.9202 48.3699L39.0244 50.0375ZM36.1323 51.2672L35.7068 49.313H35.7068L36.1323 51.2672ZM33.1389 51.9189L33.5644 53.8731H33.5644L33.1389 51.9189ZM30.1456 52.5706L29.7201 50.6164H29.7201L30.1456 52.5706ZM27.1008 52.6178L27.4779 50.6537H27.4779L27.1008 52.6178ZM24.1837 52.0578L23.8066 54.0219H23.8066L24.1837 52.0578ZM21.2665 51.4978L21.6436 49.5336L21.6436 49.5336L21.2665 51.4978ZM18.2658 50.7785L18.8184 48.8564H18.8184L18.2658 50.7785ZM15.3578 49.9424L14.8052 51.8645H14.8052L15.3578 49.9424ZM12.4499 49.1062L13.0026 47.1841H13.0026L12.4499 49.1062ZM10.5825 47.0573L12.5323 46.6122L10.5825 47.0573ZM9.86531 43.9161L7.91548 44.3613L9.86531 43.9161ZM9.14816 40.7749L11.098 40.3298L9.14816 40.7749ZM7.74052 38.0988L9.16798 36.698H9.16798L7.74052 38.0988ZM5.72517 36.0452L4.29771 37.446L4.29771 37.446L5.72517 36.0452ZM3.70982 33.9915L5.13729 32.5907H5.13729L3.70982 33.9915ZM2.71336 31.4683L0.714176 31.4113L2.71336 31.4683ZM2.79441 28.6239L4.7936 28.6808L2.79441 28.6239ZM2.87545 25.7795L0.876261 25.7225V25.7225L2.87545 25.7795ZM3.61457 23.0725L1.87078 22.0931H1.87078L3.61457 23.0725ZM4.9683 20.6622L6.71209 21.6416H6.71209L4.9683 20.6622ZM6.32202 18.2519L4.57823 17.2725L4.57823 17.2725L6.32202 18.2519ZM7.56908 15.5629L5.69938 14.8528H5.69938L7.56908 15.5629ZM8.63612 12.7533L10.5058 13.4633L8.63612 12.7533ZM9.70315 9.94366L7.83345 9.23358V9.23358L9.70315 9.94366ZM11.8133 8.35733L11.6359 6.36521L11.8133 8.35733ZM14.8424 8.08757L15.0198 10.0797L14.8424 8.08757ZM17.8715 7.81781L17.6941 5.82569L17.6941 5.82569L17.8715 7.81781ZM20.7897 6.67352L19.5996 5.06615L19.5996 5.06615L20.7897 6.67352ZM23.4254 4.72201L24.6155 6.32938L24.6156 6.32938L23.4254 4.72201ZM26.0612 2.77051L24.871 1.16314V1.16314L26.0612 2.77051ZM28.7308 2.75406L27.5269 4.35112L27.5269 4.35112L28.7308 2.75406ZM31.2772 4.67362L32.4811 3.07655L32.4811 3.07655L31.2772 4.67362ZM33.8237 6.59319L32.6198 8.19026L32.6198 8.19026L33.8237 6.59319ZM36.1795 8.46644L34.8867 9.99248V9.99248L36.1795 8.46644ZM38.206 10.1832L39.4988 8.65714V8.65714L38.206 10.1832ZM40.2326 11.8999L38.9398 13.426V13.426L40.2326 11.8999ZM42.8291 13.5337L41.9597 15.3349L42.8291 13.5337ZM45.8428 14.9885L46.7122 13.1873L45.8428 14.9885ZM48.8565 16.4432L47.9871 18.2444L47.9871 18.2444L48.8565 16.4432ZM50.138 18.8352L48.1647 18.5096V18.5096L50.138 18.8352ZM49.612 22.0237L51.5853 22.3493V22.3493L49.612 22.0237ZM49.0859 25.2122L47.1126 24.8866V24.8866L49.0859 25.2122ZM49.0164 27.0494L47.6265 28.4876L47.6265 28.4876L49.0164 27.0494ZM49.4075 27.4274L50.7973 25.9892L50.7973 25.9892L49.4075 27.4274ZM49.7985 27.8053L48.4087 29.2435L48.4087 29.2435L49.7985 27.8053ZM49.3545 29.3189L47.5581 28.4397V28.4397L49.3545 29.3189ZM48.1015 31.8791L46.3051 30.9999L45.052 33.5601L46.8484 34.4393L48.6448 35.3185L49.8978 32.7583L48.1015 31.8791ZM46.8484 34.4393L45.052 33.5601C44.4891 34.7102 44.1865 35.9767 44.1067 37.3255L46.1032 37.4436L48.0997 37.5618C48.1528 36.6633 48.3471 35.9268 48.6448 35.3185L46.8484 34.4393ZM46.1032 37.4436L44.1067 37.3255L43.9131 40.5973L45.9096 40.7155L47.9061 40.8336L48.0997 37.5618L46.1032 37.4436ZM45.9096 40.7155L43.9131 40.5973L43.7194 43.8692L45.716 43.9873L47.7125 44.1054L47.9061 40.8336L45.9096 40.7155ZM45.716 43.9873L43.7194 43.8692C43.6883 44.3962 43.5117 44.6676 43.1619 44.8992L44.2661 46.5668L45.3703 48.2343C46.8206 47.274 47.6107 45.8258 47.7125 44.1054L45.716 43.9873ZM44.2661 46.5668L43.1619 44.8992L40.5411 46.6346L41.6452 48.3021L42.7494 49.9697L45.3703 48.2343L44.2661 46.5668ZM41.6452 48.3021L40.5411 46.6346L37.9202 48.3699L39.0244 50.0375L40.1286 51.7051L42.7494 49.9697L41.6452 48.3021ZM39.0244 50.0375L37.9202 48.3699C37.2212 48.8328 36.4864 49.1432 35.7068 49.313L36.1323 51.2672L36.5577 53.2214C37.8341 52.9435 39.0275 52.4342 40.1286 51.7051L39.0244 50.0375ZM36.1323 51.2672L35.7068 49.313L32.7135 49.9647L33.1389 51.9189L33.5644 53.8731L36.5577 53.2214L36.1323 51.2672ZM33.1389 51.9189L32.7135 49.9647L29.7201 50.6164L30.1456 52.5706L30.5711 54.5248L33.5644 53.8731L33.1389 51.9189ZM30.1456 52.5706L29.7201 50.6164C28.9478 50.7845 28.2059 50.7935 27.4779 50.6537L27.1008 52.6178L26.7238 54.582C27.9994 54.8269 29.2875 54.8043 30.5711 54.5248L30.1456 52.5706ZM27.1008 52.6178L27.4779 50.6537L24.5608 50.0937L24.1837 52.0578L23.8066 54.0219L26.7238 54.582L27.1008 52.6178ZM24.1837 52.0578L24.5608 50.0937L21.6436 49.5336L21.2665 51.4978L20.8895 53.4619L23.8066 54.0219L24.1837 52.0578ZM21.2665 51.4978L21.6436 49.5336C20.702 49.3528 19.7603 49.1272 18.8184 48.8564L18.2658 50.7785L17.7131 52.7006C18.7686 53.0041 19.8274 53.258 20.8895 53.4619L21.2665 51.4978ZM18.2658 50.7785L18.8184 48.8564L15.9105 48.0203L15.3578 49.9424L14.8052 51.8645L17.7131 52.7006L18.2658 50.7785ZM15.3578 49.9424L15.9105 48.0203L13.0026 47.1841L12.4499 49.1062L11.8972 51.0284L14.8052 51.8645L15.3578 49.9424ZM12.4499 49.1062L13.0026 47.1841C12.8135 47.1298 12.744 47.0663 12.7122 47.0314C12.6753 46.9909 12.5938 46.8816 12.5323 46.6122L10.5825 47.0573L8.63262 47.5025C8.8174 48.3118 9.17031 49.0834 9.75588 49.7259C10.3465 50.3739 11.0876 50.7956 11.8972 51.0284L12.4499 49.1062ZM10.5825 47.0573L12.5323 46.6122L11.8151 43.471L9.86531 43.9161L7.91548 44.3613L8.63262 47.5025L10.5825 47.0573ZM9.86531 43.9161L11.8151 43.471L11.098 40.3298L9.14816 40.7749L7.19833 41.2201L7.91548 44.3613L9.86531 43.9161ZM9.14816 40.7749L11.098 40.3298C10.7795 38.9347 10.1495 37.6981 9.16798 36.698L7.74052 38.0988L6.31305 39.4997C6.71586 39.9101 7.02426 40.4576 7.19833 41.2201L9.14816 40.7749ZM7.74052 38.0988L9.16798 36.698L7.15264 34.6443L5.72517 36.0452L4.29771 37.446L6.31305 39.4997L7.74052 38.0988ZM5.72517 36.0452L7.15264 34.6443L5.13729 32.5907L3.70982 33.9915L2.28236 35.3923L4.29771 37.446L5.72517 36.0452ZM3.70982 33.9915L5.13729 32.5907C4.82113 32.2685 4.7004 31.9518 4.71255 31.5252L2.71336 31.4683L0.714176 31.4113C0.670666 32.9384 1.21424 34.3039 2.28236 35.3923L3.70982 33.9915ZM2.71336 31.4683L4.71255 31.5252L4.7936 28.6808L2.79441 28.6239L0.795218 28.5669L0.714176 31.4113L2.71336 31.4683ZM2.79441 28.6239L4.7936 28.6808L4.87464 25.8364L2.87545 25.7795L0.876261 25.7225L0.795218 28.5669L2.79441 28.6239ZM2.87545 25.7795L4.87464 25.8364C4.89353 25.1733 5.05674 24.5889 5.35836 24.0519L3.61457 23.0725L1.87078 22.0931C1.24257 23.2116 0.913033 24.4319 0.876261 25.7225L2.87545 25.7795ZM3.61457 23.0725L5.35836 24.0519L6.71209 21.6416L4.9683 20.6622L3.22451 19.6828L1.87078 22.0931L3.61457 23.0725ZM4.9683 20.6622L6.71209 21.6416L8.06581 19.2313L6.32202 18.2519L4.57823 17.2725L3.22451 19.6828L4.9683 20.6622ZM6.32202 18.2519L8.06581 19.2313C8.58331 18.3099 9.04011 17.3227 9.43878 16.2729L7.56908 15.5629L5.69938 14.8528C5.36514 15.7329 4.99056 16.5383 4.57823 17.2725L6.32202 18.2519ZM7.56908 15.5629L9.43878 16.2729L10.5058 13.4633L8.63612 12.7533L6.76641 12.0432L5.69938 14.8528L7.56908 15.5629ZM8.63612 12.7533L10.5058 13.4633L11.5729 10.6537L9.70315 9.94366L7.83345 9.23358L6.76641 12.0432L8.63612 12.7533ZM9.70315 9.94366L11.5729 10.6537C11.6455 10.4625 11.7068 10.4224 11.7073 10.422C11.7092 10.4206 11.7718 10.3689 11.9907 10.3494L11.8133 8.35733L11.6359 6.36521C10.8144 6.43837 10.0052 6.69739 9.30372 7.22476C8.60086 7.75314 8.12728 8.45989 7.83345 9.23358L9.70315 9.94366ZM11.8133 8.35733L11.9907 10.3494L15.0198 10.0797L14.8424 8.08757L14.665 6.09545L11.6359 6.36521L11.8133 8.35733ZM14.8424 8.08757L15.0198 10.0797L18.0489 9.80992L17.8715 7.81781L17.6941 5.82569L14.665 6.09545L14.8424 8.08757ZM17.8715 7.81781L18.0489 9.80992C19.4845 9.68208 20.803 9.15225 21.9798 8.28089L20.7897 6.67352L19.5996 5.06615C18.9661 5.53522 18.3391 5.76825 17.6941 5.82569L17.8715 7.81781ZM20.7897 6.67352L21.9798 8.28089L24.6155 6.32938L23.4254 4.72201L22.2353 3.11464L19.5996 5.06615L20.7897 6.67352ZM23.4254 4.72201L24.6156 6.32938L27.2513 4.37788L26.0612 2.77051L24.871 1.16314L22.2353 3.11464L23.4254 4.72201ZM26.0612 2.77051L27.2513 4.37788C27.3539 4.30186 27.4178 4.2733 27.4418 4.26427C27.462 4.25663 27.4516 4.2635 27.4198 4.2637C27.3873 4.2639 27.3697 4.25694 27.3771 4.25966C27.3883 4.26382 27.4386 4.28462 27.5269 4.35112L28.7308 2.75406L29.9347 1.15699C29.2297 0.625612 28.372 0.257752 27.3951 0.263773C26.4249 0.269753 25.5733 0.643149 24.871 1.16314L26.0612 2.77051ZM28.7308 2.75406L27.5269 4.35112L30.0733 6.27069L31.2772 4.67362L32.4811 3.07655L29.9347 1.15699L28.7308 2.75406ZM31.2772 4.67362L30.0733 6.27069L32.6198 8.19026L33.8237 6.59319L35.0276 4.99612L32.4811 3.07655L31.2772 4.67362ZM33.8237 6.59319L32.6198 8.19026C33.4698 8.83103 34.2247 9.43167 34.8867 9.99248L36.1795 8.46644L37.4722 6.9404C36.7422 6.32203 35.9266 5.67384 35.0276 4.99612L33.8237 6.59319ZM36.1795 8.46644L34.8867 9.99248L36.9133 11.7092L38.206 10.1832L39.4988 8.65714L37.4722 6.94039L36.1795 8.46644ZM38.206 10.1832L36.9133 11.7092L38.9398 13.426L40.2326 11.8999L41.5253 10.3739L39.4988 8.65714L38.206 10.1832ZM40.2326 11.8999L38.9398 13.426C39.793 14.1487 40.8099 14.7799 41.9597 15.3349L42.8291 13.5337L43.6985 11.7326C42.7782 11.2883 42.0641 10.8303 41.5253 10.3739L40.2326 11.8999ZM42.8291 13.5337L41.9597 15.3349L44.9734 16.7896L45.8428 14.9885L46.7122 13.1873L43.6985 11.7326L42.8291 13.5337ZM45.8428 14.9885L44.9734 16.7896L47.9871 18.2444L48.8565 16.4432L49.726 14.6421L46.7122 13.1873L45.8428 14.9885ZM48.8565 16.4432L47.9871 18.2444C48.1083 18.3029 48.1684 18.3494 48.1917 18.37C48.212 18.388 48.2036 18.3855 48.1902 18.3604C48.1765 18.3347 48.1751 18.3184 48.1763 18.3281C48.1781 18.3419 48.1831 18.3983 48.1647 18.5096L50.138 18.8352L52.1114 19.1608C52.2568 18.2794 52.1816 17.3403 51.7161 16.4714C51.2545 15.6098 50.5207 15.0257 49.726 14.6421L48.8565 16.4432ZM50.138 18.8352L48.1647 18.5096L47.6387 21.6981L49.612 22.0237L51.5853 22.3493L52.1114 19.1608L50.138 18.8352ZM49.612 22.0237L47.6387 21.6981L47.1126 24.8866L49.0859 25.2122L51.0592 25.5378L51.5853 22.3493L49.612 22.0237ZM49.0859 25.2122L47.1126 24.8866C47.0176 25.4621 46.9508 25.9857 46.9345 26.4171C46.9265 26.6272 46.9271 26.8896 46.9672 27.1578C46.9913 27.3183 47.0861 27.9654 47.6265 28.4876L49.0164 27.0494L50.4062 25.6113C50.6726 25.8687 50.793 26.136 50.8435 26.2692C50.8978 26.4124 50.9167 26.5223 50.9231 26.5654C50.9355 26.6481 50.9279 26.6646 50.9316 26.5684C50.9384 26.3874 50.9735 26.0573 51.0592 25.5378L49.0859 25.2122ZM49.0164 27.0494L47.6265 28.4876L48.0176 28.8656L49.4075 27.4274L50.7973 25.9892L50.4062 25.6113L49.0164 27.0494ZM49.4075 27.4274L48.0176 28.8656L48.4087 29.2435L49.7985 27.8053L51.1884 26.3671L50.7973 25.9892L49.4075 27.4274ZM49.7985 27.8053L48.4087 29.2435C48.1177 28.9622 47.9775 28.6487 47.9123 28.42C47.8496 28.1999 47.8448 28.0224 47.8468 27.9297C47.8506 27.7557 47.8845 27.6658 47.8691 27.718C47.8434 27.8057 47.7582 28.0309 47.5581 28.4397L49.3545 29.3189L51.1509 30.1981C51.3812 29.7276 51.5851 29.2609 51.7074 28.8441C51.766 28.6441 51.8387 28.3488 51.8459 28.0161C51.8516 27.7489 51.8276 26.9849 51.1884 26.3671L49.7985 27.8053ZM49.3545 29.3189L47.5581 28.4397L46.3051 30.9999L48.1015 31.8791L49.8978 32.7583L51.1509 30.1981L49.3545 29.3189Z";

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
      .attr("d", frozenPathD)
      .attr("fill", "#FF43D3")
      .attr(
        "transform",
        (d) => `scale(${((d.r * 2) / 55) * 1.2}) translate(-26.5, -27.5)`
      );

    // Layer 2: Inner border (same color as circle) - creates the thin border effect
    frozenNodes
      .append("path")
      .attr("d", frozenPathD)
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
