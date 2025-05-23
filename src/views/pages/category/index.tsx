import { useState } from "react";
import CategoryModal from "@/views/components/Modal/CategoryModal";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { DeleteIcon } from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";

interface Category {
  name: string;
  jumlahItem: string;
  dibuatTanggal: string;
  status: string;
}

export const CategoryIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const itemsPerPage = 5;

  const mockData: Category[] = [
    { name: "Parfum Siang", jumlahItem: "18 item", dibuatTanggal: "13 Mei 2025", status: "Berlaku" },
    { name: "Parfum Malam", jumlahItem: "18 item", dibuatTanggal: "13 Mei 2025", status: "Berlaku" },
    { name: "Parfum Sore", jumlahItem: "18 item", dibuatTanggal: "13 Mei 2025", status: "Berlaku" },
    { name: "Parfum Pagi", jumlahItem: "18 item", dibuatTanggal: "13 Mei 2025", status: "Berlaku" },
    { name: "Parfum Subuh", jumlahItem: "18 item", dibuatTanggal: "13 Mei 2025", status: "Berlaku" },
    { name: "Parfum Pria", jumlahItem: "18 item", dibuatTanggal: "13 Mei 2025", status: "Berlaku" },
    { name: "Parfum Wanita", jumlahItem: "18 item", dibuatTanggal: "13 Mei 2025", status: "Berlaku" },
  ];

  const filteredData = mockData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory({
      ...category,
      status: category.status === "Berlaku" ? "Berlaku" : "Tidak Berlaku",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (data: { name: string; status: boolean }) => {
    if (editingCategory) {
      console.log("Updating kategori:", data);
    } else {
      console.log("Menambahkan kategori:", data);
    }
    closeModal();
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Kategori" desc="List kategori yang ada pada toko anda" />

      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Filter />
          </div>
          <div className="w-full sm:w-auto">
            <AddButton onClick={openCreateModal}>Tambah Category</AddButton>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Kategori</th>
                <th className="px-6 py-4 font-medium">Jumlah Item</th>
                <th className="px-6 py-4 font-medium">Dibuat Tanggal</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 text-gray-600 hover:bg-gray-50">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.jumlahItem}</td>
                    <td className="px-6 py-4">{item.dibuatTanggal}</td>
                    <td className="px-6 py-4">{item.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(item)}>
                          <EditIcon className="text-blue-500 hover:text-blue-700" />
                        </button>
                        <DeleteIcon />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
          <span className="text-gray-700">{filteredData.length} Data</span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={
          editingCategory
            ? {
                name: editingCategory.name,
                status: editingCategory.status === "Berlaku",
              }
            : null
        }
      />
    </div>
  );
};