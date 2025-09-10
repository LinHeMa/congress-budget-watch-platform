import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Header state interface
 */
interface HeaderState {
  isShareModalOpen: boolean;
}

/**
 * Progress state interface
 */
interface ProgressState {
  currentStep: number;
  isComplete: boolean;
}

/**
 * UI Store actions interface
 */
interface UIActions {
  // Header actions
  toggleShareModal: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;

  // Progress actions
  updateProgressStep: (step: number) => void;
  markProgressComplete: () => void;
  resetProgress: () => void;

  // Combined actions
  resetUI: () => void;
}

/**
 * Complete UI Store state interface
 */
interface UIState {
  headerState: HeaderState;
  progressState: ProgressState;
  actions: UIActions;
}

/**
 * UI Store using Zustand
 *
 * Manages global UI state for header and progress components
 * Following 2025 best practices with TypeScript and devtools integration
 */
export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial header state
      headerState: {
        isShareModalOpen: false,
      },

      // Initial progress state
      progressState: {
        currentStep: 0,
        isComplete: false,
      },

      // Actions
      actions: {
        // Header actions
        toggleShareModal: () =>
          set(
            (state) => ({
              headerState: {
                ...state.headerState,
                isShareModalOpen: !state.headerState.isShareModalOpen,
              },
            }),
            undefined,
            "toggleShareModal"
          ),

        openShareModal: () =>
          set(
            (state) => ({
              headerState: {
                ...state.headerState,
                isShareModalOpen: true,
              },
            }),
            undefined,
            "openShareModal"
          ),

        closeShareModal: () =>
          set(
            (state) => ({
              headerState: {
                ...state.headerState,
                isShareModalOpen: false,
              },
            }),
            undefined,
            "closeShareModal"
          ),

        // Progress actions
        updateProgressStep: (step: number) =>
          set(
            (state) => ({
              progressState: {
                ...state.progressState,
                currentStep: step,
                isComplete: false,
              },
            }),
            undefined,
            `updateProgressStep: ${step}`
          ),

        markProgressComplete: () =>
          set(
            (state) => ({
              progressState: {
                ...state.progressState,
                isComplete: true,
              },
            }),
            undefined,
            "markProgressComplete"
          ),

        resetProgress: () =>
          set(
            (state) => ({
              progressState: {
                currentStep: 0,
                isComplete: false,
              },
            }),
            undefined,
            "resetProgress"
          ),

        // Combined actions
        resetUI: () =>
          set(
            {
              headerState: {
                isShareModalOpen: false,
              },
              progressState: {
                currentStep: 0,
                isComplete: false,
              },
            },
            undefined,
            "resetUI"
          ),
      },
    }),
    {
      name: "ui-store", // DevTools name
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Selector hooks for better performance (prevent unnecessary re-renders)

/**
 * Hook to get header state
 */
export const useHeaderState = () => useUIStore((state) => state.headerState);

/**
 * Hook to get progress state
 */
export const useProgressState = () =>
  useUIStore((state) => state.progressState);

/**
 * Hook to get actions
 */
export const useUIActions = () => useUIStore((state) => state.actions);

/**
 * Hook to get specific header actions
 */
export const useHeaderActions = () =>
  useUIStore((state) => ({
    toggleShareModal: state.actions.toggleShareModal,
    openShareModal: state.actions.openShareModal,
    closeShareModal: state.actions.closeShareModal,
  }));

/**
 * Hook to get specific progress actions
 */
export const useProgressActions = () =>
  useUIStore((state) => ({
    updateProgressStep: state.actions.updateProgressStep,
    markProgressComplete: state.actions.markProgressComplete,
    resetProgress: state.actions.resetProgress,
  }));
