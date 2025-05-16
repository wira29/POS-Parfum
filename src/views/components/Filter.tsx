import { FiSliders } from "react-icons/fi"

export const Filter = () => {
    return (
        <div className="filter mb-4">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-blue-600 border-blue-600 hover:bg-blue-50 transition">
                <FiSliders />
                <span>Filter</span>
            </button>
        </div>
    )
}
