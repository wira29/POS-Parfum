import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { SearchInput } from "@/views/components/SearchInput"
import AddButton from "@/views/components/AddButton"
import AddRoleModal from "@/views/pages/roles/widgets/AddPage";
import EditRoleModal from "@/views/pages/roles/widgets/EditPage";
import { Users } from "lucide-react"

const dummyRoles = [
  {
    id: 1,
    name: "Role Admin",
    userCount: 1000,
    guardName: "web",
    createdDate: "11 Mei 2025",
    status: "Active",
    lastUpdate: "Rabu 11 Juni 2025 | 23:06 WIB"
  },
  {
    id: 2,
    name: "Role Admin",
    userCount: 1000,
    guardName: "web",
    createdDate: "11 Mei 2025",
    status: "Non-active",
    lastUpdate: "Rabu 11 Juni 2025 | 23:06 WIB"
  },
  {
    id: 3,
    name: "Role Admin",
    userCount: 1000,
    guardName: "web",
    createdDate: "11 Mei 2025",
    status: "Active",
    lastUpdate: "Rabu 11 Juni 2025 | 23:06 WIB"
  }
]

export default function RolePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false);

  const filteredRoles = dummyRoles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status) => {
    if (status === "Active") {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Active</span>
    }
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">Non-active</span>
  }

  const getActionButtons = (role) => {
    if (role.status === "Active") {
      return (
        <>
          <button onClick={() => setModalOpen(true)} className="bg-orange-500 text-white px-4 py-1 rounded text-xs font-medium hover:bg-orange-200 transition-colors">
            Edit
          </button>
          <EditRoleModal open={modalOpen} onClose={() => setModalOpen(false)} />
          <button className="bg-red-500 text-white px-4 py-1 rounded text-xs font-medium transition-colors">
            Non-active
          </button>
        </>
      )
    }
    return (
      <button className="bg-green-500 text-white px-4 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors">
        Active
      </button>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb 
        title="Daftar Role" 
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing"
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <SearchInput 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>
            <AddButton onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah Role</AddButton>
            <AddRoleModal open={modalOpen} onClose={() => setModalOpen(false)} />
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filteredRoles.map((role, index) => (
            <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                    <Users className="w-3 h-3" />
                    {role.userCount} User
                  </div>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                  onClick={() => navigate(`/roles/${role.id}/Detail`)}
                >
                  Detail
                </button>
              </div>

              <div className="border-b border-gray-200 my-4"></div>
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span>Guard name: <span className="text-gray-900">{role.guardName}</span></span>
                  <span>Tanggal Dibuat: <span className="text-gray-900">{role.createdDate}</span></span>
                  <span>Status: {getStatusBadge(role.status)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getActionButtons(role)}
                </div>
              </div>


              <div className={`flex items-center gap-2 text-sm p-3 rounded ${
              role.status === "Non-active" ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  role.status === "Non-active" ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                Perubahan Terbaru: {role.lastUpdate}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan 3 dari 100 data
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-blue-500 text-white rounded">
                1
              </button>
              <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                2
              </button>
              <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                3
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}