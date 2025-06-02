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
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    quantity,
    setQuantity,
}: {
    open: boolean;
    onClose: () => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;
    quantity: string;
    setQuantity: (val: string) => void;
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[600px] min-h-[400px]">
                <div className="font-semibold text-lg mb-4">Filter</div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Tanggal Pembuatan</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="border rounded px-2 py-1 w-full"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            placeholder="From"
                        />
                        <input
                            type="date"
                            className="border rounded px-2 py-1 w-full"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            placeholder="To"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        className="border rounded px-2 py-1 w-full"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        placeholder="Quantity"
                        min={0}
                    />
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

interface BlendingProduct {
    id: number;
    nama: string;
    tanggalPembuatan: string;
    kategori: string;
    stok: string;
    hargaNormal: string;
    hargaDiskon: string;
    status: string;
    products: {
        nama: string;
        harga: string;
        gambar: string;
        variants: { nama: string; harga: string }[];
    }[];
}

const blendingDummy: BlendingProduct[] = [
    {
        id: 1,
        nama: "Resep Parfum Racikan Mantap",
        tanggalPembuatan: "2025-12-13",
        kategori: "Parfum Premium",
        stok: "2000G",
        hargaNormal: "Rp 500.000",
        hargaDiskon: "Rp 350.000",
        status: "Berlaku",
        products: [
            {
                nama: "Parfum Siang",
                harga: "Rp 120.000",
                gambar: "/img/parfum.png",
                variants: [
                    { nama: "Varian Siang", harga: "Rp 120.000" },
                    { nama: "Varian Malam", harga: "Rp 130.000" },
                ]
            },
            {
                nama: "Parfum Malam",
                harga: "Rp 130.000",
                gambar: "/img/parfum2.png",
                variants: [
                    { nama: "Varian Lemon", harga: "Rp 110.000" },
                    { nama: "Varian Mint", harga: "Rp 115.000" },
                ]
            }
        ]
    },
    {
        id: 2,
        nama: "Resep Parfum Segar",
        tanggalPembuatan: "2025-05-13",
        kategori: "Parfum Segar",
        stok: "1500G",
        hargaNormal: "Rp 400.000",
        hargaDiskon: "Rp 300.000",
        status: "Berlaku",
        products: [
            {
                nama: "Parfum Floral",
                harga: "Rp 100.000",
                gambar: "/img/parfum3.png",
                variants: [
                    { nama: "Varian Mawar", harga: "Rp 100.000" },
                    { nama: "Varian Melati", harga: "Rp 105.000" },
                ]
            },
            {
                nama: "Parfum Citrus",
                harga: "Rp 110.000",
                gambar: "/img/parfum4.png",
                variants: [
                    { nama: "Varian Lemon", harga: "Rp 110.000" },
                    { nama: "Varian Orange", harga: "Rp 112.000" },
                ]
            }
        ]
    },
    {
        id: 3,
        nama: "Resep Parfum Maskulin",
        tanggalPembuatan: "2025-05-13",
        kategori: "Parfum Pria",
        stok: "800G",
        hargaNormal: "Rp 600.000",
        hargaDiskon: "Rp 450.000",
        status: "Berlaku",
        products: [
            {
                nama: "Parfum Woody",
                harga: "Rp 140.000",
                gambar: "/img/parfum5.png",
                variants: [
                    { nama: "Varian Woody", harga: "Rp 140.000" },
                    { nama: "Varian Musk", harga: "Rp 145.000" },
                ]
            },
            {
                nama: "Parfum Leather",
                harga: "Rp 150.000",
                gambar: "/img/parfum6.png",
                variants: [
                    { nama: "Varian Leather", harga: "Rp 150.000" },
                    { nama: "Varian Tobacco", harga: "Rp 155.000" },
                ]
            }
        ]
    },
];

export default function BlendingIndex() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showFilter, setShowFilter] = useState(false);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [quantity, setQuantity] = useState("");

    const filteredData = blendingDummy.filter((item) => {
        const matchSearch =
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.status.toLowerCase().includes(searchQuery.toLowerCase());

        let matchDate = true;
        if (dateFrom) {
            matchDate = item.tanggalPembuatan >= dateFrom;
        }
        if (matchDate && dateTo) {
            matchDate = item.tanggalPembuatan <= dateTo;
        }

        let matchQty = true;
        if (quantity) {
            const stokNum = parseInt(item.stok.replace(/[^0-9]/g, ""), 10);
            matchQty = stokNum >= parseInt(quantity, 10);
        }

        return matchSearch && matchDate && matchQty;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb title="Blending Produk" desc="Menampilkan blending yang aktif" />
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
                        <AddButton to="/">Tambah Blending</AddButton>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
                        <thead className="bg-gray-100 border border-gray-300 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">Nama Blending</th>
                                <th className="px-6 py-4 font-medium">Tanggal Pembuatan</th>
                                <th className="px-6 py-4 font-medium">Stok</th>
                                <th className="px-6 py-4 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 text-gray-600 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4"> <span className="text-black text-base font-semibold">{item.nama}</span><br /> Terdiri dari {item.products.length} Product</td>
                                        <td className="px-6 py-4">
                                            {item.tanggalPembuatan
                                                ? new Date(item.tanggalPembuatan).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4">{item.stok}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <ViewIcon
                                                    to={`/blendings/${item.id}/detail`}
                                                />
                                                <EditIcon
                                                    to={`/blendings/${item.id}/edit`}
                                                    className="text-blue-500 hover:text-blue-700"
                                                />
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
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                quantity={quantity}
                setQuantity={setQuantity}
            />
        </div>
    );
}