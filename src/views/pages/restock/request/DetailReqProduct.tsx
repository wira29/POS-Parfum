import { useState, useEffect, useRef } from "react";
import Card from "@/views/components/Card/Card";
import { useParams, useNavigate } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { RetailRequestModal } from "@/views/components/UpdateStatusModal";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { ModalReqPembelian } from "@/views/components/ModalReqPembelian";

interface Product {
  id: number;
  name: string;
  code: string;
  qtyRequest: string;
  stock: string;
  qtyShipped: string;
  unitPrice: string;
  subtotal: string;
}

interface VariantItem {
  product_name: string;
  variant_name: string;
  requested_stock: number;
  kategori: string;
  variant_code: string;
  unit_id: string | null;
  unit_code: string | null;
  price: number | null;
  sended_stock: number;
  stock_warehouse: number;
}

interface Warehouse {
  id: string;
  name: string;
  alamat: string;
  telp: string;
  image: string;
}

interface StockRequest {
  id: string;
  outlet_id: string;
  warehouse_id: string;
  status: string;
  store_name: string | null;
  total_price: number;
  store_location: string | null;
  variant_chose: number;
  requested_stock_count: number;
  requested_at: string;
  note: string | null;
  requested_stock: VariantItem[] | null;
  warehouse: Warehouse;
}

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: StockRequest[] | null;
}

const DetailReqProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [requestDetail, setRequestDetail] = useState<StockRequest | null>(null);
  const apiClient = useApiClient();
  const navigate = useNavigate();

  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && handleModalClose();
    const handleClickOutside = (e: MouseEvent) =>
      modalRef.current &&
      !modalRef.current.contains(e.target as Node) &&
      handleModalClose();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchRequestDetail = async () => {
      try {
        const res = await apiClient.get<ApiResponse>(`/stock-request/${id}`);
        console.log(res.data.data);
        
        if (res.data.success && res.data.data.length > 0) {
          const request = res.data.data[0];
          setRequestDetail(request);

          const mappedProducts: Product[] = request.requested_stock.map(
            (prod, index) => ({
              id: index + 1,
              name: prod.product_name,
              code: prod.variant_code,
              qtyRequest: prod.requested_stock.toString(),
              stock: prod.stock_warehouse ? prod.stock_warehouse.toString() : "-",
              qtyShipped: prod.sended_stock.toString(),
              unitPrice: prod.price ? prod.price.toString() : "0",
              subtotal: "0",
            })
          );
          setProductData(mappedProducts);
        } else {
          setRequestDetail(null);
          setProductData([]);
          console.warn("No valid data received from API:", res.data.message || "No message provided");
        }
      } catch (err) {
        console.error("Error fetching request details:", err);
        setRequestDetail(null);
        setProductData([]);
      }
    };
    fetchRequestDetail();
  }, [id]);

  const handleModalSubmit = () => setIsModalOpen(false);

  const handleInputChange = (
    index: number,
    field: "qtyShipped" | "unitPrice",
    value: string
  ) => {
    const updatedProducts = [...productData];
    updatedProducts[index][field] = value;

    const qty = parseInt(updatedProducts[index].qtyShipped, 10) || 0;
    const price = parseInt(updatedProducts[index].unitPrice, 10) || 0;
    updatedProducts[index].subtotal = (qty * price).toString();

    setProductData(updatedProducts);
  };

  const statusLabel: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  const statusStyle: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-100 border-yellow-300",
    approved: "text-green-600 bg-green-100 border-green-300",
    rejected: "text-red-600 bg-red-100 border-red-300",
  };

  return (
    <div className="min-h-screen py-5 space-y-5">
      <Card>
        <div className="flex justify-start gap-18 items-start py-3">
          <div className="flex gap-4">
            <img
              src={
                ImageHelper(requestDetail?.warehouse?.image) ||
                "/assets/images/products/image.png"
              }
              alt="Store front"
              className="h-36 w-64 rounded-lg object-cover"
            />
            <div className="flex flex-col gap-1 text-left">
              <h1 className="text-2xl font-medium text-gray-800">Outlet</h1>
              <h2 className="text-lg font-medium text-gray-800">
                {requestDetail?.warehouse.name || "-"}
              </h2>
              <p className="text-sm font-normal text-gray-500">
                {requestDetail?.warehouse.alamat || "-"}
              </p>
              <p className="text-sm font-normal text-gray-500">
                {requestDetail?.warehouse.telp || "(+62) 811-0220-0010"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 text-left">
            <h1 className="text-2xl font-medium text-gray-800">Transaksi</h1>
            <div className="flex gap-2 items-center text-sm">
              <span className="font-medium text-gray-800">Tanggal:</span>
              <span className="font-normal text-gray-500">
                {requestDetail?.requested_at.split("T")[0] || "21 Mei 2025"}
              </span>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <span className="font-medium text-gray-800">Status:</span>
              <span
                className={`rounded-md font-normal py-1 px-5 capitalize text-sm border ${
                  statusStyle[requestDetail?.status ?? "pending"]
                }`}
              >
                {statusLabel[requestDetail?.status ?? "pending"]}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="w-full overflow-x-auto rounded-xl">
          <table className="w-full border border-slate-300/[0.5]">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-5 text-left text-gray-800 font-bold">
                  Produk
                </th>
                <th className="p-5 text-center text-gray-800 font-bold">
                  Qty Request
                </th>
                <th className="p-5 text-center text-gray-800 font-bold">
                  Stock
                </th>
                <th className="p-5 text-center text-gray-800 font-bold">
                  Qty Dikirim
                </th>
                <th className="p-5 text-center text-gray-800 font-bold">
                  Harga
                </th>
                <th className="p-5 text-right text-gray-800 font-bold">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {productData.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-400/[0.5]"
                >
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {product.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {product.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {product.qtyRequest}
                  </td>
                  <td className="py-4 px-4 text-center">{product.stock}</td>
                  <td className="py-4 px-4 text-center">
                    <input
                      type="text"
                      placeholder="0"
                      value={product.qtyShipped}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length > 1 && val.startsWith("0"))
                          val = val.replace(/^0+/, "");
                        handleInputChange(index, "qtyShipped", val);
                      }}
                      disabled={requestDetail?.status !== "pending"}
                      className="w-20 px-2 py-1 border border-slate-400/[0.5] outline-none rounded-md text-center disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <input
                      type="text"
                      placeholder="0"
                      value={
                        product.unitPrice === ""
                          ? ""
                          : Number(product.unitPrice).toLocaleString("id-ID")
                      }
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length > 1 && val.startsWith("0"))
                          val = val.replace(/^0+/, "");
                        handleInputChange(index, "unitPrice", val);
                      }}
                      disabled={requestDetail?.status !== "pending"}
                      className="w-24 px-2 py-1 border border-slate-400/[0.5] outline-none rounded-md text-center disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-4 text-right">
                    Rp {Number(product.subtotal).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-5 justify-end mt-4">
          <button onClick={() => navigate("/request-pembelian")} className="bg-gray-500 rounded text-white py-1.5 px-4 cursor-pointer hover:bg-gray-600">Kembali</button>
          {requestDetail?.status === "pending" && (
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 rounded text-white py-1.5 px-4 cursor-pointer hover:bg-blue-600">Tanggapi</button>
          )}
        </div>
      </Card>

      <ModalReqPembelian
        isOpen={isModalOpen}
        auditId={id} 
        productData={productData}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default DetailReqProduct;