import { useState, useEffect } from "react";

interface InputDiscountSelectProps {
  label: string;
  labelClass: string;
  discountType: "%" | "Rp";
  onDiscountTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  discountValue: number | null;
  onDiscountValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

function InputDiscountSelect({
  label,
  labelClass,
  discountType,
  onDiscountTypeChange,
  discountValue,
  onDiscountValueChange,
  placeholder,
  error,
}: InputDiscountSelectProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    discountValue?.toString() || ""
  );

  useEffect(() => {
    setDisplayValue(discountValue?.toString() || "");
  }, [discountValue]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    let finalValue = rawValue === "" ? "" : rawValue;

    if (discountType === "%" && finalValue && parseInt(finalValue) > 100) {
      finalValue = "100";
    }

    setDisplayValue(finalValue);
    e.target.value = finalValue;
    onDiscountValueChange(e);
  };

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <div
        className={`flex items-center gap-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md bg-white`}
      >
        <select
          value={discountType}
          onChange={onDiscountTypeChange}
          className="border-r cursor-pointer border-gray-300 px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none"
        >
          <option value="Rp">Rp</option>
          <option value="%">%</option>
        </select>
        <input
          type="text"
          value={displayValue}
          onChange={handleValueChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none"
        />
      </div>
      {discountType === "%" && (
        <div className="text-xs text-gray-500 mt-1">Nilai diskon 1-100%</div>
      )}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}

export default InputDiscountSelect;