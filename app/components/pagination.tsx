import {
  usePagination,
  usePaginationActions,
  useTotalPages,
  useHasNextPage,
  useHasPrevPage,
} from "~/stores/paginationStore";
import Image from "./image";

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

  // 生成頁碼按鈕陣列（最多顯示 6 個按鈕）
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 6;

    // 少於 6 頁：顯示所有頁碼
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // 多於 6 頁的情況，先加入第一頁
    pages.push(1);

    // 當前頁在前面：1 2 3 4 ... N
    if (currentPage <= 3) {
      pages.push(2, 3, 4, "ellipsis-end", totalPages);
      return pages;
    }

    // 當前頁在後面：1 ... N-3 N-2 N-1 N
    if (currentPage >= totalPages - 2) {
      pages.push(
        "ellipsis-start",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
      return pages;
    }

    // 當前頁在中間：1 ... c-1 c ... N
    pages.push(
      "ellipsis-start",
      currentPage - 1,
      currentPage,
      "ellipsis-end",
      totalPages
    );
    
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
        className={`px-3 py-1 text-sm font-bold transition-colors ${
          hasPrev
            ? "hover:bg-gray-100 active:bg-gray-200"
            : "cursor-not-allowed text-gray-400"
        }`}
        aria-label="上一頁"
      >
        <Image src="/icon/icon-left-chevron.svg" alt="上一頁" />
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
              className={`min-w-[36px] rounded-full border-2 px-2 py-1 text-sm font-bold transition-colors ${
                isActive
                  ? "cursor-default border-black bg-[#3E51FF] text-white"
                  : "border-black bg-transparent hover:bg-gray-100 active:bg-gray-200"
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
        className={`px-3 py-1 text-sm font-bold transition-colors ${
          hasNext
            ? "hover:bg-gray-100 active:bg-gray-200"
            : "cursor-not-allowed text-gray-400"
        }`}
        aria-label="下一頁"
      >
        <Image src="/icon/icon-right-chevron.svg" alt="下一頁" />
      </button>

    </nav>
  );
};

export default Pagination;
