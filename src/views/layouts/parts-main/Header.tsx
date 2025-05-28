import { FiMenu } from "react-icons/fi"
import { useAuthStore } from "@/core/stores/AuthStore"

export const Header = ({ onToggleSidebar, sidebar }: { onToggleSidebar: () => void; sidebar: string }) => {
  const { user } = useAuthStore()

  return (
    <header
      className={`h-16 bg-white shadow-md fixed top-0 left-0 right-0 z-10 flex items-center justify-between transition-all duration-300 ${
        sidebar === 'full' ? 'pl-64' : 'pl-16'
      } pr-6`}
    >
      <button
        onClick={onToggleSidebar}
        className={`text-gray-600 px-4 transition-all duration-300 cursor-pointer ${
          sidebar === 'mini-sidebar' ? 'ml-2' : ''
        }`}
      >
        <FiMenu size={24} />
      </button>

      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="font-semibold text-sm text-gray-800">{user?.name || 'Superadmin'}</div>
          <div className="text-xs text-gray-500">{user?.email || 'superadmin@gmail.com'}</div>
        </div>
        <img
          src={user?.photo ? import.meta.env.VITE_STORAGE_URL + user.photo : '/images/profile/user-1.jpg'}
          className="w-10 h-10 rounded-full object-cover"
          alt="Profile"
        />
      </div>
    </header>
  )
}