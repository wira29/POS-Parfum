import { Trash2, Plus } from "react-feather"

interface InputManyTextProps {
    items: string[]
    onChange: (index: number, value: string) => void
    onAdd: () => void
    onRemove: (index: number) => void
    maxLength?: number
    placeholderPrefix?: string
    label?: string
    className?: string
}

const InputManyText = ({
    items,
    onChange,
    onAdd,
    onRemove,
    maxLength = 50,
    placeholderPrefix = "",
    label,
    className = "",
}: InputManyTextProps) => (
    <div className={`space-y-2 ${className}`}>
        {label && <label className="font-semibold mb-1 block">{label}</label>}
        {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder={`${placeholderPrefix}${i + 1}.`}
                    value={item}
                    maxLength={maxLength}
                    onChange={(e) => onChange(i, e.target.value)}
                />
                {items.length > 1 && (
                    <button
                        type="button"
                        onClick={() => onRemove(i)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
        ))}
        <button
            type="button"
            onClick={onAdd}
            className="text-blue-600 text-sm flex items-center gap-1 mt-1"
        >
            <Plus size={16} /> Tambah
        </button>
        <p className="text-xs text-gray-500">Maximum {maxLength} Huruf</p>
    </div>
)

export default InputManyText