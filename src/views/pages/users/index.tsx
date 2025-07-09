import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
import { ReactNode } from "react";
import { UserFilterModal } from "@/views/components/filter/UserFilter";
import { Filter } from "@/views/components/Filter";
import { LoadingCards } from "@/views/components/Loading";
import { ImageHelper } from "@/core/helpers/ImageHelper";

type User = {
  [x: string]: ReactNode;
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  created_at: string;
  roles?: { name: string }[];
};

type Pagination = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
};

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const [showFilter, setShowFilter] = useState(false);
  const [myRole, setMyRole] = useState<string | null>(null);

  const [selectedRole, setSelectedRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [draftRole, setDraftRole] = useState("");
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const fetchUsers = async (page = 1) => {
    if (!myRole) return;

    setLoading(true);
    try {
      const response = await apiClient.get(`/users?page=${page}&per_page=8`);
      const usersData = response.data.data;
      const mappedUsers: User[] = usersData.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.roles?.[0] || "-",
        image: item.image ? `${item.image}` : "/images/profile/user-1.jpg",
        created_at: item.created_at,
        roles: item.roles?.map((r: string) => ({ name: r })) || [],
      }));
      setUsers(mappedUsers);

      setPagination({
        total: response.data.pagination.total,
        per_page: response.data.pagination.per_page,
        current_page: response.data.pagination.current_page,
        last_page: response.data.pagination.last_page,
        from: response.data.pagination.from,
        to: response.data.pagination.to,
      });
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchMyRole = async () => {
      try {
        const res = await apiClient.get("/me");
        const roles = res.data.data.roles;
        if (roles && roles.length > 0) {
          setMyRole(roles[0].name);
        }
      } catch (error) {
        console.error("Gagal mengambil data user login:", error);
      }
    };

    fetchMyRole();
  }, []);

  useEffect(() => {
    if (myRole) {
      fetchUsers(1);
    }
  }, [myRole]);

  const filteredUsers = users.filter((user) => {
    const matchSearch = `${user.name} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = selectedRole ? user.roles?.some((r) => r.name === selectedRole) : true;
    const createdDate = new Date(user.created_at);
    const matchStartDate = startDate ? createdDate >= new Date(startDate) : true;
    const matchEndDate = endDate ? createdDate <= new Date(endDate) : true;
    return matchSearch && matchRole && matchStartDate && matchEndDate;
  });

  const isFilterActive = selectedRole !== "" || startDate !== "" || endDate !== "";

  const handleDropdownToggle = (id: string) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleDetail = (user: User) => {
    navigate(`/users/${user.id}/detail`);
  };

  const handleEdit = (user: User) => {
    navigate(`/users/${user.id}/edit`);
  };

  const confirmDelete = (id: string) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data User akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) deleteUser(id);
    });
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient.delete(`/users/${id}`);
      Swal.fire("Terhapus!", "User berhasil dihapus.", "success");
      fetchUsers(1);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menghapus User.", "error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleApplyFilter = () => {
    setSelectedRole(draftRole);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setShowFilter(false);
  };

  useEffect(() => {
    if (showFilter) {
      setDraftRole(selectedRole);
      setDraftStartDate(startDate);
      setDraftEndDate(endDate);
    }
  }, [showFilter]);
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Daftar Pengguna" desc="Kelola daftar akun pengguna pada sistem." />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
          <SearchInput value={searchQuery} onChange={(value) => setSearchQuery(value)} />
          <div className="relative">
            {isFilterActive && (
              <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-10" />
            )}
            <Filter onClick={() => setShowFilter(true)} />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer"
            onClick={() => navigate("/users/create")}
          >
            <FiPlus /> Tambah Akun
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingCards />
      ) : filteredUsers.length === 0 ? (
        <div className="text-gray-500">Tidak ada pengguna ditemukan.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between items-center relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img src={ImageHelper(user.image)} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div ref={dropdownOpenId === user.id ? dropdownRef : null}>
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDropdownToggle(user.id)}
                    >
                      <FiMoreHorizontal size={22} />
                    </button>
                    {dropdownOpenId === user.id && (
                      <div className="absolute right-2 top-10 w-36 bg-white border rounded shadow-lg z-20">
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer" onClick={() => { setDropdownOpenId(null); handleDetail(user); }}>
                          Detail
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer" onClick={() => { setDropdownOpenId(null); handleEdit(user); }}>
                          Edit
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 cursor-pointer" onClick={() => { setDropdownOpenId(null); confirmDelete(user.id); }}>
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {user.roles?.[0]?.name || "Tidak ada role"}
                  </span>
                </div>
                <div className="flex justify-between w-full mt-10 ml-5 mr-5">
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-gray-800">Bergabung pada</p>
                    <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-gray-800">Status</p>
                    <p className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">Aktif</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 gap-2 flex-wrap">
            {pagination.last_page > 1 && (
              <>
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => fetchUsers(pagination.current_page - 1)}
                  className={`px-3 py-1 border rounded text-sm ${pagination.current_page === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 text-gray-700"}`}
                >
                  &laquo;
                </button>
                {Array.from({ length: pagination.last_page }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => fetchUsers(idx + 1)}
                    className={`px-3 py-1 border rounded text-sm ${pagination.current_page === idx + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => fetchUsers(pagination.current_page + 1)}
                  className={`px-3 py-1 border rounded text-sm ${pagination.current_page === pagination.last_page ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 text-gray-700"}`}
                >
                  &raquo;
                </button>
              </>
            )}
          </div>
        </>
      )}

      <UserFilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        selectedRole={draftRole}
        setSelectedRole={setDraftRole}
        availableRoles={Array.from(new Set(users.flatMap(u => u.roles?.map(r => r.name) || [])))}
        startDate={draftStartDate}
        setStartDate={setDraftStartDate}
        endDate={draftEndDate}
        setEndDate={setDraftEndDate}
        onApply={handleApplyFilter}
      />
    </div>
  );
}
