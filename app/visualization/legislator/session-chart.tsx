import CirclePackChart from "../circle-pack-chart";

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
      name: "#999999\n台灣自來水\n股份有限公司\n999999萬",
      value: 999999,
      color: "#6B7FFF",
      id: "1-14-1-05-024-7990",
      children: [
        {
          name: "#999999\n台灣自來水\n股份有限公司\n999999萬",
          value: 999999,
          color: "#6B7FFF",
          id: "1-14-1-05-024-7991",
        },
        {
          name: "#999999\n台灣自來水\n股份有限公司\n999999萬",
          value: 999999,
          color: "#6B7FFF",
          id: "1-14-1-05-024-7991",
        },
      ],
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

const SessionChart = () => {
  return (
    <>
      <div className="mb-2 flex w-full flex-col items-start justify-center border-b-1">
        <div className="flex flex-col items-start justify-center">
          <p>第OO屆</p>
          <p>OOOO委員會</p>
        </div>
        <div>
          <CirclePackChart data={FAKE_DATA} padding={8} />
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-center border-b-1">
        <div className="flex flex-col items-start justify-center">
          <p>第OO屆</p>
          <p>OOOO委員會</p>
        </div>
        <div>
          <CirclePackChart data={FAKE_DATA} padding={8} />
        </div>
      </div>
    </>
  );
};

export default SessionChart;
