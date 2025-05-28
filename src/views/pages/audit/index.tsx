import { useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { Pagination } from "@/views/components/Pagination";
import ViewIcon from "@/views/components/ViewIcon";
import DeleteIcon from "@/views/components/DeleteIcon";
import { Filter } from "@/views/components/Filter";
import Swal from "sweetalert2";
import { Toaster } from "@/core/helpers/BaseAlert";

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
}: {
  open: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <div className="font-semibold text-lg mb-4">Filter Audit</div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Status Audit</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Menunggu">Menunggu</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

interface AuditItem {
  id: number;
  namaAudit: string;
  produk: string;
  tanggal: string;
  stokAsli: string;
  stokSistem: string;
  status: "Disetujui" | "Menunggu";
}

export const AuditIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const mockData: AuditItem[] = [
    {
      id: 1,
      namaAudit: "Audit Parfum Josjis",
      produk: "Parfum Josjis",
      tanggal: "23 Mei 2025",
      stokAsli: "100 Gram",
      stokSistem: "200 Gram",
      status: "Disetujui",
    },
    {
      id: 2,
      namaAudit: "Audit Parfum Josjis",
      produk: "Parfum Josjis",
      tanggal: "23 Mei 2025",
      stokAsli: "100 Gram",
      stokSistem: "200 Gram",
      status: "Disetujui",
    },
    {
      id: 3,
      namaAudit: "Audit Parfum Josjis",
      produk: "Parfum Josjis",
      tanggal: "23 Mei 2025",
      stokAsli: "100 Gram",
      stokSistem: "200 Gram",
      status: "Disetujui",
    },
    {
      id: 4,
      namaAudit: "Audit Parfum Josjis",
      produk: "Parfum Josjis",
      tanggal: "23 Mei 2025",
      stokAsli: "100 Gram",
      stokSistem: "200 Gram",
      status: "Menunggu",
    },
    {
      id: 5,
      namaAudit: "Audit Parfum Josjis",
      produk: "Parfum Josjis",
      tanggal: "23 Mei 2025",
      stokAsli: "100 Gram",
      stokSistem: "200 Gram",
      status: "Menunggu",
    },
    {
      id: 6,
      namaAudit: "Audit Parfum Josjis",
      produk: "Parfum Josjis",
      tanggal: "23 Mei 2025",
      stokAsli: "100 Gram",
      stokSistem: "200 Gram",
      status: "Menunggu",
    },
  ];

  const filteredData = mockData.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.namaAudit.toLowerCase().includes(q) ||
      item.produk.toLowerCase().includes(q) ||
      item.tanggal.toLowerCase().includes(q) ||
      item.stokAsli.toLowerCase().includes(q) ||
      item.stokSistem.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q);

    const matchStatus = statusFilter ? item.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function dellete() {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data Audit akan dihapus!",
      icon: 'question'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      if (result.isConfirmed) {
        Toaster('success', "Audit berhasil dihapus");
      }
    })
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Audit" desc="Lorem ipsum dolor sit amet, consectetur adipiscing." />

      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Filter onClick={() => setShowFilter(true)} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Audit</th>
                <th className="px-6 py-4 font-medium">Produk</th>
                <th className="px-6 py-4 font-medium">Tanggal Audit</th>
                <th className="px-6 py-4 font-medium">Stok Asli</th>
                <th className="px-6 py-4 font-medium">Stok Sistem</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">{item.namaAudit}</td>
                    <td className="px-6 py-4">{item.produk}</td>
                    <td className="px-6 py-4">{item.tanggal}</td>
                    <td className="px-6 py-4">{item.stokAsli}</td>
                    <td className="px-6 py-4">{item.stokSistem}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Disetujui"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <ViewIcon
                          to={`/audit/${item.id}/detail`}
                          className="text-blue-500 hover:text-blue-700"
                        />
                        <DeleteIcon onClick={dellete} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
          <span className="text-gray-700">{filteredData.length} Data</span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={statusFilter}
        setStatusFilter={val => {
          setStatusFilter(val);
          setShowFilter(false);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};