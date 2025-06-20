import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { EditIcon } from "@/views/components/EditIcon";
import ViewIcon from "@/views/components/ViewIcon";
import { X } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";

interface BlendingProduct {
  id: number;
  nama: string;
  tanggalPembuatan: string;
  kategori: string;
  stok: string;
  hargaNormal: string;
  hargaDiskon: string;
  status: string;
  products: {
    nama: string;
    harga: string;
    gambar: string;
    variants: { nama: string; harga: string }[];
  }[];
}

export default function BlendingIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const ApiClient = useApiClient();
  const [blendingData, setBlendingData] = useState<BlendingProduct[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const categoryOptions = Array.from(new Set(blendingData.map((item) => item.kategori)));

  const getData = async () => {
    try {
      const response = await ApiClient.get("/product-blend");
      const apiData = response.data?.data ?? [];
      console.log(apiData);
      

      const transformed: BlendingProduct[] = apiData.map((item: any) => ({
        id: item.id,
        nama: item.product_detail.product.blend_name || "Tanpa Nama",
        tanggalPembuatan: item.date || "",
        kategori: "-",
        stok: item.quantity ? `${item.quantity}G` : "-",
        hargaNormal: "-",
        hargaDiskon: "-",
        status: "-",
        products: item.product_blend_details?.map((detail: any) => ({
          nama: detail.product_detail?.product?.name ?? "Produk Tanpa Nama",
          harga: "-",
          gambar: "/img/default.png",
          variants: [],
        })) ?? [],
      }));

      setBlendingData(transformed);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBlendingData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredData = blendingData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = categoryFilter === "" || item.kategori === categoryFilter;

    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Blending Produk" desc="Menampilkan blending yang aktif" />
      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Filter onClick={() => setShowFilter(true)} />
          </div>
          <div className="w-full sm:w-auto">
            <AddButton to="/blendings/create">Tambah Blending</AddButton>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Blending</th>
                <th className="px-6 py-4 font-medium">Tanggal Pembuatan</th>
                <th className="px-6 py-4 font-medium">Stok</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-black text-base font-semibold">
                        {item.nama}
                      </span>
                      <br /> Terdiri dari {item.products.length} Product
                    </td>
                    <td className="px-6 py-4">
                      {item.tanggalPembuatan
                        ? new Date(item.tanggalPembuatan).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4">{item.stok}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <ViewIcon to={`/blendings/${item.id}/detail`} />
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

      {/* Inline Filter Modal */}
      {showFilter && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFilter(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Filter Kategori Produk
              </h3>
              <button
                onClick={() => setShowFilter(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 cursor-pointer" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Produk
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Kategori</option>
                  {categoryOptions.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setCategoryFilter("");
                  setShowFilter(false);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}