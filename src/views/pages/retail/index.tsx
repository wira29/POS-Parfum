import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { NoData } from "@/views/components/NoData";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
import { ImageHelper } from "@/core/helpers/ImageHelper";

interface Retail {
  id: string;
  name: string;
  image: string;
  telp: string;
  address: string;
  owner: string;
  location: string;
}

export const RetailIndex = () => {
  const [retails, setRetails] = useState<Retail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);

  const navigate = useNavigate();
  const apiClient = useApiClient();

  const fetchRetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/outlets?page=${page}&per_page=8`);
      const data = response.data;

      const mappedRetails: Retail[] = data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: ImageHelper(item.image),
        telp: item.telp,
        address: item.address,
        owner: item.pemilik_outlet || "-", // ambil dari field pemilik_outlet
        location: item.store?.name || "-",
      }));

      setRetails(mappedRetails);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch outlets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (!url) return;
    const urlParams = new URL(url).searchParams;
    const newPage = parseInt(urlParams.get("page") || "1", 10);
    setPage(newPage);
  };

  useEffect(() => {
    fetchRetails();
    // eslint-disable-next-line
  }, [page]);

  const handleDropdownToggle = (id: string) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleEdit = (retail: Retail) => {
    navigate(`/retails/${retail.id}/edit`);
  };

  const handleTambah = () => {
    navigate("/retails/create");
  };

  const handleView = (retail: Retail) => {
    navigate(`/retails/${retail.id}/detail`);
  };

  const deleteOutlet = async (id: string) => {
    try {
      await apiClient.delete(`/outlets/${id}`);
      Swal.fire("Terhapus!", "Outlet berhasil dihapus.", "success");
      fetchRetails();
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menghapus outlet.", "error");
      console.error(error);
    }
  };

  const confirmDelete = (id: string) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data outlet akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOutlet(id);
      }
    });
  };

  const filteredRetails = retails.filter((retail) =>
    `${retail.name} ${retail.location}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Informasi Retail"
        desc="Kelola dan perbarui informasi retail"
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
              <FiPlus /> Tambah Retail
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredRetails.length === 0 ? (
          <div className="bg-white rounded-xl p-6">
            <NoData img_size={300} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRetails.map((retail) => (
              <div
                key={retail.id}
                className="bg-white rounded-xl shadow-sm border flex-col border-gray-100"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={retail.image}
                    alt={retail.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                    {retail.name}
                  </h3>
                  <p className="text-[13px] text-gray-800 mb-0.5">{retail.telp}</p>
                  <p className="text-[13px] text-gray-500 truncate">{retail.address}</p>
                  <p className="text-[13px] font-medium text-gray-600 mt-3">
                    Pemilik Retail
                  </p>
                  <p className="text-[15px] font-bold text-black mb-4">
                    {retail.owner}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium flex-1"
                      onClick={() => handleView(retail)}
                    >
                      Detail
                    </button>
                    <div className="relative">
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-400 hover:bg-gray-300"
                        onClick={() => handleDropdownToggle(retail.id)}
                        type="button"
                      >
                        <FiMoreHorizontal size={30} color="white" />
                      </button>
                      {dropdownOpenId === retail.id && (
                        <div className="absolute right-0 top-12 w-36 bg-white border rounded shadow-lg z-20">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => {
                              setDropdownOpenId(null);
                              handleEdit(retail);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                            onClick={() => {
                              setDropdownOpenId(null);
                              confirmDelete(retail.id);
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

        {pagination && pagination.links && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Menampilkan {pagination.from} - {pagination.to} dari{" "}
              {pagination.total} data
            </div>
            <div className="flex gap-2">
              {pagination.links.map((link: any, idx: number) => (
                <button
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  onClick={() => handlePageChange(link.url)}
                  disabled={!link.url}
                  className={`px-3 py-1 border rounded text-sm ${link.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};