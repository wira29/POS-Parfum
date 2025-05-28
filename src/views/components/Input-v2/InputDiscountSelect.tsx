interface InputDiscountSelectProps {
    label?: string
    labelClass?: string
    discountType: string
    onDiscountTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    discountValue: number
    onDiscountValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder?: string
}

const InputDiscountSelect = ({
    label = "",
    labelClass = "",
    discountType,
    onDiscountTypeChange,
    discountValue,
    onDiscountValueChange,
    className = "",
    placeholder = "",
}: InputDiscountSelectProps) => (
    <div>
        {label && (
            <label className={labelClass}>{label}</label>
        )}
        <div className="flex items-center">
            <select
                value={discountType}
                onChange={onDiscountTypeChange}
                className="px-3 py-2 border border-gray-300 border-r-0 rounded-l-lg bg-gray-100 text-sm"
            >
                <option value="Rp">Rp</option>
                <option value="%">%</option>
            </select>
            <input
                type="number"
                value={discountValue}
                onChange={onDiscountValueChange}
                className={`w-full border border-gray-300 rounded-r-lg px-3 py-2 ${className}`}
                placeholder={placeholder}
            />
        </div>
    </div>
)

export default InputDiscountSelect