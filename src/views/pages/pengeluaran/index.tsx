import { useState } from "react"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { SearchInput } from "@/views/components/SearchInput"
import { Filter } from "@/views/components/Filter"
import DeleteIcon from "@/views/components/DeleteIcon"
import { EditIcon } from "@/views/components/EditIcon"
import AddButton from "@/views/components/AddButton"
import ViewIcon from "@/views/components/ViewIcon"



const dummyExpenses = [
  { id: 1, name: "Stok Alkohol", amount: 100000, date: "13 Mei 2025", status: "Disetujui" },
  { id: 2, name: "Stok Alkohol", amount: 100000, date: "13 Mei 2025", status: "Disetujui" },
  { id: 3, name: "Token Listrik", amount: 300000, date: "13 Mei 2025", status: "Disetujui" },
  { id: 4, name: "Air", amount: 300000, date: "13 Mei 2025", status: "Disetujui" },
  { id: 5, name: "Gaji Karyawan", amount: 3000000, date: "13 Mei 2025", status: "Menunggu" },
  { id: 6, name: "Gaji Karyawan", amount: 3000000, date: "13 Mei 2025", status: "Menunggu" },
  { id: 7, name: "Gaji Karyawan", amount: 3000000, date: "13 Mei 2025", status: "Menunggu" },
  { id: 8, name: "Gaji Karyawan", amount: 3000000, date: "13 Mei 2025", status: "Menunggu" }
]

export default function ExpenseManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Semua")
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      setSelectedItems(dummyExpenses.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const filteredExpenses = dummyExpenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "Semua" || expense.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb 
        title="Pengeluaran" 
        desc="Kelola pengeluaran retail anda."
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
              
              
              <Filter />
            </div>


            <AddButton to="./create">Tambah Pengeluaran</AddButton>
          </div>
        </div>


        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Pilih Semua</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 font-medium">Tampilkan Hanya:</span>
              {["Semua", "Disetujui", "Menunggu"].map((filter) => (
                <label key={filter} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    value={filter}
                    checked={selectedFilter === filter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{filter}</span>
                </label>
              ))}
            </div>
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Pengeluaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(expense.id)}
                        onChange={() => handleSelectItem(expense.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">{expense.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.status === "Disetujui" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ViewIcon to={`/expenses/${expense.id}`} />
                      <EditIcon to={`/expenses/${expense.id}/edit`} />
                      <DeleteIcon />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan 8 dari 67 data
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