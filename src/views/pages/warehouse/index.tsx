import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { NoData } from "@/views/components/NoData";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
import { ImageHelper } from "@/core/helpers/ImageHelper";

interface Warehouse {
  id: string;
  name: string;
  image: string | null;
  telp: string;
  address: string;
  products_count: number;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Pagination {
  current_page: number;
  from: number;
  to: number;
  total: number;
  links: PaginationLink[];
}

export const WarehouseIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const apiClient = useApiClient();

  const fetchWarehouses = async () => {
    const res = await apiClient.get(
      `/warehouses?per_page=8&page=${currentPage}`
    );
    setWarehouses(res.data.data);
    setPagination(res.data.pagination);
  };

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage]);

  const handleDropdownToggle = (id: string) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleEdit = (warehouse: Warehouse) => {
    navigate(`/warehouses/${warehouse.id}/edit`);
  };

  const handleDelete = (warehouse: Warehouse) => {
    console.log("Delete", warehouse);
  };

  const handleTambah = () => {
    navigate("/warehouses/create");
  };

  const handleView = (warehouse: Warehouse) => {
    navigate(`/warehouses/${warehouse.id}/details`);
  };

  const handlePageChange = (url: string | null) => {
    if (!url) return;
    const pageParam = new URL(url).searchParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }
  };

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteWarehouse = async (id: number) => {
    try {
      await apiClient.delete(`/warehouses/${id}`)
      Swal.fire("Terhapus!", "Warehouse berhasil dihapus.", "success")
      window.location.reload()
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menghapus Warehouse.", "error")
      console.error(error)
    }
  }

  const confirmDelete = (id: number) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data Warehouse akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWarehouse(id)
      }
    })
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Informasi Warehouse"
        desc="Kelola dan perbarui informasi Warehouse"
      />

      <div className="bg-white rounded-xl p-6 shadow space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
              onClick={handleTambah}
            >
              <FiPlus /> Tambah Warehouse
            </button>
          </div>
        </div>

        {filteredWarehouses.length === 0 ? (
          <div className="bg-white rounded-xl p-6">
            <NoData img_size={300} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredWarehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="h-32 overflow-hidden p-2">
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                    {warehouse.name}
                  </h3>
                  <img
                    src={ImageHelper(warehouse.image)}
                    alt={warehouse.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-semibold text-gray-900 mb-1">
                    Penanggung Jawab:
                  </h3>
                  <p className="text-[13px] text-gray-500 mb-0.5 ">{warehouse.telp}</p>
                  <p className="text-[14px] text-gray-600 font-semibold truncate mt-2.5">Alamat</p>
                  <p className="text-[12px] text-gray-500 truncate">{warehouse.address}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium flex-1"
                      onClick={() => handleView(warehouse)}
                    >
                      Detail
                    </button>
                    <div className="relative">
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-400 hover:bg-gray-300"
                        onClick={() => handleDropdownToggle(warehouse.id)}
                        type="button"
                      >
                        <FiMoreHorizontal size={30} color="white" />
                      </button>
                      {dropdownOpenId === warehouse.id && (
                        <div className="absolute right-0 top-12 w-36 bg-white border rounded shadow-lg z-20">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => {
                              setDropdownOpenId(null);
                              handleEdit(warehouse);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                            onClick={() => {
                              setDropdownOpenId(null);
                              confirmDelete(warehouse.id);
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Menampilkan {pagination.from} hingga {pagination.to} dari {pagination.total} data
            </div>
            <div className="flex gap-2">
              {pagination.links.map((link, index) => {
                const label = link.label
                  .replace("&laquo; Previous", "Previous")
                  .replace("Next &raquo;", "Next");

                return (
                  <button
                    key={index}
                    className={`px-3 py-1 border rounded text-sm ${link.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                    disabled={!link.url}
                    onClick={() => handlePageChange(link.url)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};