import { Breadcrumb } from "@/views/components/Breadcrumb";
import Card from "@/views/components/Card/Card";
import { Filter } from "@/views/components/Filter";
import { Pagination } from "@/views/components/Pagination";
import { SearchInput } from "@/views/components/SearchInput";
import ViewIcon from "@/views/components/ViewIcon";
import React, { useState } from "react";

interface DataRiwayat {
  id: string | number;
  name_cashier: string;
  name_customer: string;
  count_transactions: number | string;
  count_price: number | string;
  date: string;
}

export const RiwayatPenjualan: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const DataDumyData: DataRiwayat[] = [
    {
      id: 1,
      name_cashier: "Achmad Fulan",
      name_customer: "Budi Santoso",
      count_transactions: 3,
      count_price: 150000,
      date: "2025-07-01",
    },
    {
      id: 2,
      name_cashier: "Siti Aminah",
      name_customer: "Ani Wijaya",
      count_transactions: 2,
      count_price: 75000,
      date: "2025-06-30",
    },
    {
      id: 3,
      name_cashier: "Rudi Hartono",
      name_customer: "Dedi Pratama",
      count_transactions: 5,
      count_price: 300000,
      date: "2025-06-29",
    },
    {
      id: 4,
      name_cashier: "Lina Sari",
      name_customer: "Eka Putri",
      count_transactions: 1,
      count_price: 45000,
      date: "2025-06-28",
    },
    {
      id: 5,
      name_cashier: "Hadi Wijaya",
      name_customer: "Fajar Rahman",
      count_transactions: 4,
      count_price: 225000,
      date: "2025-06-27",
    },
  ];

  const filterData = DataDumyData.filter((item) => {
    const NameCashier = item.name_cashier || "";
    const NameCustomer = item.name_customer || "";

    return (
      NameCashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      NameCustomer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFristItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterData.slice(indexOfFristItem, indexOfLastItem);
  const totalPage = Math.ceil(filterData.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-3 sm:py-5 px-2 sm:px-6 bg-gray-50 min-h-screen">
      <Breadcrumb title="Riwayat Transaksi" desc="Riwayat transaksi pusat" />
      <Card className="mt-3 sm:mt-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          <div className="w-full sm:w-1/3 md:w-1/4">
            <SearchInput onChange={handleSearchChange} value={searchTerm} />
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
            {currentItems.length <= 0 ? (
              <tr className="bg-white text-slate-500 border-b border-slate-200">
                <td colSpan={6} className="text-center py-2 sm:py-4">
                  Tidak ada riwayat transaksi
                </td>
              </tr>
            ) : (
              currentItems.map((data) => (
                <tr
                  key={data.id}
                  className="bg-white text-slate-500 border-b border-slate-200 even:bg-gray-100"
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {data.name_cashier}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {data.name_customer}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {data.count_transactions} Produk
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    Rp.{data.count_price.toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 text-left font-normal hidden sm:table-cell">
                    {data.date}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4">
                    <div className="flex justify-center gap-2">
                      <ViewIcon to={`/detail-transaksi/${data.id}/detail`} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          showInfo
          totalItems={filterData.length}
          itemsPerPage={itemsPerPage}
        />
      </Card>
    </div>
  );
};