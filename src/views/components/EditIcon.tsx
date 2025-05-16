import { FiEdit } from "react-icons/fi"
import { Link } from "react-router-dom"

interface EditIconProps {
    to: string
    className?: string
}

export const EditIcon = ({ to, className = "" }: EditIconProps) => (
    <Link
        to={to}
        className={`bg-yellow-500 p-2 rounded text-white ${className}`}
    >
        <FiEdit />
    </Link>
)

export default EditIcon