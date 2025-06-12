import { FiMenu, FiLogOut } from "react-icons/fi"
import { useAuthStore } from "@/core/stores/AuthStore"
import { useState, useRef, useEffect } from "react"
import { Mail } from "lucide-react"

export const Header = ({
  onToggleSidebar,
  sidebar,
}: {
  onToggleSidebar: () => void
  sidebar: string
}) => {
  const { user, role, setUserDefault } = useAuthStore()
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !(profileRef.current as any).contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={`h-16 bg-white shadow-md fixed top-0 left-0 right-0 z-10 flex items-center justify-between transition-all duration-300 ${
        sidebar === "full" ? "pl-64" : "pl-16"
      } pr-6`}
    >
      <button
        onClick={onToggleSidebar}
        className={`text-gray-600 px-4 transition-all duration-300 cursor-pointer ${
          sidebar === "mini-sidebar" ? "ml-2" : ""
        }`}
      >
        <FiMenu size={24} />
      </button>

      <div className="relative" ref={profileRef}>
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        >
          <div className="text-right">
            <div className="font-semibold text-sm text-gray-800">
              {user?.name || "Superadmin"}
            </div>
            <div className="text-xs text-gray-500">
              {user?.email || "superadmin@gmail.com"}
            </div>
          </div>
          <img
            src={
              user?.photo
                ? import.meta.env.VITE_STORAGE_URL + user.photo
                : "/images/profile/user-1.jpg"
            }
            className="w-10 h-10 rounded-full object-cover"
            alt="Profile"
          />
        </div>

        {showProfile && (
          <div className="absolute right-0 mt-6 border border-gray-400 w-72 bg-white shadow-xl rounded-lg p-4 z-50">
            <h2 className="text-lg font-semibold mb-3">Profil Pengguna</h2>
            <div className="flex items-center space-x-4">
              <img
                src={
                  user?.photo
                    ? import.meta.env.VITE_STORAGE_URL + user.photo
                    : "/images/profile/user-1.jpg"
                }
                className="w-16 h-16 rounded-full object-cover"
                alt="Avatar"
              />
              <div>
                <div className="text-lg font-medium text-gray-800">
                  {user?.name || "Fulan"}
                </div>
                <div className="text-sm text-gray-500">
                  {role.join(", ") || "super admin"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="inline-block mr-1"><Mail size={12}/></span>
                  {user?.email || "superadmin@gmail.com"}
                </div>
              </div>
            </div>
            <hr className="my-3 border-t border-gray-500" />
            <button
              onClick={() => {
                setUserDefault()
              }}
              className="w-full text-center text-blue-600 hover:text-blue-800 hover:bg-blue-200 py-2 bg-blue-100 rounded-md flex items-center justify-center gap-1"
            >
              Logout <FiLogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
