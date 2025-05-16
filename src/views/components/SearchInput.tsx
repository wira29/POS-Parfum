import { FiSearch } from "react-icons/fi"

interface SearchInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="flex border border-gray-400 rounded-md overflow-hidden w-full max-w-lg">
      <div className="bg-blue-600 p-3">
        <FiSearch className="text-white" />
      </div>
      <input
        type="text"
        className="w-full px-4 py-2 outline-none"
        placeholder="Cari Produk"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
