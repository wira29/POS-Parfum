import { useTransactionStore } from "@/core/stores/TransactionStore";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import Card from "@/views/components/Card/Card";
import { Filter } from "@/views/components/Filter";
import { Pagination } from "@/views/components/Pagination";
import { SearchInput } from "@/views/components/SearchInput";
import ViewIcon from "@/views/components/ViewIcon";
import { Printer, PrinterCheck } from "lucide-react";
import moment from "moment";
import React, { useEffect } from "react";
import { BsPrinterFill } from "react-icons/bs";

export const RiwayatPenjualan: React.FC = () => {
  const { items, getAll, search, page, setState, pagination } =
    useTransactionStore();

  const handlePageChange = (page: number) => setState("page", page);

  useEffect(() => {
    getAll(true);
  }, []);

  return (
    <div className="py-3 sm:py-5 px-2 sm:px-6 bg-gray-50 min-h-screen">
      <Breadcrumb title="Riwayat Penjualan" desc="Riwayat Penjualan pusat" />
      <Card className="mt-3 sm:mt-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          <div className="w-full sm:w-1/3 md:w-1/4">
            <SearchInput
              onChange={(val) => setState("search", val)}
              value={search}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Filter />
          </div>
        </div>
        <hr className="my-2 sm:my-4 border-gray-200" />
        <table className="w-full">
          <thead className="bg-gray-100 border-y border-gray-200 text-gray-700 hidden sm:table-header-group">
            <tr>
              <td className="text-left font-semibold px-2 sm:px-4 py-1 sm:py-2 hidden sm:table-cell">
                Nama Kasir
              </td>
              <td className="text-left font-semibold px-2 sm:px-4 py-1 sm:py-2 hidden sm:table-cell">
                Nama Pembeli
              </td>
              <td className="text-left font-semibold px-2 sm:px-4 py-1 sm:py-2 hidden sm:table-cell">
                Jumlah Yang Di Beli
              </td>
              <td className="text-left font-semibold px-2 sm:px-4 py-1 sm:py-2 hidden sm:table-cell">
                Total Harga
              </td>
              <td className="text-left font-semibold px-2 sm:px-4 py-1 sm:py-2 hidden sm:table-cell">
                Tanggal Pembelian
              </td>
              <td className="text-left font-semibold px-2 sm:px-4 py-1 sm:py-2">
                Aksi
              </td>
            </tr>
          </thead>
          <tbody>
            {items.length <= 0 ? (
              <tr className="bg-white text-slate-500 border-b border-slate-200">
                <td colSpan={6} className="text-center py-2 sm:py-4">
                  Tidak ada riwayat transaksi
                </td>
              </tr>
            ) : (
              items.map((data) => (
                <tr
                  key={data.id}
                  className="bg-white text-slate-500 border-b border-slate-200 even:bg-gray-100"
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {data.cashier_name ?? "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {data.buyer_name}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {data.quantity} Produk
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    Rp {data.amount_price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {moment(data.payment_time).format("DD MMMM YYYY")}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4">
                    <div className="flex justify-center gap-2">
                      <button className="bg-green-600 p-2 rounded text-white flex items-center gap-1  hover:bg-green-800"><BsPrinterFill className="cursor-pointer"/></button>
                      <ViewIcon to={`/riwayat-penjualan/${data.id}/detail`} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={pagination.last_page}
          onPageChange={handlePageChange}
          showInfo
          totalItems={pagination.total}
          itemsPerPage={pagination.per_page}
        />
      </Card>
    </div>
  );
};
