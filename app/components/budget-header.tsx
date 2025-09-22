import Image from "./image";

const BudgetHeader = () => {
  return (
    <div className="sticky flex justify-between border-t-[12px] border-t-[#3E51FF] px-3 pt-2">
      <button>
        <Image
          src="/image/readr-header.svg"
          alt="Readr logo"
          className="h-[28px] w-[92px]"
        />
      </button>
      <button>
        <Image
          src="/icon/share-header.svg"
          alt="Readr header share button"
          className="h-[20px] w-[20px]"
        />
      </button>
    </div>
  );
};

export default BudgetHeader;
