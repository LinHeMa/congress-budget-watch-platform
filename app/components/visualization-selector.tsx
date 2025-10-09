import { forwardRef } from "react";
import Select from "react-select";
import type {
  Props as SelectProps,
  GroupBase,
  SelectInstance,
} from "react-select";

type Option = { value: string; label: string };

const options: Option[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export const VisualizationSelector = forwardRef<
  SelectInstance<Option, false, GroupBase<Option>>,
  SelectProps<Option, false, GroupBase<Option>>
>((props, ref) => {
  return (
    <div className="w-60">
      <Select ref={ref} options={options} {...props} />
    </div>
  );
});

VisualizationSelector.displayName = "VisualizationSelector";
