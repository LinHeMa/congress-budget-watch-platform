## Feats

1. 透過GQL fetch 包含關鍵字的內容，
   條件的example可能會長這樣，你可以再幫我看看有沒有缺漏（中央應該要替換為使用者input的關鍵字）:
    ```gql
        {
    "where": {
        "OR": [
        {
            "reason": {
            "contains": "中央"
            }
        },
        {
            "description": {
            "contains": "中央"
            }
        },
        {
            "government": {
            "name": {
                "contains": "中央"
            }
            }
        },
        {
            "proposers": {
            "every": {
                "name": {
                "contains": "中央"
                }
            }
            }
        }
        ],
    }
    }
    ```
2. 搭配使用 react-query and zustand
3. select 用 peopleList.name
4. select選擇完之後在去filter `all-budgets`的資料，filter 部會的欄位。
5. 篩選完之後要保持排序，排序功能請參考`app/components/sort-toolbar.tsx`
6. 搜尋關鍵字來源 `app/components/budgets-selector.tsx`的
    ```tsx
    <input
        type="search"
        placeholder="搜尋"
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        className="rounded-sm border-2 bg-white text-center md:w-80"
    />
    ```

## Reminders

1. 不用run pnpm dev
2. 不要破壞現有的邏輯
3. 不要破壞現有的排版
4. 指令請使用pnpm
5. 請檢查效能

## Doc
1. https://dev.to/alais29dev/building-a-real-time-search-filter-in-react-a-step-by-step-guide-3lmm
