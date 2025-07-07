import { useState, useRef, useEffect } from "react";
import { Option } from "@/core/interface/types";

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative" ref={ref}>
      <label className="block mb-1 text-sm text-gray-700">{label}</label>
      <div
        className={`w-full border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer`}
        onClick={() => setOpen(!open)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setOpen(!open);
            e.preventDefault();
          }
        }}
      >
        {selectedLabel || placeholder || "Pilih"}
      </div>
      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
            placeholder={`Cari ${label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-400 text-sm">
                Tidak ditemukan
              </div>
            )}
            {filteredOptions.map((opt, index) => (
              <div
                key={`${opt.value}-${index}`}
                className={`px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                  opt.value === value ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
          {value && (
            <div className="flex justify-end border-t border-gray-200 px-3 py-2">
              <button
                onClick={() => {
                  onChange("");
                  setOpen(false);
                  setSearch("");
                }}
                className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}

export default SearchableSelect;