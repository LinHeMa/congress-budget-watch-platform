## Feats

1. 請你幫我新增這兩個component然後要符合：「maintainable way while ensuring flexibility and separation of concerns」
2. 這兩個component是我從既有的專案複製，請你理解他的運作原理，並且改寫成符合react pattern的，狀態管理就統一都使用zustand
3. 用好之後可以套用在首頁

## Example

1. Header Component

```tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const BudgetHeader = () => {
  return (
    <div className="sticky flex justify-between border-t-[12px] border-t-[#3E51FF] px-3 pt-2">
      <Button>
        <Image
          src="/image/readr-header.svg"
          height={28}
          width={92}
          alt="Readr logo"
        />
      </Button>
      <Button>
        <Image
          src="/icon/share-header.svg"
          height={20}
          width={20}
          alt="Readr header share button"
        />
      </Button>
    </div>
  );
};

export default BudgetHeader;
```

2. progress bar

```tsx
import Image from "next/image";
import React from "react";

type ProgressBarProps {
  isFinished?: boolean;
  count?: number;
  width?: number;
  height?: number;
  gap?: number;
  className?: string;
  labels?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  isFinished = true,
  count = 3,
  width = 165,
  height = 48,
  gap = 16,
  className = "",
  labels = [],
}) => {
  const progressBoxType = isFinished
    ? "/image/progress-box.svg"
    : "/image/not-finished-progress-box.svg";

  const baseZIndex = 90;

  const totalHeight = height + (height - gap) * (count - 1);

  return (
    <section
      className={`relative ${className}`}
      style={{ height: totalHeight }}
    >
      <Image
        src="/image/eye.svg"
        alt="eye icon"
        height={28}
        width={72}
        className="absolute -top-[14px] -right-[38px] z-99"
      ></Image>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: index * (height - gap),
            zIndex: baseZIndex - index * 10,
          }}
        >
          <Image
            src={progressBoxType}
            height={height}
            width={width}
            alt={`progress box ${index + 1}`}
          />
          {labels[index] && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                marginTop: index > 0 ? 7 : 0,
              }}
            >
              <span className="px-2 text-center text-sm font-bold text-white">
                {labels[index]}
              </span>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default ProgressBar;
```

## Docs

1. https://dev.to/neetigyachahar/architecture-guide-building-scalable-react-or-react-native-apps-with-zustand-react-query-1nn4
