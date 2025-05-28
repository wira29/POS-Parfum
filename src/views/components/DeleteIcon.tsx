import { FiTrash2 } from "react-icons/fi"

interface DeleteButtonProps {
  onClick?: () => void;
}

const DeleteIcon = ({onClick} : DeleteButtonProps) => {
    return (
    <button className="bg-red-600 p-2 rounded text-white" onClick={onClick}>
        <FiTrash2 />
    </button>
    )
}
export default DeleteIcon