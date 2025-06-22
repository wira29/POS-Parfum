import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import { Filter } from "@/views/components/Filter";
import ViewIcon from "@/views/components/ViewIcon";
import { Calendar, Shield, Users, Trash2 } from "lucide-react";

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
  onApplyFilter,
}: {
  open: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onApplyFilter: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <div className="font-semibold text-lg mb-4">Filter User</div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Status</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={() => {
              onApplyFilter();
              onClose();
            }}
          >
            Terapkan
          </button>
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onApplyFilter={applyFilter}
      />
    </div>
  );
};

interface RoleDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  guardName: string;
  status: 'active' | 'inactive';
  userCount: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  lastLogin: string;
  joinDate: string;
  status: 'online' | 'offline';
}

export default function RoleDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [role, setRole] = useState<RoleDetail | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;
  
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Dummy data
  const dummyRole: RoleDetail = {
    id: "1",
    name: "Admin",
    description: "Terdapat mengupah nama role tanggal 12 Juni 2019 | 22:03",
    createdAt: "2025-05-11",
    guardName: "Website",
    status: "active",
    userCount: 1000
  };

  const dummyUsers: User[] = [
    {
      id: "1",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Juni 2025 | 22:00",
      joinDate: "31 Mei 2025",
      status: "online"
    },
    {
      id: "2",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Mei 2022 | 19:30",
      joinDate: "31 Mei 2025",
      status: "offline"
    },
    {
      id: "3",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Juni 2025 | 22:00",
      joinDate: "31 Mei 2025",
      status: "online"
    },
    {
      id: "4",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Mei 2022 | 19:30",
      joinDate: "31 Mei 2025",
      status: "offline"
    },
    {
      id: "5",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Juni 2025 | 22:00",
      joinDate: "31 Mei 2025",
      status: "online"
    },
    {
      id: "6",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Mei 2022 | 19:30",
      joinDate: "31 Mei 2025",
      status: "offline"
    },
    {
      id: "7",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Juni 2025 | 22:00",
      joinDate: "31 Mei 2025",
      status: "online"
    },
    {
      id: "8",
      username: "Eurico Darline",
      email: "Eurico1903@gmail.com",
      lastLogin: "12 Mei 2022 | 19:30",
      joinDate: "31 Mei 2025",
      status: "offline"
    }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    
    setTimeout(() => {
      let filteredUsers = dummyUsers;
      
      
      if (searchQuery) {
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      
      if (statusFilter) {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
      }
      
      setRole(dummyRole);
      setUsers(filteredUsers);
      setTotalItems(filteredUsers.length);
      setTotalPages(Math.ceil(filteredUsers.length / perPage));
      setLoading(false);
    }, 500);
  }, [id, searchQuery, statusFilter]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const itemsPerPage = perPage;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function applyFilter() {
    setCurrentPage(1);
  }


  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Detail Role"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing"
      />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Nama Role</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{role?.name}</p>
              <p className="text-xs text-gray-500 mt-2">{role?.description}</p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
            Edit
          </div>
        </div>


        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Tanggal Dibuat</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">{formatDate(role?.createdAt || '')}</p>
              <p className="text-xs text-gray-500 mt-2">Tanggal dibuat role tidak dapat diubah</p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
            Edit
          </div>
        </div>


        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Guard Name</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">{role?.guardName}</p>
              <p className="text-xs text-gray-500 mt-2">Website adalah blablablabla blablablabla blablablabla</p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
            Edit
          </div>
        </div>


        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Status</h3>
              <p className="text-lg font-bold text-gray-900 mt-1 capitalize">{role?.status}</p>
              <p className="text-xs text-gray-500 mt-2">Terakhir dinonaktifkan tanggal 12 Juni 2019 | 22:03</p>
            </div>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={role?.status === 'active'}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{totalItems} User Tergabung</h2>
            </div>
            <div className="flex gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onClick={() => nav("/roles")}
              >
                <span>Kembali</span>
              </button>
              <AddButton to="/users/create">Tambah User</AddButton>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Filter onClick={() => setShowFilter(true)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Terakhir</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Masuk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} dari {users.length} User
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}