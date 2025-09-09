import { useMemo } from "react";

/**
 * Props for progress calculations
 */
export interface ProgressCalculationParams {
  height: number;
  gap: number;
  count: number;
}

/**
 * Return type for progress calculations
 */
export interface ProgressCalculations {
  totalHeight: number;
  baseZIndex: number;
}

/**
 * Custom hook for progress bar calculations
 * Separates the mathematical logic from the component rendering logic
 * 
 * @param height - Height of each progress box
 * @param gap - Gap between progress boxes (overlap amount)
 * @param count - Number of progress boxes
 * @returns Calculated values for component rendering
 */
export const useProgressCalculations = ({
  height,
  gap,
  count,
}: ProgressCalculationParams): ProgressCalculations => {
  const totalHeight = useMemo(() => {
    // Calculate total height: first box height + (remaining boxes * overlap height)
    return height + (height - gap) * (count - 1);
  }, [height, gap, count]);

  const baseZIndex = 90;

  return {
    totalHeight,
    baseZIndex,
  };
};

/**
 * Hook for getting the z-index for a specific progress box
 * 
 * @param baseZIndex - Starting z-index value
 * @param index - Index of the current box (0-based)
 * @returns Calculated z-index for the box
 */
export const useProgressBoxZIndex = (baseZIndex: number, index: number): number => {
  return useMemo(() => baseZIndex - index * 10, [baseZIndex, index]);
};