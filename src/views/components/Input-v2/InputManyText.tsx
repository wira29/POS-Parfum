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
        <div className="flex items-center gap-2">
            {label && <label className="font-semibold mb-1 block">{label}</label>}
        </div>
        {Array.from({ length: Math.ceil(items.length / 2) }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-3">
                {[0, 1].map((colIdx) => {
                    const i = rowIdx * 2 + colIdx;
                    if (i >= items.length) return <div key={colIdx} className="flex-1" />;
                    return (
                        <div key={colIdx} className="flex-1 flex items-center gap-2">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                                placeholder={`${placeholderPrefix}${i + 1}`}
                                value={items[i]}
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
                    );
                })}
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