import { useNavigate, useParams } from "react-router-dom";
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
      name: string;
      product_code: string;
    }
    varian: {
      variant_name: string;
    }
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
      console.log(data);

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
                varian: data.details.varian.variant_name || "Tidak Ada Varian",
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

  if (loading) {
    return (
      <div className="p-4 lg:p-6 text-center text-gray-500">
        Memuat detail diskon...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm rounded-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <button
                onClick={() => navigate("/discounts")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Kembali</span>
              </button>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">{detail.nama}</h1>
            </div>
          </div>
          
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              detail.status === "Aktif"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 mt-0.5 ${
                detail.status === "Aktif" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {detail.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">Jenis Diskon</span>
            </div>
            <p className="text-blue-800 font-semibold">{detail.nilai}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-sm font-medium text-green-900">Nilai Diskon</span>
            </div>
            <p className="text-green-800 font-semibold">{detail.nilai}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 7m0 6v4a2 2 0 002 2h2a2 2 0 002-2v-4M7 13v-3" />
              </svg>
              <span className="text-sm font-medium text-orange-900">Min. Pembelian</span>
            </div>
            <p className="text-orange-800 font-semibold">{detail.minPembelian}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm font-medium text-purple-900">Total Digunakan</span>
            </div>
            <p className="text-purple-800 font-semibold">{detail.totalDigunakan}x</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Tanggal Mulai</span>
            </div>
            <p className="text-gray-800 font-semibold">{detail.tanggalMulai}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Tanggal Berakhir</span>
            </div>
            <p className="text-gray-800 font-semibold">{detail.tanggalBerakhir}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Deskripsi Diskon
          </h3>
          <p className="text-gray-700 leading-relaxed">{detail.deskripsi}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Produk Terkait
          </h3>
          <div className="space-y-4">
            {detail.produkTerkait.map((produk, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nama Produk</span>
                    <p className="text-gray-900 font-medium">{produk.nama}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Varian</span>
                    <p className="text-gray-900 font-medium">{produk.varian}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Kode Produk</span>
                    <p className="block w-16 text-center px-2 py-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {produk.kode === "null" ? "-" : produk.kode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};