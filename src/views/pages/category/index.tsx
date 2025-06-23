import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import { Filter } from "@/views/components/Filter";
import { Toaster } from "@/core/helpers/BaseAlert";
import { useApiClient } from "@/core/helpers/ApiClient";
import { CategoryFilterModal } from "@/views/components/filter/CategoryFilterModal";

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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [perPage, setPerPage] = useState(8);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const ApiClient = useApiClient();

  const fetchCategories = async (page: number) => {
    try {
      const queryParams = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
      });

      if (startDate) queryParams.append("start_date", startDate);
      if (endDate) queryParams.append("end_date", endDate);

      const response = await ApiClient.get(
        `/categories?${queryParams.toString()}`
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
  }, [currentPage, startDate, endDate]);

  const filteredData = categories.filter((item) => {
    const itemDate = new Date(item.created_at).toISOString().split("T")[0];
    const isMatchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isMatchFilter = categoryFilter ? item.name === categoryFilter : true;
    const isMatchStatus = statusFilter ? item.status === statusFilter : true;
    const isAfterStart = startDate ? itemDate >= startDate : true;
    const isBeforeEnd = endDate ? itemDate <= endDate : true;

    return (
      isMatchSearch &&
      isMatchFilter &&
      isMatchStatus &&
      isAfterStart &&
      isBeforeEnd
    );
  });

  const totalPages = Math.ceil(totalData / perPage);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createCategory = async (name: string) => {
    try {
      const response = await ApiClient.post("/categories", { name });
      if (response.data.success) return response.data.data;
      Swal.fire(
        "Error",
        response.data.message || "Gagal membuat kategori",
        "error"
      );
      return null;
    } catch (error) {
      console.error("Error creating category:", error);
      Swal.fire("Error", "Terjadi kesalahan saat membuat kategori", "error");
      return null;
    }
  };

  const updateCategory = async (id: number, name: string) => {
    try {
      const response = await ApiClient.put(`/categories/${id}`, { name });
      if (response.data.success) return response.data.data;
      Swal.fire(
        "Error",
        response.data.message || "Gagal mengupdate kategori",
        "error"
      );
      return null;
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mengupdate kategori", "error");
      return null;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await ApiClient.delete(`/categories/${id}`);
      if (response.data.success) {
        Toaster("success", "Kategori berhasil dihapus");
        fetchCategories(currentPage);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Gagal menghapus kategori",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus kategori", "error");
    }
  };

  const handleModalSubmit = async (name: string) => {
    const success = editingCategory
      ? await updateCategory(editingCategory.id, name)
      : await createCategory(name);

    if (success) {
      Toaster(
        "success",
        editingCategory
          ? "Kategori berhasil diupdate"
          : "Kategori berhasil dibuat"
      );
      fetchCategories(currentPage);
      closeModal();
    }
  };

  const confirmDelete = (id: number) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data category akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) deleteCategory(id);
    });
  };

  const Modal = () => {
    const [name, setName] = useState(
      editingCategory ? editingCategory.name : ""
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setName(editingCategory ? editingCategory.name : "");
    }, [editingCategory]);

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim())
        return Swal.fire("Error", "Nama kategori wajib diisi", "error");
      setIsLoading(true);
      await handleModalSubmit(name);
      setIsLoading(false);
    };

    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-lg shadow-lg overflow-hidden min-w-[400px] max-w-md w-full mx-4"
        >
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="font-semibold text-lg text-white">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Nama<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nama Kategori"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`${
                  editingCategory
                    ? "bg-yellow-400 hover:bg-yellow-500 "
                    : "bg-blue-600"
                } cursor-pointer px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                disabled={isLoading}
              >
                {isLoading
                  ? "Menyimpan..."
                  : editingCategory
                  ? "Simpan"
                  : "Tambah"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Kategori"
        desc="List kategori yang ada pada toko anda"
      />
      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-5">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Filter onClick={() => setShowFilter(true)} />
          </div>
          <AddButton onClick={openCreateModal}>Tambah Category</AddButton>
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
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
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
                        <DeleteIcon onClick={() => confirmDelete(item.id)} />
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

      <CategoryFilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        startDate={startDate}
        endDate={endDate}
        statusFilter={statusFilter}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setStatusFilter={setStatusFilter}
        onApply={() => setCurrentPage(1)}
        onReset={() => {
          setStartDate("");
          setEndDate("");
          setStatusFilter("");
        }}
      />

      <Modal />
    </div>
  );
};
