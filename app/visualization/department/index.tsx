import CirclePackChart from "../circle-pack-chart";
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
      value: 3,
      color: "#6B7FFF",
      isFrozen: false,
      id: "1-14-1-05-024-7990",
    },
    {
      name: "賴士葆",
      value: 2,
      color: "#00CD26",
      id: "1-14-1-05-024-7991",
    },
    {
      name: "羅明才",
      value: 2,
      color: "#6B7FFF",
      id: "1-14-1-05-024-7992",
    },
    {
      name: "顏寬恒",
      value: 1,
      color: "#6B7FFF",
      id: "1-14-1-05-024-7992",
    },
  ],
};

const DepartmentChart = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8">
      <div className="flex flex-col items-center justify-center gap-y-5 font-bold">
        <p>全部</p>
        <CirclePackChart data={FAKE_DATA} />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-5 font-bold">
        <p>OOOO署</p>
        <CirclePackChart data={FAKE_DATA} />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-5 font-bold">
        <p>OOOO署</p>
        <CirclePackChart data={FAKE_DATA} />
      </div>
    </div>
  );
};

export default DepartmentChart;
