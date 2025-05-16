import { FiEye } from "react-icons/fi"

interface ViewIconProps {
    onClick?: () => void
    className?: string
}

export const ViewIcon = ({ onClick, className = "" }: ViewIconProps) => (
    <button
        onClick={onClick}
        className={`bg-blue-600 p-2 rounded text-white ${className}`}
        type="button"
    >
        <FiEye />
    </button>
)

export default ViewIcon