import { FiTrash2 } from "react-icons/fi"

interface DeleteButtonProps {
  onClick?: () => void;
}

export const DetailDelleteBtn = ({onClick} : DeleteButtonProps) => {
    return (
    <button  onClick={onClick} className="bg-red-600 p-2 rounded text-white justify-center w-26 h-8 flex items-center gap-1">
        <FiTrash2 />
        <span className="text-sm">Hapus</span>
    </button>
    )
}
export default DetailDelleteBtn
