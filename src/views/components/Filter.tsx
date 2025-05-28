import { FaSliders } from "react-icons/fa6";

interface FilterProps  {
    onClick?: () => void;
}

export const Filter = ({onClick}:FilterProps) => {
    return (
        <div className="filter mb-4">
            <button onClick={onClick} className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-blue-600 border-blue-600 hover:bg-blue-200 transition onclick:bg-blue-300">
                <FaSliders  size={20}/>
            </button>
        </div>
    )
}
