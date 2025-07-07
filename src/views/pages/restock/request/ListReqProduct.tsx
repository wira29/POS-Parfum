import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { SearchInput } from "@/views/components/SearchInput";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { ImageHelper } from "@/core/helpers/ImageHelper";

interface VariantItem {
  product_name: string;
  variant_name: string;
  requested_stock: number;
  unit_id: string;
  unit_code: string;
}

interface Warehouse {
  id: string;
  name: string;
  address: string;
  products: {
    product_name: string;
    product_description: string;
    variant_name: string;
    variant_code: string;
    unit_code: string;
    requested_stock: number;
    available_stock: number;
    total_price: number;
  }[];
}

interface StockRequest {
  id: string;
  outlet_id: string;
  warehouse_id: string;
  status: string;
  variant_chose: number;
  requested_stock_count: number;
  requested_at: string;
  note: string | null;
  requested_stock: VariantItem[];
  warehouse: Warehouse;
}

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: StockRequest[];
}

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

const InfoItem: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
}> = ({ label, value, valueClass = "" }) => (
  <div className="px-5 text-center">
    <p className="text-sm font-medium text-gray-800">{label}</p>
    <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
  </div>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    warning?: boolean;
    secondary?: boolean;
    info?: boolean;
  }
> = ({ children, className = "", ...rest }) => {
  const base = "rounded-lg px-3 py-2 text-sm font-medium transition-colors";
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
};

const ListReqProduct: React.FC = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search.trim());
      const res = await apiClient.get<ApiResponse>(
        `/stock-requests/by-warehouse?${query.toString()}`
      );
  console.log(res);
      if (res.data.success && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else {
        console.warn("Unexpected API response format");
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching stock requests:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchData();
    }, 300);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const HandleDetail = (id: string) => {
    navigate(`/request-pembelian/${id}/detail`);
  };

  return (
    <div className="flex flex-col gap-5 py-5">
      <Breadcrumb
        title="Request Pembelian"
        desc="menampilkan request pembelian"
      />
      <div className="w-1/4 mt-5">
        <SearchInput
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : data.length > 0 ? (
        <>
          {data.slice(0, 2).map((req) => (
            <Card key={req.id}>
              <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
                <div className="w-full lg:w-auto self-start rounded-xl border border-slate-300/50 p-3 flex-1">
                  {req.requested_stock.slice(0, 2).map((p, idx) => (
                    <div key={idx}>
                      {idx > 0 && (
                        <hr className="my-4 border-2 border-dotted border-gray-300" />
                      )}
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {p.product_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {req.warehouse.products.find(
                              (prod) =>
                                prod.product_name === p.product_name &&
                                prod.variant_name === p.variant_name
                            )?.product_description || "No description"}
                          </p>
                        </div>
                        <div className="flex gap-12">
                          <InfoItem
                            label="Total Pesanan"
                            value={`${p.requested_stock} Gram`}
                          />
                          <InfoItem
                            label="Stock Tersedia"
                            value={
                              req.warehouse.products.find(
                                (prod) =>
                                  prod.product_name === p.product_name &&
                                  prod.variant_name === p.variant_name
                              )?.available_stock
                                ? `${
                                    req.warehouse.products.find(
                                      (prod) =>
                                        prod.product_name === p.product_name &&
                                        prod.variant_name === p.variant_name
                                    )?.available_stock
                                  } Gram`
                                : "N/A"
                            }
                            valueClass={
                              req.warehouse.products.find(
                                (prod) =>
                                  prod.product_name === p.product_name &&
                                  prod.variant_name === p.variant_name
                              )?.available_stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          />
                          <InfoItem
                            label="Total Harga"
                            value={
                              req.warehouse.products.find(
                                (prod) =>
                                  prod.product_name === p.product_name &&
                                  prod.variant_name === p.variant_name
                              )?.total_price
                                ? `Rp.${req.warehouse.products
                                    .find(
                                      (prod) =>
                                        prod.product_name === p.product_name &&
                                        prod.variant_name === p.variant_name
                                    )
                                    ?.total_price.toLocaleString()}`
                                : "Rp.0"
                            }
                            valueClass="text-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {req.requested_stock.length > 2 && (
                    <div className="text-center mt-5 w-full">
                      <div  className="text-center text-gray-400 text-sm mt-4 border-t-2 border-dashed border-gray-300 py-5">
                        {req.requested_stock.length - 2}+ data lainnya
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-4 md:w-56">
                  <div className="text-center">
                    <img
                      src={
                        ImageHelper(req.warehouse.image) ||
                        "/placeholder-image.jpg"
                      }
                      alt={req.warehouse.name}
                      className="mb-2 h-32 w-full rounded-lg object-cover"
                    />
                    <p className="font-medium text-gray-900">
                      {req.warehouse.name}
                    </p>
                    <p className="text-sm font-normal text-gray-500">
                      {req.warehouse.address}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {req.status === "pending" && (
                      <>
                        <Button className="bg-gray-50 text-gray-500">
                          Menunggu
                        </Button>
                        <Button
                          onClick={() => HandleDetail(req.id)}
                          className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                        >
                          Selengkapnya
                        </Button>
                      </>
                    )}
                    {req.status === "rejected" && (
                      <>
                        <Button className="bg-red-50 text-red-500">
                          Ditolak
                        </Button>
                        <Button
                          onClick={() => HandleDetail(req.id)}
                          className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                        >
                          Selengkapnya
                        </Button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <>
                        <Button className="bg-blue-50 text-blue-500">
                          Diproses
                        </Button>
                        <Button
                          onClick={() => HandleDetail(req.id)}
                          className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                        >
                          Selengkapnya
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </>
      ) : (
        <div className="text-center text-gray-400 py-10">Tidak ada data</div>
      )}
    </div>
  );
};

export default ListReqProduct;
