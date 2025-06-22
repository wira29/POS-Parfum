import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { RetailRequestModal } from "@/views/components/UpdateStatusModal";
import { Toaster } from "@/core/helpers/BaseAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";

interface Audit {
  id: string;
  name: string;
  description: string;
  status: "approved" | "pending" | "rejected";
  reason: string | null;
  date: string;
  created_at: string | null;
  updated_at: string | null;
}

interface Store {
  id: string;
  name: string;
  address: string;
  logo: string | null;
  tax: number;
}

interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  image: string | null;
}

interface Unit {
  id: string;
  name: string;
  code: string;
}

interface Product {
  id: string;
  material: string;
  unit: string;
  stock: number;
  capacity: number;
  variant_name:string;
  weight: number;
  density: number;
  price: number;
  discount_price: number;
  product_code: string;
  product_name: string;
}

interface AuditItem {
  id: string;
  product_detail_id: string;
  old_stock: number;
  audit_stock: number;
  difference: number;
  unit: Unit;
  product: Product;
}

interface Summary {
  total_items: number;
  items_with_discrepancy: number;
  total_shortage: number;
}

interface AuditDetailResponse {
  success: boolean;
  message: string;
  data: {
    audit: Audit;
    store: Store;
    outlet: Outlet;
    audit_items: AuditItem[];
    summary: Summary;
  };
}

const statusMap: Record<Audit["status"], string> = {
  approved: "Disetujui",
  pending: "Menunggu",
  rejected: "Ditolak",
};

export const AuditDetail = () => {
  const { id } = useParams<{ id: string }>();
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [auditDetail, setAuditDetail] = useState<AuditDetailResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAuditDetail = async () => {
    if (!id) {
      setError("ID audit tidak valid.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AuditDetailResponse>(`audit/${id}`);
      setAuditDetail(response.data.data);
    } catch (err) {
      setError("Gagal mengambil detail audit. Silakan coba lagi.");
      Toaster("error", "Gagal mengambil detail audit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditDetail();
  }, [id]);

  console.log(auditDetail);
  

  const handleRespond = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 text-center text-gray-500">
        Memuat detail audit...
      </div>
    );
  }

  if (error || !auditDetail) {
    return (
      <div className="p-4 lg:p-6 text-center text-red-500">
        {error || "Data audit tidak ditemukan."}
      </div>
    );
  }

  const { audit, store, outlet, audit_items, summary } = auditDetail;

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      <Breadcrumb
        title="Detail Audit"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing."
      />
      
      <div className="bg-white shadow-sm rounded-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">{audit.name}</h1>
            </div>
          </div>
          
          <div
            className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
              audit.status === "approved"
                ? "bg-green-100 text-green-700"
                : audit.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusMap[audit.status]}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">Tanggal</span>
            </div>
            <p className="text-blue-800 font-semibold">{audit.date}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm font-medium text-purple-900">Produk Diperiksa</span>
            </div>
            <p className="text-purple-800 font-semibold">{summary.total_items} Produk</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
             <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
              <span className="text-sm font-medium text-green-900">Toko</span>
            </div>
            <p className="text-green-800 font-semibold">{store.name}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-orange-900">Outlet</span>
            </div>
            <p className="text-orange-800 font-semibold">{outlet.name}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Produk</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Varian</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Kode Varian</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Stok Sistem</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Stok Asli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {audit_items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product.product_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.product.variant_name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.product.product_code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center max-w-32">
                      <input
                        type="text"
                        value={item.old_stock}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md bg-white text-gray-900 focus:outline-none"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600 whitespace-nowrap">
                        {item.unit.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center max-w-32">
                      <input
                        type="text"
                        value={item.audit_stock}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md bg-white text-gray-900 focus:outline-none"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600 whitespace-nowrap">
                        {item.unit.name}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/audit")}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-medium rounded-lg transition-colors"
          >
            Kembali
          </button>
          {audit.status === "pending" && (
            <button
              type="button"
              onClick={handleRespond}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium rounded-lg transition-colors"
            >
              Tanggapi
            </button>
          )}
        </div>
      </div>

      <RetailRequestModal
        isOpen={isModalOpen}
        auditId={id}
        description={{
          descriptionApproved: `Anda Menerima Audit "${audit.name}" (ID: ${id || ""}).`,
          descriptionRejected: `Anda Menolak Audit "${audit.name}" (ID: ${id || ""}), sehingga audit tidak diproses.`,
        }}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          setIsModalOpen(false);
          fetchAuditDetail();
        }}
      />
    </div>
  );
};