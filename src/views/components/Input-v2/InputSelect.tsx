import { Package } from "react-feather"

interface InputSelectProps {
    label?: string
    labelClass?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string; label: string }[]
    className?: string
    error?: string
}

const InputSelect = ({
    label = "",
    labelClass = "",
    value,
    onChange,
    options,
    className = "",
    error,
}: InputSelectProps) => (
    <div>
        {label && (
            <label className={labelClass}>
                {label}
            </label>
        )}
        <select
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${className}`}
            value={value}
            onChange={onChange}
        >
            <option value="">Pilih</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
    </div>
)

export default InputSelect