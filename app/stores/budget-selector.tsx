import { createStore } from "zustand";

type DepartmentFilter = {
  category: string | null;
  departmentId: string | null;
};

type BudgetSelectProps = {
  selectedValue: string;
  searchedValue: string;
  visible: boolean;
  // 排序相關
  selectedSort: string;
  departmentFilter: DepartmentFilter;
};

type BudgetSelectState = BudgetSelectProps & {
  setSearchedValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  toggleVisible: () => void;
  setSelectedSort: (value: string) => void;
  resetToDefault: () => void;
  setDepartmentCategory: (category: string | null) => void;
  setDepartmentId: (id: string | null) => void;
  clearDepartmentFilter: () => void;
};

/**
 * Default props for the budget selector store
 */
const DEFAULT_PROPS: BudgetSelectProps = {
  selectedValue: "all",
  searchedValue: "",
  visible: true,
  selectedSort: "id-asc",
  departmentFilter: { category: null, departmentId: null },
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

  return createStore<BudgetSelectState>()((set, _get) => ({
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

    setDepartmentCategory: (category: string | null) =>
      set((state) => ({
        ...state,
        departmentFilter: {
          category,
          departmentId: null, // 重置第二階段選擇
        },
      })),

    setDepartmentId: (id: string | null) =>
      set((state) => ({
        ...state,
        departmentFilter: {
          ...state.departmentFilter,
          departmentId: id,
        },
      })),

    clearDepartmentFilter: () =>
      set((state) => ({
        ...state,
        departmentFilter: {
          category: null,
          departmentId: null,
        },
      })),

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
