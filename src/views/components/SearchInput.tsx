import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  value: string;
  placeholder?:string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange,placeholder = "Cari..." }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(inputValue);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <div className="flex border border-gray-400/[0.5] rounded-md overflow-hidden w-full max-w-lg">
      <div className="bg-blue-600 p-3">
        <FiSearch className="text-white" />
      </div>
      <input
        type="text"
        className="w-full px-4 py-2 outline-none"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};
