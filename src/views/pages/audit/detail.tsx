import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { RetailRequestModal } from "@/views/components/UpdateStatusModal";
import { Toaster } from "@/core/helpers/BaseAlert";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
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
  weight: number;
  density: number;
  price: number;
  discount_price: number;
  product_variant_id: string;
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
      <div className="bg-white shadow-sm rounded-lg p-5">
        <button
          onClick={() => navigate("/audit")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-5 cursor-pointer"
        >
          ← Kembali
        </button>
        <h2 className="text-lg font-semibold mb-6">{audit.name}</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[150px]">Tanggal</span>
              <span>:</span>
            </div>
            <h1 className="text-gray-700">{audit.date}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[150px]">
                Produk variant yang di audit
              </span>
              <span>:</span>
            </div>
            <h1 className="text-gray-700">{summary.total_items} product</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[150px]">Toko</span>
              <span>:</span>
            </div>
            <h1 className="text-gray-700">{store.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[150px]">Outlet</span>
              <span>:</span>
            </div>
            <h1 className="text-gray-700">{outlet.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium min-w-[150px]">Status</span>
              <span>:</span>
            </div>
            <div
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
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
        </div>
        <div className="border w-full my-5 border-slate-100"></div>
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Kode Varian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Stok Sistem
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Stok Asli
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {audit_items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.product.material}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.product.material}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.product.product_variant_id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={item.old_stock}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md bg-white text-gray-900 focus:outline-none"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600">
                          {item.unit.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={item.audit_stock}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md bg-white text-gray-900 focus:outline-none"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600">
                          {item.unit.name}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/audit")}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Kembali
          </button>
          {audit.status === "pending" && (
            <button
              type="button"
              onClick={handleRespond}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
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