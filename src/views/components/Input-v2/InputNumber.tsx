interface InputNumberProps {
    label?: string
    labelClass?: string
    value: number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder?: string
    prefix?: string
}

const InputNumber = ({
    label = "",
    labelClass = "",
    value,
    onChange,
    className = "",
    placeholder = "",
    prefix = "",
}: InputNumberProps) => (
    <div>
        {label && (
            <label className={labelClass}>{label}</label>
        )}
        <div className="flex items-center">
            {prefix && (
                <span className="px-3 py-2 border border-gray-300 border-r-0 rounded-l-lg bg-gray-100 text-sm">
                    {prefix}
                </span>
            )}
            <input
                type="number"
                value={value}
                onChange={onChange}
                className={`w-full border border-gray-300 rounded-r-lg px-3 py-1.5 ${className}`}
                placeholder={placeholder}
            />
        </div>
    </div>
)

export default InputNumber