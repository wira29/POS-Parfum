import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const navigate = useNavigate();

  const users = [
    { id: 1, name: "Ahmad Fulan", email: "fulan@gmail.com", role: "Admin", image: "/images/profile/user-8.jpg" },
    { id: 2, name: "Ahmad Fulan", email: "fulan@gmail.com", role: "Admin", image: "/images/profile/user-8.jpg" },
    { id: 3, name: "Ahmad Fulan", email: "fulan@gmail.com", role: "Admin", image: "/images/profile/user-8.jpg" },
  ];

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDropdownToggle = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleDetail = (user: typeof users[0]) => {
    navigate(`/users/${user.id}`);
  };

  const handleEdit = (user: typeof users[0]) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleDelete = (user: User) => {
    console.log("Delete", user);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Daftar Pengguna"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus."
      />

      {/* Search dan Tambah Akun */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-lg font-medium"
            onClick={() => navigate("/users/create")}
          >
            <FiPlus /> Tambah Akun
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center relative"
          >
            {/* Titik tiga pojok kanan */}
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
              onClick={() => handleDropdownToggle(user.id)}
            >
              <FiMoreHorizontal size={22} />
            </button>
            {dropdownOpenId === user.id && (
              <div className="absolute right-2 top-10 w-36 bg-white border rounded shadow-lg z-20">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setDropdownOpenId(null);
                    handleDetail(user);
                  }}
                >
                  Detail
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setDropdownOpenId(null);
                    handleEdit(user);
                  }}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  onClick={() => {
                    setDropdownOpenId(null);
                    handleDelete(user);
                  }}
                >
                  Hapus
                </button>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}