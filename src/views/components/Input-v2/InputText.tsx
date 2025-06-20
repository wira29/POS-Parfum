import { Tag } from "react-feather"

interface InputTextProps {
    label?: string
    labelClass?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder?: string
    error?: string
}

const InputText = ({
    label = "",
    labelClass = "",
    value,
    onChange,
    className = "",
    placeholder = "",
    error,
}: InputTextProps) => (
    <div>
        {label && (
            <label className={labelClass}>
                <Tag size={16} className="inline mr-1" />
                {label}
            </label>
        )}
        <input
            type="text"
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${className}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
        {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
    </div>
)

export default InputText