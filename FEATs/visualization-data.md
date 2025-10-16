## Feats
1. use GQL to replace the mock data
2. remove mock data
3. use react-query, zustand and GQL 
4. visualiztion data should look like this:
```ts
    type NodeDatum = {
    name: string;
    value?: number;
    color?: string;
    id?: string;
    isFrozen?: boolean;
    children?: NodeDatum[];
    };
```
應該要把資料mapping成這個格式，保持immutable
5. 先修改`/visualization`的頁面就好
## Reminders
1. 不用run pnpm dev
2. 不要破壞現有的邏輯
3. 不要破壞現有的排版
4. pnpm

