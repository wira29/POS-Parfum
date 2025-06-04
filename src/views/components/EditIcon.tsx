import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

interface EditIconProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const EditIcon = ({ to, onClick, className = "" }: EditIconProps) => {
  const baseClass = `bg-yellow-500 p-2 rounded text-white ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        <FiEdit />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      <FiEdit />
    </button>
  );
};

export default EditIcon;
