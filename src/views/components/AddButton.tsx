import { Link } from "react-router-dom"
import { FiPlus } from "react-icons/fi"

interface AddButtonProps {
    to: string
    children: React.ReactNode
    className?: string
}

const AddButton = ({ to, children, className = "" }: AddButtonProps) => (
    <Link
        to={to}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${className}`}
    >
        <FiPlus />
        {children}
    </Link>
)

export default AddButton