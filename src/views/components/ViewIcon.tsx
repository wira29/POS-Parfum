import { FiEye } from "react-icons/fi"
import { Link } from "react-router-dom"

interface ViewIconProps {
  to: string
  className?: string
  children?: React.ReactNode
}

const ViewIcon = ({ to, children, className = "" }: ViewIconProps) => (
  <Link
    to={to}
    className={`bg-blue-600 p-2 rounded text-white flex items-center gap-1 ${className}`}
  >
    <FiEye />
    {children}
  </Link>
)

export default ViewIcon
