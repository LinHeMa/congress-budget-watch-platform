/**
 * BudgetDetail 頁面的 Skeleton Loading 狀態
 * 模擬頁面實際結構，提供載入中的視覺回饋
 */
const BudgetDetailSkeleton = ({ isDesktop }: { isDesktop: boolean }) => {
  if (isDesktop) {
    return (
      <div className="pb-8 text-sm">
        <div className="mx-2.5 flex flex-col md:mx-8">
          {/* Back link skeleton */}
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200" />

          <div className="relative mt-6">
            {/* Shadow box */}
            <div className="absolute h-full w-full translate-x-3 -translate-y-3 rounded-lg border-2 bg-[#C1C1C1]" />

            {/* Main content box */}
            <div className="relative flex flex-col rounded-lg border-2 bg-[#F6F6F6] p-5 pb-30">
              {/* ID section skeleton */}
              <div className="mb-4 flex gap-5 border-b-2 p-3">
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="flex flex-col gap-y-10">
                {/* Row 1: Basic info */}
                <section className="flex gap-x-8">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex-1">
                      <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                      <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </section>

                {/* Row 2: Timeline and merged proposals */}
                <section className="flex gap-x-8">
                  <div className="w-1/3">
                    <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="h-16 animate-pulse rounded bg-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                    <div className="h-32 animate-pulse rounded bg-gray-200" />
                  </div>
                </section>

                {/* Row 3: Proposal content */}
                <section>
                  <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  </div>
                </section>

                {/* Row 4: Budget amounts */}
                <section className="flex gap-x-8">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex-1">
                      <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                      <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile skeleton
  return (
    <div className="mx-2.5 flex flex-col">
      {/* Back link skeleton */}
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200" />

      <div className="mt-2 border-2 px-2 py-3">
        {/* ID section */}
        <section className="mb-4 flex gap-6">
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
        </section>

        {/* Basic info sections */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="mb-4">
            <div className="mb-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            {idx % 2 === 0 && (
              <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetDetailSkeleton
