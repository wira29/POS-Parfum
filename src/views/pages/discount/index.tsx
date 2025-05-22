import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import { useState } from "react";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { DeleteIcon } from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";

interface Discount {
    id : number;
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

    const mockData: Discount[] = [
        { id: 1 ,name: "Parfum Siang", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 2 ,name: "Parfum Malam", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 3 ,name: "Parfum Sore", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 4 ,name: "Parfum Pagi", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 5 ,name: "Parfum Pria", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 6 ,name: "Ban Depan", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 7 ,name: "Velg BMW", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 8 ,name: "Shogun RWB", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 9 ,name: "Parfum Perempuan", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 10 ,name: "Makanan Kuda", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
        { id: 11 ,name: "Dedek", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: "Rp.500.000", status: "Berlaku" },
    ];

    const filteredData = mockData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                        <Filter />
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
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
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
                                                <EditIcon
                                                    to={`/discounts/${item.id}/edit`}
                                                    className="text-blue-500 hover:text-blue-700"
                                                />
                                                <DeleteIcon />
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
        </div>
    )
}