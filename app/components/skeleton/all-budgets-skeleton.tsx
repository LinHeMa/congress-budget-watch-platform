const AllBudgetsSkeleton = ({ isDesktop }: { isDesktop: boolean }) => {
  // 顯示 6 個 skeleton 項目
  const skeletonCount = 6;

  return (
    <div className="p-5 md:mx-auto md:max-w-[720px] md:p-0 md:pt-8 lg:max-w-[960px]">
      {/* Title skeleton */}
      <div className="mb-3 flex w-full justify-center">
        <div className="h-7 w-64 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Desktop progress skeleton */}
      <div className="mb-5 hidden h-fit w-full items-center justify-center md:flex">
        <div className="h-48 w-[165px] animate-pulse rounded bg-gray-200" />
      </div>

      {/* Progress toggle skeleton */}
      <div className="relative mb-5 hidden items-center justify-start border-b-[2px] border-black md:flex">
        <div className="h-10 w-32 animate-pulse rounded-t-md bg-gray-200" />
      </div>

      {/* Mobile progress section skeleton */}
      <div className="mb-3 h-0.5 w-full bg-black md:hidden" />
      <div className="mb-5 flex items-center justify-center border-b-[2px] border-black md:hidden">
        <div className="h-10 w-32 animate-pulse rounded-t-md bg-gray-200" />
      </div>
      <div className="mb-5 flex h-fit w-full items-center justify-center md:hidden">
        <div className="h-48 w-[165px] animate-pulse rounded bg-gray-200" />
      </div>

      {/* Budgets selector skeleton */}
      <div className="h-0.5 w-full bg-black md:hidden" />
      <div className="mb-4 flex items-center justify-end py-3">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="h-0.5 w-full bg-black md:hidden" />

      {/* Sort toolbar skeleton */}
      <div className="flex items-center justify-end pt-3">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="h-0.5 w-full bg-black md:hidden" />

      {/* Table skeleton */}
      <div className="mt-4 space-y-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div key={idx}>
            {isDesktop ? (
              // Desktop skeleton
              <div className="rounded border-2 border-gray-200 p-4">
                <div className="mb-3 h-6 w-full animate-pulse rounded bg-gray-200" />
                <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            ) : (
              // Mobile skeleton
              <div className="flex flex-col border-b-2 border-gray-200 pb-4">
                <div className="mb-3 h-6 w-full animate-pulse rounded bg-gray-200" />
                <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBudgetsSkeleton;
