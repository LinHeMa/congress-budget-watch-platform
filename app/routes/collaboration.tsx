import BudgetHeader from "~/components/budget-header";

export function meta() {
  return [
    { title: "協作區 - 國會預算監督平台" },
    { name: "description", content: "加入協作，一起辨識預算提案" },
  ];
}

export default function Collaboration() {
  return (
    <>
      <BudgetHeader />
      <main className="min-h-screen bg-background p-5 md:p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
            協作區
          </h1>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg">
            歡迎加入協作行列，協助辨識預算提案掃描檔。
          </p>
          <div className="mt-8 rounded-lg border-2 border-gray-300 bg-white p-6">
            <p className="text-gray-600">
              此功能即將推出，敬請期待！
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
