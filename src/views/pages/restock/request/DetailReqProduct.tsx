import { useState, useEffect, useRef } from "react";
import Card from "@/views/components/Card/Card";
import { requests } from "@/core/data/requestRestock";
import { Link, useParams } from "react-router-dom";
import { RetailRequestModal } from "@/views/components/UpdateStatusModal";

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

interface ProdFromRequest {
  name: string;
  totalOrder: string;
  stockAvailable: string;
  qtyShipped?: string;
  unitPrice?: string;
}

const DetailReqProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [requestDetail, setRequestDetail] = useState<
    (typeof requests)[0] | null
  >(null);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleModalClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleModalClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    const requestId = Number(id);
    const foundRequest = requests.find((req) => req.id === requestId);
    if (foundRequest) {
      setRequestDetail(foundRequest);
      const mappedProducts: Product[] = foundRequest.products.map(
        (prod: ProdFromRequest, index) => ({
          id: index + 1,
          name: prod.name,
          code: `PR${String(index + 1).padStart(3, "0")}`,
          qtyRequest: prod.totalOrder,
          stock: prod.stockAvailable,
          qtyShipped: prod.qtyShipped ?? "",
          unitPrice: prod.unitPrice ?? "",
          subtotal:
            prod.qtyShipped && prod.unitPrice
              ? (Number(prod.qtyShipped) * Number(prod.unitPrice)).toString()
              : "0",
        })
      );

      setProductData(mappedProducts);
    } else {
      setRequestDetail(null);
      setProductData([]);
    }
  }, [id]);

  const handleApprove = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (
    index: number,
    field: "qtyShipped" | "unitPrice",
    value: string
  ) => {
    const updatedProducts = [...productData];
    updatedProducts[index][field] = value;

    const qty = parseInt(updatedProducts[index].qtyShipped, 10);
    const price = parseInt(updatedProducts[index].unitPrice, 10);

    const qtyNumber = isNaN(qty) ? 0 : qty;
    const priceNumber = isNaN(price) ? 0 : price;

    updatedProducts[index].subtotal = (qtyNumber * priceNumber).toString();

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
              src={requestDetail?.image ?? "/assets/images/products/image.png"}
              alt="Store front"
              className="h-36 w-64 rounded-lg object-cover"
            />
            <div className="flex flex-col gap-1 text-left">
              <h1 className="text-2xl font-medium text-gray-800">Outlet</h1>
              <h2 className="text-lg font-medium text-gray-800">
                {requestDetail?.retailName ?? "-"}
              </h2>
              <p className="text-sm font-normal text-gray-500">
                {requestDetail?.retailAddress ?? "-"}
              </p>
              <p className="text-sm font-normal text-gray-500">
                (+62) 811-0220-0010
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-left">
            <h1 className="text-2xl font-medium text-gray-800">Transaksi</h1>
            <div className="flex gap-2 items-center text-sm">
              <span className="font-medium text-gray-800">Tanggal:</span>
              <span className="font-normal text-gray-500">21 Mei 2025</span>
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
                  Quantity Request
                </th>
                <th className="p-5 text-center text-gray-800 font-bold">
                  Stock
                </th>
                <th className="p-5 text-center text-gray-800 font-bold">
                  Quantity Dikirim
                </th>
                <th className="p-5 text-center text-gray-800 font-bold">
                  Harga
                </th>
                <th className="p-5 text-right text-gray-800 font-bold">
                  Subtotal Harga
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
                        if (val.length > 1 && val.startsWith("0")) {
                          val = val.replace(/^0+/, "");
                        }
                        handleInputChange(index, "qtyShipped", val);
                      }}
                      disabled={requestDetail?.status !== "pending"}
                      className="w-20 px-2 py-1 border border-slate-400/[0.5] outline-none rounded-md text-center disabled:bg-gray-100"
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
                        if (val.length > 1 && val.startsWith("0")) {
                          val = val.replace(/^0+/, "");
                        }
                        handleInputChange(index, "unitPrice", val);
                      }}
                      disabled={requestDetail?.status !== "pending"}
                      className="w-24 px-2 py-1 border border-slate-400/[0.5] outline-none rounded-md text-center disabled:bg-gray-100"
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

        <div className="flex justify-between items-center mt-5">
          <div className="text-gray-500 text-sm">{productData.length} Data</div>
          <div className="flex gap-5">
          <Link
            to={`/request-stock`}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-500/[0.5] text-slate-500 py-2 px-10 rounded-md cursor-pointer"
          >
            Kembali
          </Link>
          <button
            onClick={handleApprove}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-10 rounded-md cursor-pointer"
          >
            Tanggapi
          </button>

          </div>
        </div>
      </Card>

      <RetailRequestModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default DetailReqProduct;
