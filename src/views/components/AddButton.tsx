import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

interface AddButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const AddButton = ({ to, onClick, children, className = "" }: AddButtonProps) => {
  const baseClass =
    "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2";

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${className}`}>
        <FiPlus className="border rounded-2xl border-white" />
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClass} ${className}`}>
      <FiPlus className="border rounded-2xl border-white" />
      {children}
    </button>
  );
};

export default AddButton;
