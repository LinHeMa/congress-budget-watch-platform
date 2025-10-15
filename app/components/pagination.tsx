import {
  usePagination,
  usePaginationActions,
  useTotalPages,
  useHasNextPage,
  useHasPrevPage,
} from "~/stores/paginationStore";

type PaginationProps = {
  className?: string;
};

/**
 * 分頁導航元件
 * 
 * 與 Zustand paginationStore 整合，支援上一頁/下一頁/跳轉頁碼
 * 設計為可複用，在 BudgetTable 上下都可使用
 */
const Pagination: React.FC<PaginationProps> = ({ className = "" }) => {
  const { currentPage } = usePagination();
  const { setPage, nextPage, prevPage } = usePaginationActions();
  const totalPages = useTotalPages();
  const hasNext = useHasNextPage();
  const hasPrev = useHasPrevPage();

  // 如果只有一頁或沒有資料，不顯示分頁
  if (totalPages <= 1) return null;

  // 生成頁碼按鈕陣列（最多顯示 7 個按鈕）
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // 少於 7 頁：顯示所有頁碼
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 多於 7 頁：智慧顯示
      if (currentPage <= 3) {
        // 當前頁在前面：1 2 3 4 5 ... 10
        pages.push(1, 2, 3, 4, 5, "ellipsis-end", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 當前頁在後面：1 ... 6 7 8 9 10
        pages.push(1, "ellipsis-start", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // 當前頁在中間：1 ... 4 5 6 ... 10
        pages.push(
          1,
          "ellipsis-start",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis-end",
          totalPages
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label="分頁導航"
    >
      {/* 上一頁按鈕 */}
      <button
        onClick={prevPage}
        disabled={!hasPrev}
        className={`rounded border-2 border-black px-3 py-1 text-sm font-bold transition-colors ${
          hasPrev
            ? "bg-white hover:bg-gray-100 active:bg-gray-200"
            : "cursor-not-allowed bg-gray-200 text-gray-400"
        }`}
        aria-label="上一頁"
      >
        ← 上一頁
      </button>

      {/* 頁碼按鈕 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (typeof page === "string") {
            // 省略號
            return (
              <span
                key={`${page}-${index}`}
                className="px-2 text-gray-400"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => setPage(page)}
              disabled={isActive}
              className={`min-w-[36px] rounded border-2 px-2 py-1 text-sm font-bold transition-colors ${
                isActive
                  ? "border-[#3E51FF] bg-[#3E51FF] text-white cursor-default"
                  : "border-black bg-white hover:bg-gray-100 active:bg-gray-200"
              }`}
              aria-label={`第 ${page} 頁`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 下一頁按鈕 */}
      <button
        onClick={nextPage}
        disabled={!hasNext}
        className={`rounded border-2 border-black px-3 py-1 text-sm font-bold transition-colors ${
          hasNext
            ? "bg-white hover:bg-gray-100 active:bg-gray-200"
            : "cursor-not-allowed bg-gray-200 text-gray-400"
        }`}
        aria-label="下一頁"
      >
        下一頁 →
      </button>

      {/* 頁面資訊 */}
      <span className="ml-2 text-sm text-gray-600" aria-live="polite">
        第 {currentPage} / {totalPages} 頁
      </span>
    </nav>
  );
};

export default Pagination;
