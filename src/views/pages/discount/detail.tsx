import { Link, useParams } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Tag,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { FormatTime } from "@/core/helpers/FormatTime";

interface ProductDetail {
  nama: string;
  varian: string;
  kode: string;
  category: string;
  image: string | null;
}

interface DiscountDetail {
  id: string;
  name: string;
  description: string | null;
  minimum_purchase: number;
  percentage: number | null;
  nominal: number | null;
  is_member: number;
  used: number;
  type: string | null;
  active: number;
  start_date: string | null;
  end_date: string | null;
  product_detail: any | null;
}

interface DisplayDetail {
  status: string;
  member: string;
  nama: string;
  jenis: string;
  nilai: string;
  minPembelian: string;
  start_date: string;
  description: string;
  end_date: string;
  totalDigunakan: number;
  produkTerkait: ProductDetail[];
}

const formatCurrency = (value?: number | null): string => {
  const safeValue = typeof value === "number" ? value : 0;
  return `Rp ${safeValue.toLocaleString("id-ID")}`;
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
  const ApiClient = useApiClient();
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DisplayDetail>({
    status: "Aktif",
    nama: "Diskon Tidak Diketahui",
    jenis: "Tidak Diketahui",
    member: "Semua Pengguna",
    nilai: "0",
    minPembelian: "Rp 0",
    start_date: "1 Januari 2025",
    end_date: "31 Desember 2025",
    description: "Tidak ada deskripsi tersedia.",
    totalDigunakan: 0,
    produkTerkait: [
      {
        nama: "Produk Contoh",
        varian: "Varian Contoh",
        category: "Kategori Contoh",
        kode: "Code product",
        image: null,
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
        jenis: data.type
          ? data.type === "nominal"
            ? "Rp (Rupiah)"
            : "% (Persen)"
          : "Tidak Diketahui",
        member: data.is_member === 1 ? "Khusus Member" : "Semua Pengguna",
        nilai:
          data.type === "nominal" && data.nominal !== null
            ? formatCurrency(data.nominal)
            : data.percentage !== null
            ? `${data.percentage}%`
            : "0",
        minPembelian: formatCurrency(data.minimum_purchase),
        start_date: formatDate(data.start_date),
        end_date: formatDate(data.end_date),
        description: data.description || "Tidak ada deskripsi tersedia.",
        totalDigunakan: data.used || 0,
        produkTerkait: data.product_detail
          ? [
              {
                nama:
                  data.product_detail?.product_name ||
                  "Produk Tidak Ditentukan",
                varian:
                  data.product_detail?.variant_name ||
                  "Tidak Ada Varian",
                category:
                  data.product_detail?.product_category ||
                  "Tidak Ada Kategori",
                kode: data.product_detail?.variant_code || "N/A",
                image: ImageHelper(data.product_detail?.product_image) || null,
              },
            ]
          : [
              {
                nama: "Produk Contoh",
                varian: "Varian Contoh",
                category: "Kategori Contoh",
                kode: "Code",
                image: null,
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
    return <div className="p-4 lg:p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-blue-600 w-full rounded-lg py-3 px-4 flex">
        <Link
          to="/discounts"
          className="flex gap-2 text-white cursor-pointer hover:text-blue-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-medium">Jenis Diskon</span>
          </div>
          <p className="text-blue-800 font-semibold">{detail.jenis}</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Untuk</span>
          </div>
          <p className="text-orange-800 font-semibold">{detail.member}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <span className="text-sm font-medium">Status Diskon</span>
          </div>
          <p className="text-green-800 font-semibold">{detail.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Detail Diskon</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Diskon
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-gray-800">{detail.nama}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nilai
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center">
                <span className="text-blue-600 font-medium mr-2">
                  {detail.jenis.includes("Rp") ? "Rp" : "%"}
                </span>
                <p className="text-gray-800">
                  {detail.nilai.replace("Rp ", "").replace("%", "")}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Pembelian
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center">
                <span className="text-blue-600 font-medium mr-2">Rp</span>
                <p className="text-gray-800">
                  {detail.minPembelian.replace("Rp ", "")}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Mulai
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center">
                <Calendar className="w-4 h-4 text-green-600 mr-2" />
                <p className="text-gray-800">{FormatTime(detail.start_date)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Berakhir
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center">
                <Calendar className="w-4 h-4 text-red-600 mr-2" />
                <p className="text-gray-800">{FormatTime(detail.end_date)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                <h2 className="text-lg font-semibold">
                  Telah Digunakan Sebanyak: {detail.totalDigunakan}x
                </h2>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Deskripsi Diskon</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{detail.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-blue-600">
                <Package className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Produk Terkait</h2>
              </div>
            </div>
            <div className="p-4">
              {detail.produkTerkait.map((produk, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-30 h-30 overflow-hidden bg-gradient-to-br rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={ImageHelper(produk.image)} alt={produk.nama} />
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div>
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-medium">Nama Produk</span>
                      </div>
                      <p className="text-gray-800 font-medium">{produk.nama}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <span className="text-sm font-medium">
                          Kategori Produk
                        </span>
                      </div>
                      <p className="text-gray-800">{produk.category}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm font-medium">Nama Varian</span>
                      </div>
                      <p className="text-gray-800">{produk.varian}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <span className="text-sm font-medium">Kode Varian</span>
                      </div>
                      <span className="bg-blue-50 rounded-full px-2 py-1.5 text-xs font-medium text-blue-500">{produk.kode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
