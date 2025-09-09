import { createStore } from "zustand";

interface BudgetSelectProps {
  selectedValue: string;
  searchedValue: string;
  visible: boolean;
  // 排序相關
  selectedSort: string;
}

interface BudgetSelectState extends BudgetSelectProps {
  setSearchedValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  toggleVisible: () => void;
  setSelectedSort: (value: string) => void;
  resetToDefault: () => void;
}

/**
 * Default props for the budget selector store
 */
const DEFAULT_PROPS: BudgetSelectProps = {
  selectedValue: "all",
  searchedValue: "",
  visible: true,
  selectedSort: "projectName-asc",
};

/**
 * Creates a budget selector store with optional initial props
 * Following Zustand's initialize-state-with-props pattern
 *
 * @param initProps - Optional initial props to override defaults
 * @returns Zustand store instance
 */
export const createBudgetSelectStore = (
  initProps: Partial<BudgetSelectProps> = {}
) => {
  const props = { ...DEFAULT_PROPS, ...initProps };

  return createStore<BudgetSelectState>()((set, get) => ({
    // Initialize state with props
    ...props,

    // Actions
    setSelectedValue: (value: string) =>
      set((state) => ({ ...state, selectedValue: value })),

    setSearchedValue: (value: string) =>
      set((state) => ({ ...state, searchedValue: value })),

    toggleVisible: () =>
      set((state) => ({ ...state, visible: !state.visible })),

    setSelectedSort: (value: string) =>
      set((state) => ({ ...state, selectedSort: value })),

    resetToDefault: () =>
      set((state) => ({
        ...state,
        selectedValue: DEFAULT_PROPS.selectedValue,
      })),
  }));
};

/**
 * Budget selector store type
 */
export type BudgetSelectStore = ReturnType<typeof createBudgetSelectStore>;

// Export default store instance for backward compatibility
const defaultBudgetSelectStore = createBudgetSelectStore();
export default defaultBudgetSelectStore;
