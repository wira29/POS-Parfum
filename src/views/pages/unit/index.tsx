import { useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Plus, Edit, Trash2 } from "lucide-react";
import { SearchInput } from "@/views/components/SearchInput"
import { Filter } from "@/views/components/Filter"
import AddUnitModal from "@/views/pages/unit/widgets/AddPage";
import EditUnitModal from "@/views/pages/unit/widgets/EditPage";

export default function UnitPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUnit, setEditUnit] = useState(null);

  // Dummy data
  const units = [
    { id: 1, name: "Kilogram", code: "kg", itemCount: 10, createdDate: "13 Mei 2025" },
    { id: 2, name: "Kilogram", code: "kg", itemCount: 20, createdDate: "13 Mei 2025" },
    { id: 3, name: "Milliliter", code: "ml", itemCount: 30, createdDate: "13 Mei 2025" },
    { id: 4, name: "Milliliter", code: "ml", itemCount: 0, createdDate: "13 Mei 2025" },
    { id: 5, name: "Liter", code: "l", itemCount: 13, createdDate: "13 Mei 2025" },
    { id: 6, name: "Liter", code: "l", itemCount: 9, createdDate: "13 Mei 2025" },
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(units.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUnits = units.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (unit) => {
    setEditUnit(unit);
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log("Delete unit:", id);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Unit" desc="Unit" />

      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Filter />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Tambah Unit
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUnits.map((unit, index) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {unit.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {unit.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {unit.itemCount} Item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {unit.createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(unit)}
                        className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Menampilkan {startIndex + 1} dari {units.length} data
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <AddUnitModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditUnitModal open={editModalOpen} unit={editUnit} onClose={() => setEditModalOpen(false)} />
    </div>
  );
}