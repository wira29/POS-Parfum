import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useState, useEffect } from "react";

interface ProductDetail {
  nama: string;
  varian: string;
  kode: string;
}

interface DiscountDetail {
  id: string;
  name: string;
  desc: string | null;
  min: number;
  discount: number;
  used: number;
  type: string | null;
  start_date: string | null;
  expired: string | null;
  active: number;
  details: {
    id: string;
    product: {
      name:string;
      product_code:string;
    }
    variant_name: string;
    material: string;
    unit: string;
    stock: number;
    capacity: number;
    weight: number;
    density: number;
    price: number;
    price_discount: number;
  } | null;
}

interface DisplayDetail {
  status: string;
  nama: string;
  jenis: string;
  nilai: string;
  minPembelian: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  deskripsi: string;
  totalDigunakan: number;
  produkTerkait: ProductDetail[];
}

const formatCurrency = (value: number): string => {
  return `Rp ${value.toLocaleString("id-ID")}`;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "31 Desember 2025";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const DiscountDetail = () => {
  const navigate = useNavigate();
  const ApiClient = useApiClient();
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DisplayDetail>({
    status: "Aktif",
    nama: "Diskon Tidak Diketahui",
    jenis: "% (Persen)",
    nilai: "0 %",
    minPembelian: "Rp 0",
    tanggalMulai: "1 Januari 2025",
    tanggalBerakhir: "31 Desember 2025",
    deskripsi: "Tidak ada deskripsi tersedia.",
    totalDigunakan: 0,
    produkTerkait: [
      {
        nama: "Produk Tidak Ditentukan",
        varian: "Tidak Ada Varian",
        kode: "N/A",
      },
    ],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getData = async () => {
    if (!id) {
      setError("ID diskon tidak valid");
      setLoading(false);
      return;
    }
    try {
      const response = await ApiClient.get<{ data: DiscountDetail }>(
        `/discount-vouchers/${id}`
      );
      const data = response.data.data;
         
      const displayDetail: DisplayDetail = {
        status: data.active === 1 ? "Aktif" : "Tidak Aktif",
        nama: data.name || "Diskon Tidak Diketahui",
        jenis: data.type === "Rp" ? "Rp (Rupiah)" : "% (Persen)",
        nilai: data.discount < 100 ? "% (persen)" : "Rp (rupiah)",
        minPembelian: formatCurrency(data.min),
        tanggalMulai: formatDate(data.start_date),
        tanggalBerakhir: formatDate(data.expired),
        deskripsi: data.desc || "Tidak ada deskripsi tersedia.",
        totalDigunakan: data.used || 0,
        produkTerkait: data.details
          ? [
              {
                nama: data.details.product.name || "Produk Tidak Ditentukan",
                varian: data.details.variant_name || "Tidak Ada Varian",
                kode: data.details.product.product_code || "N/A",
              },
            ]
          : [
              {
                nama: "Produk Tidak Ditentukan",
                varian: "Tidak Ada Varian",
                kode: "N/A",
              },
            ],
      };

      setDetail(displayDetail);
    } catch (error) {
      console.error("Gagal mengambil data diskon:", error);
      setError("Gagal mengambil data diskon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div className="py-10">
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/discounts")}
                className="flex items-center gap-2 text-white hover:text-blue-200 cursor-pointer"
                aria-label="Kembali ke daftar diskon"
              >
                <FiArrowLeft size={20} />
                <span className="font-medium">Kembali</span>
              </button>
            </div>
          </div>

          <div className="my-4">
            <div className="max-w-full mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-200 p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                          Detail Diskon
                        </h2>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                detail.status === "Aktif"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span
                              className={`font-medium ${
                                detail.status === "Aktif"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {detail.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 lg:p-6 space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Diskon
                          </label>
                          <input
                            type="text"
                            value={detail.nama}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jenis
                          </label>
                          <input
                            type="text"
                            value={detail.jenis}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nilai
                          </label>
                          <input
                            type="text"
                            value={detail.nilai}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Pembelian
                          </label>
                          <input
                            type="text"
                            value={detail.minPembelian}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Mulai
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={detail.tanggalMulai}
                              readOnly
                              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Berakhir
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={detail.tanggalBerakhir}
                              readOnly
                              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl">
                    <div className="border-b border-gray-200 p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                          Telah digunakan sebanyak :
                        </h2>
                        <h2 className="text-lg lg:text-2xl font-semibold text-blue-500">
                          {detail.totalDigunakan}x
                        </h2>
                      </div>
                    </div>
                    <div className="py-4 px-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Deskripsi Diskon
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {detail.deskripsi}
                      </p>
                      <div className="w-full border border-slate-400/[0.3] my-4"></div>
                    </div>

                    <div className="px-4 pb-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Produk Terkait
                      </h3>
                      <div className="space-y-3">
                        {detail.produkTerkait.map((produk, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Produk</span>
                              <span className="text-gray-900">
                                {produk.nama}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Varian Produk
                              </span>
                              <span className="text-gray-900">
                                {produk.varian}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Kode Produk</span>
                              <span className="text-gray-900">
                                {produk.kode}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
