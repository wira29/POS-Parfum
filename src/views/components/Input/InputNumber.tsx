interface InputNumberProps {
  labelClass: string;
  placeholder: string;
  prefix: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function InputNumber({
  labelClass,
  placeholder,
  prefix,
  value,
  onChange,
  error,
}: InputNumberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = rawValue || "0";
    onChange(e);
  };

  return (
    <div>
      <label className={labelClass}>Minimum Pembelian</label>
      <div
        className={`flex items-center border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md bg-white`}
      >
        {prefix && (
          <span className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border-r border-gray-300">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none"
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}

export default InputNumber;