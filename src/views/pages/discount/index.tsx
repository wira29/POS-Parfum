import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import { useState } from "react";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import { Filter } from "@/views/components/Filter";
import Swal from "sweetalert2"
import { Toaster } from "@/core/helpers/BaseAlert";
import ViewIcon from "@/views/components/ViewIcon";

const FilterModal = ({
    open,
    onClose,
    statusFilter,
    setStatusFilter,
    kategoriFilter,
    setKategoriFilter,
    kategoriOptions,
}: {
    open: boolean;
    onClose: () => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    kategoriFilter: string;
    setKategoriFilter: (val: string) => void;
    kategoriOptions: string[];
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
                <div className="font-semibold text-lg mb-4">Filter Diskon</div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Status</label>
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value="Berlaku">Berlaku</option>
                        <option value="Tidak Berlaku">Tidak Berlaku</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Kategori Produk</label>
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={kategoriFilter}
                        onChange={e => setKategoriFilter(e.target.value)}
                    >
                        <option value="">Semua Kategori</option>
                        {kategoriOptions.map((kat, idx) => (
                            <option key={idx} value={kat}>{kat}</option>
                        ))}
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

interface Discount {
    id: number;
    name: string;
    date: string;
    kategori: string;
    stok: string;
    hargaNormal: string;
    hargaDiskon: string;
    status: string;
}

export default function DiscountIndex() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showFilter, setShowFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [kategoriFilter, setKategoriFilter] = useState("");

    const mockData: Discount[] = [
        { id: 1, name: "Parfum Siang", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 2, name: "Parfum Malam", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 3, name: "Parfum Sore", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 4, name: "Parfum Pagi", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 5, name: "Parfum Pria", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 6, name: "Ban Depan", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Tidak Berlaku" },
        { id: 7, name: "Velg BMW", date: "19/1/2025", kategori: "Velg", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 8, name: "Shogun RWB", date: "19/1/2025", kategori: "Motor", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Tidak Berlaku" },
        { id: 9, name: "Parfum Perempuan", date: "19/1/2025", kategori: "Parfum", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 10, name: "Makanan Kuda", date: "19/1/2025", kategori: "Makanan", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Tidak Berlaku" },
        { id: 11, name: "Dedek", date: "19/1/2025", kategori: "Parfum", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
    ];

    const kategoriOptions = Array.from(new Set(mockData.map(d => d.kategori)));

    const filteredData = mockData.filter((item) =>
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.status.toLowerCase().includes(searchQuery.toLowerCase())
        ) &&
        (statusFilter ? item.status === statusFilter : true) &&
        (kategoriFilter ? item.kategori === kategoriFilter : true)
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    function dellete() {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data diskon akan dihapus!",
            icon: 'question'
        }).then((result) => {
            if (!result.isConfirmed){
                return;
            }
            if (result.isConfirmed) {
                Toaster('success', "Diskon berhasil dihapus");
            }
        })
    }

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb title="Diskon Produk" desc="Menampilkan diskon yang aktif" />
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
                    <div className="w-full sm:w-auto">
                        <AddButton to="/discounts/create">Buat Diskon</AddButton>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
                        <thead className="bg-gray-100 border border-gray-300 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">Nama Produk</th>
                                <th className="px-6 py-4 font-medium">Waktu Berakhir</th>
                                <th className="px-6 py-4 font-medium">Kategori Product</th>
                                <th className="px-6 py-4 font-medium">Stok Tersedia</th>
                                <th className="px-6 py-4 font-medium">Harga Normal</th>
                                <th className="px-6 py-4 font-medium">Harga Diskon</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 text-gray-600 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4">{item.date}</td>
                                        <td className="px-6 py-4">{item.kategori}</td>
                                        <td className="px-6 py-4">{item.stok}</td>
                                        <td className="px-6 py-4">{item.hargaNormal}</td>
                                        <td className="px-6 py-4">{item.hargaDiskon}</td>
                                        <td className="px-6 py-4">{item.status}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <ViewIcon
                                                    to={`/discounts/${item.id}/detail`}
                                                />
                                                <EditIcon
                                                    to={`/discounts/${item.id}/edit`}
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
                setStatusFilter={val => setStatusFilter(val)}
                kategoriFilter={kategoriFilter}
                setKategoriFilter={val => setKategoriFilter(val)}
                kategoriOptions={kategoriOptions}
            />
        </div>
    );
}