const BudgetHeader = () => {
  return (
    <div
      className="flex justify-between sticky border-t-[12px] border-t-[#3E51FF]
      pt-2 px-3
    "
    >
      <button>
        <img
          src="/image/readr-header.svg"
          height={28}
          width={92}
          alt="Readr logo"
        />
      </button>
      <button>
        <img
          src="/icon/share-header.svg"
          height={20}
          width={20}
          alt="Readr header share button"
        />
      </button>
    </div>
  );
};

export default BudgetHeader;
