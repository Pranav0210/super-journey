import React, { useState } from "react";
import Check from "@/assets/icons/check.svg?react";

interface CustomCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  className = "",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const actualChecked = isControlled ? controlledChecked : isChecked;

  const toggleChecked = () => {
    if (disabled) return;

    const newChecked = !actualChecked;
    if (!isControlled) setIsChecked(newChecked);
    if (onChange) onChange(newChecked);
  };

  return (
    <div
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : actualChecked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={`w-5 h-5 flex items-center justify-center border-2 rounded-md cursor-pointer select-none
                ${actualChecked ? "bg-primaryIndigo border-primaryIndigo" : "bg-white border-gray-300"}
                ${indeterminate ? "bg-yellow-500 border-yellow-500" : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${className}`}
      onClick={toggleChecked}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          toggleChecked();
        }
      }}
    >
      {/* Checkmark or indeterminate indicator */}
      {indeterminate ? (
        <div className="w-3 h-0.5 bg-white rounded-sm"></div>
      ) : (
        actualChecked && <Check className="w-5 h-5 text-white align-middle" />
      )}
    </div>
  );
};

export default CustomCheckbox;
