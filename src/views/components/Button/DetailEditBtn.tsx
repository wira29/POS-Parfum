import { FiEdit } from "react-icons/fi"

export const DetailEditBtn = () => {
    return (
    <button className="bg-yellow-500 p-2 rounded text-white justify-center w-26 h-8 flex items-center gap-1">
        <FiEdit />
        <span className="text-sm">Edit</span>
    </button>
    )
}
export default DetailEditBtn