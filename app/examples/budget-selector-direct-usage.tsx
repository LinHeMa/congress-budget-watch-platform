import React from 'react';
import BudgetsSelector from '~/components/budgets-selector';
import { createBudgetSelectStore } from '~/stores/budget-selector';

/**
 * Example 1: Basic usage with default store
 */
export const BasicUsageExample: React.FC = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Basic Budget Selector</h3>
      <BudgetsSelector 
        onSelectionChange={(value) => console.log('Selected:', value)}
      />
    </div>
  );
};

/**
 * Example 2: Using createBudgetSelectStore with initProps
 * This shows how you could create a store with custom initial values
 */
export const CustomInitExample: React.FC = () => {
  // Create a store with custom initial value
  React.useEffect(() => {
    const customStore = createBudgetSelectStore({ selectedValue: "by-department" });
    console.log('Custom store initialized with:', customStore.getState().selectedValue);
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Custom Initialization Example</h3>
      <p className="text-sm text-gray-600 mb-4">
        This example shows how to create a store with initProps.
        The actual component uses the default global store.
      </p>
      <BudgetsSelector 
        onSelectionChange={(value) => console.log('Custom Init Selected:', value)}
      />
    </div>
  );
};

/**
 * Example 3: Accessing store state directly
 */
export const DirectStoreAccessExample: React.FC = () => {
  const [storeState, setStoreState] = React.useState<string>('');

  React.useEffect(() => {
    // Example of accessing the store directly
    const customStore = createBudgetSelectStore({ selectedValue: "by-legislator" });
    
    // Subscribe to changes
    const unsubscribe = customStore.subscribe((state) => {
      setStoreState(state.selectedValue);
    });

    // Set initial state
    setStoreState(customStore.getState().selectedValue);

    return unsubscribe;
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Direct Store Access</h3>
      <p className="text-sm text-gray-600 mb-4">
        Custom store state: <strong>{storeState}</strong>
      </p>
      <BudgetsSelector 
        onSelectionChange={(value) => console.log('Direct Access Selected:', value)}
      />
    </div>
  );
};