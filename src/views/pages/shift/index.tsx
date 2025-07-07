import { useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { Clock, Triangle } from "lucide-react";

const shiftData = [
    {
        id: 1,
        user: "Davina Karamoy",
        photo: "/images/users/davina.png",
        shift: "Pagi",
        waktu: "05:01-17:00 WIB",
        tanggal: "12-03-2025",
        uangKeluar: 300000,
        uangMasuk: 3000000,
    },
    {
        id: 2,
        user: "Sheila Azizah",
        photo: "/images/users/sheila.png",
        shift: "Malam",
        waktu: "17:01-05:00 WIB",
        tanggal: "12-04-2025",
        uangKeluar: 300000,
        uangMasuk: 3000000,
    },
    {
        id: 3,
        user: "Davina Karamoy",
        photo: "/images/users/davina.png",
        shift: "Pagi",
        waktu: "05:01-17:00 WIB",
        tanggal: "12-03-2025",
        uangKeluar: 300000,
        uangMasuk: 3000000,
    },
    {
        id: 4,
        user: "Sheila Azizah",
        photo: "/images/users/sheila.png",
        shift: "Malam",
        waktu: "17:01-05:00 WIB",
        tanggal: "12-04-2025",
        uangKeluar: 300000,
        uangMasuk: 3000000,
    },
    {
        id: 5,
        user: "Davina Karamoy",
        photo: "/images/users/davina.png",
        shift: "Pagi",
        waktu: "05:01-17:00 WIB",
        tanggal: "12-03-2025",
        uangKeluar: 300000,
        uangMasuk: 3000000,
    },
    {
        id: 6,
        user: "Sheila Azizah",
        photo: "/images/users/sheila.png",
        shift: "Malam",
        waktu: "17:01-05:00 WIB",
        tanggal: "12-04-2025",
        uangKeluar: 300000,
        uangMasuk: 3000000,
    },
];

export default function ShiftIndex() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = shiftData.filter((item) =>
        item.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb title="Shift Kasir" desc="Riwayat shift dan transaksi kasir." />

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="flex-1 max-w-md">
                                <SearchInput
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Filter />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Uang Keluar</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Uang Masuk</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.photo}
                                                alt={item.user}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.user}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                            <Clock size={16} /> {item.waktu}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.tanggal}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                        <span className="inline-flex items-center gap-1">
                                            <svg width="30" height="30" viewBox="0 0 20 20">
                                                <polygon
                                                    points="10,7 15,13 5,13"
                                                    fill="red"
                                                    style={{
                                                        transformOrigin: "50% 60%",
                                                        transition: "transform 0.2s",
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                            </svg>
                                            Rp {item.uangKeluar.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                        <span className="inline-flex items-center gap-1">
                                            <svg width="30" height="30" viewBox="0 0 20 20">
                                                <polygon
                                                    points="10,7 15,13 5,13"
                                                    fill="green"
                                                    style={{
                                                        transform: "rotate(180deg)",
                                                        transformOrigin: "50% 60%",
                                                        transition: "transform 0.2s",
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                            </svg>
                                            Rp {item.uangMasuk.toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {filteredData.length} dari {shiftData.length} data
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">Previous</button>
                            <button className="px-3 py-2 text-sm bg-blue-500 text-white rounded">1</button>
                            <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">2</button>
                            <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">3</button>
                            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
