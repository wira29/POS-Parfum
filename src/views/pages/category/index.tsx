import { useEffect, useState } from "react";
import CategoryModal from "@/views/components/Modal/CategoryModal";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import { Filter } from "@/views/components/Filter";
import Swal from "sweetalert2";
import { Toaster } from "@/core/helpers/BaseAlert";
import { useApiClient } from "@/core/helpers/ApiClient";

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
  nameFilter,
  setNameFilter,
  nameOptions,
}: {
  open: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  nameFilter: string;
  setNameFilter: (val: string) => void;
  nameOptions: string[];
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <div className="font-semibold text-lg mb-4">Filter Kategori</div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Status</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="Berlaku">Berlaku</option>
            <option value="Tidak Berlaku">Tidak Berlaku</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Nama Kategori</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          >
            <option value="">Semua Nama</option>
            {nameOptions.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  is_delete: number;
  products_count: number;
  status: string;
}

export const CategoryIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [perPage, setPerPage] = useState(8);

  const ApiClient = useApiClient();

  const fetchCategories = async (page: number) => {
    try {
      const response = await ApiClient.get(
        `/categories?per_page=${perPage}&page=${page}`
      );
      if (response.data.success) {
        const apiData: Category[] = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_delete: item.is_delete,
          products_count: item.products_count,
          status: item.is_delete === 0 ? "Berlaku" : "Tidak Berlaku",
        }));
        setCategories(apiData);
        setTotalData(response.data.pagination.total);
      } else {
        setCategories([]);
        setTotalData(0);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setTotalData(0);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const filteredData = categories.filter((item) =>
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter ? item.status === statusFilter : true) &&
    (nameFilter ? item.name === nameFilter : true)
  );

  const totalPages = Math.ceil(totalData / perPage);

  const paginatedData = filteredData;

  const nameOptions = Array.from(new Set(categories.map((d) => d.name)));

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

  function dellete() {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data category akan dihapus!",
      icon: "question",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      if (result.isConfirmed) {
        Toaster("success", "Category berhasil dihapus");
      }
    });
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Kategori"
        desc="List kategori yang ada pada toko anda"
      />

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
            <Filter onClick={() => setShowFilter(true)} />
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
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.products_count} item</td>
                    <td className="px-6 py-4">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">{item.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(item)}>
                          <EditIcon className="text-blue-500 hover:text-blue-700" />
                        </button>
                        <DeleteIcon onClick={dellete} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-6">
          <span className="text-gray-700">{filteredData.length} Data</span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        nameOptions={nameOptions}
      />

      <CategoryModal
        open={isModalOpen}
        onClose={closeModal}
        data={editingCategory}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};
