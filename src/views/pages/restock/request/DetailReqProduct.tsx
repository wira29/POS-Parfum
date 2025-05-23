import { useState, ChangeEvent, useEffect, useRef } from "react";
import Card from "@/views/components/Card/Card";
import { SearchInput } from "@/views/components/SearchInput";
import { requests } from "@/core/data/requestRestock";
import { useParams } from "react-router-dom";
import { RetailRequestModal } from "@/views/components/UpdateStatusModal";

interface Product {
  id: number;
  name: string;
  code: string;
  qtyRequest: string;
  stock: string;
  qtyShipped: string;
  subtotal: string;
}

const DetailReqProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

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
      const mappedProducts = foundRequest.products.map((prod, index) => ({
        id: index + 1,
        name: prod.name,
        code: `PR${String(index + 1).padStart(3, "0")}`,
        qtyRequest: prod.totalOrder,
        stock: prod.stockAvailable,
        qtyShipped: "0",
        subtotal: prod.totalPrice,
      }));
      setProductData(mappedProducts);
    } else {
      setProductData([]);
    }
  }, [id]);

  const filteredProducts = productData.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleApprove = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen py-5 space-y-5">
      <Card>
        <div className="flex justify-start gap-18 items-start bg-white rounded-2xl">
          <div className="flex gap-4">
            <img
              src="/assets/images/products/image.png"
              alt="Store front"
              className="h-36 w-64 rounded-lg object-cover"
            />
            <div className="flex flex-col gap-1 text-left">
              <h1 className="text-2xl font-medium text-gray-800">Outlet</h1>
              <h2 className="text-lg font-medium text-gray-800">
                Retail Mandalika
              </h2>
              <p className="text-sm font-normal text-gray-500">
                Jl Ahmad Yani No 23 RT 4 Rw 5...
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
              <span className="border border-gray-300 rounded-md font-normal py-1 px-5 text-gray-500">
                Status
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-5">
          <div className="w-1/4">
            <SearchInput onChange={handleSearchChange} value={searchQuery} />
          </div>
          <button className="p-2 border border-blue-500 cursor-pointer rounded-md flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.25 12.0057H8.895M4.534 12.0057H2.75M4.534 12.0057C4.534 11.4276 4.76368 10.8731 5.17251 10.4643C5.58134 10.0554 6.13583 9.82575 6.714 9.82575C7.29217 9.82575 7.84666 10.0554 8.25549 10.4643C8.66432 10.8731 8.894 11.4276 8.894 12.0057C8.894 12.5839 8.66432 13.1384 8.25549 13.5472C7.84666 13.9561 7.29217 14.1858 6.714 14.1858C6.13583 14.1858 5.58134 13.9561 5.17251 13.5472C4.76368 13.1384 4.534 12.5839 4.534 12.0057ZM21.25 18.6128H15.502M15.502 18.6128C15.502 19.1911 15.2718 19.7462 14.8628 20.1551C14.4539 20.564 13.8993 20.7938 13.321 20.7938C12.7428 20.7938 12.1883 20.5631 11.7795 20.1542C11.3707 19.7454 11.141 19.1909 11.141 18.6128M15.502 18.6128C15.502 18.0344 15.2718 17.4803 14.8628 17.0714C14.4539 16.6625 13.8993 16.4327 13.321 16.4327C12.7428 16.4327 12.1883 16.6624 11.7795 17.0713C11.3707 17.4801 11.141 18.0346 11.141 18.6128M11.141 18.6128H2.75M21.25 5.39875H18.145M13.784 5.39875H2.75M13.784 5.39875C13.784 4.82058 14.0137 4.26609 14.4225 3.85726C14.8313 3.44843 15.3858 3.21875 15.964 3.21875C16.2503 3.21875 16.5338 3.27514 16.7983 3.38469C17.0627 3.49425 17.3031 3.65483 17.5055 3.85726C17.7079 4.05969 17.8685 4.30001 17.9781 4.5645C18.0876 4.82899 18.144 5.11247 18.144 5.39875C18.144 5.68503 18.0876 5.96851 17.9781 6.233C17.8685 6.49749 17.7079 6.73781 17.5055 6.94024C17.3031 7.14267 17.0627 7.30325 16.7983 7.41281C16.5338 7.52236 16.2503 7.57875 15.964 7.57875C15.3858 7.57875 14.8313 7.34907 14.4225 6.94024C14.0137 6.53141 13.784 5.97692 13.784 5.39875Z"
                stroke="#0059FF"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

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
                <th className="p-5 text-right text-gray-800 font-bold">
                  Subtotal Harga
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
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
                    {product.qtyShipped}
                  </td>
                  <td className="py-4 px-4 text-right">{product.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="text-gray-500 text-sm">
            {filteredProducts.length} Data
          </div>
          <button
            onClick={handleApprove}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-10 rounded-md cursor-pointer"
          >
            Tanggapi
          </button>
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
