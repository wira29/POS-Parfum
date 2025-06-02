import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";

export const DiscountDetail = () => {
    const navigate = useNavigate();
    const [showProduk, setShowProduk] = useState(false);
    const { id } = useParams<{ id: string }>();

    const detail = {
        status: "Aktif",
        nama: "Diskon Special 11.11",
        jenis: "Persen",
        nilai: "10 %",
        minPembelian: "Rp 100,000",
        periode: "01-31 Mei 2025",
        deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate.",
        totalDigunakan: 13,
        produkTerkait: 3,
    };

    const produkTerkait = [
        {
            id: 1,
            nama: "Produk 1",
            kode: "PRO001",
            kategori: "Parfum Siang",
            img: "/img/parfum.png",
            varian: [
                { id: 1, nama: "Varian 1", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
                { id: 2, nama: "Varian 2", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
                { id: 3, nama: "Varian 3", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
                { id: 4, nama: "Varian 4", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
            ]
        },
        {
            id: 2,
            nama: "Produk 1",
            kode: "PRO001",
            kategori: "Parfum Siang",
            img: "/img/parfum.png",
            varian: [
                { id: 1, nama: "Varian 1", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
                { id: 2, nama: "Varian 2", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
                { id: 3, nama: "Varian 3", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
                { id: 4, nama: "Varian 4", kode: "PRO001", kategori: "Parfum Siang", image: "/img/varian.png" },
            ]
        },
        {
            id: 3,
            nama: "Produk 1",
            kode: "PRO001",
            kategori: "Parfum Siang",
            img: "/img/parfum.png",
            varian: []
        }
    ];

    const collapseAnim = (show: boolean) =>
        show
            ? "transition-all duration-300 ease-in-out max-h-[1000px] opacity-100 scale-y-100"
            : "transition-all duration-300 ease-in-out max-h-0 opacity-0 scale-y-95 overflow-hidden";

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb title="Diskon Produk" desc="Menampilkan diskon yang aktif" />

            <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-white shadow-md rounded-xl p-6 flex-1 max-w-2xl">
                    <div className="bg-white rounded-xl p-6 flex-1 max-w-2xl">
                        <div className="border-b-2 border-gray-100 mb-3">
                            <div className="text-lg font-semibold mb-4">Detail [Nama Diskon]</div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Status</div>
                                <div className="flex items-center gap-4">
                                    <div>:</div>
                                    <div>
                                        <span className="inline-flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                            <span className="text-green-600 font-semibold">{detail.status}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Nama Diskon</div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div>:</div>
                                    <div>{detail.nama}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Jenis</div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div>:</div>
                                    <div>{detail.jenis}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Nilai</div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div>:</div>
                                    <div>{detail.nilai}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Minimum Pembelian</div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div>:</div>
                                    <div>{detail.minPembelian}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Periode</div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div>:</div>
                                    <div>{detail.periode}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Deskripsi</div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div>:</div>
                                    <div>{detail.deskripsi}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 text-sm mb-3">
                            <div className="flex">
                                <div className="min-w-70">Total Digunakan</div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div>:</div>
                                    <div>{detail.totalDigunakan} <span className="font-bold">x</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 gap-5">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md text-sm font-semibold"
                                onClick={() => navigate("/discounts")}
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 min-w-120 max-w-sm">
                    <div className="bg-white rounded-xl shadow-md p-0 flex flex-col">
                        <button
                            className="flex items-center justify-between w-full text-left px-6 py-4 font-semibold text-lg"
                            onClick={() => setShowProduk((v) => !v)}
                        >
                            <span>Produk Terkait : {produkTerkait.length}</span>
                            {showProduk ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        <div className="border-b border-gray-100" />
                        <div className={collapseAnim(showProduk)}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-700 border-b border-gray-100">
                                            <th className="py-2 px-4 font-semibold text-left w-10">No</th>
                                            <th className="py-2 px-4 font-semibold text-left">Produk</th>
                                            <th className="py-2 px-4 font-semibold text-left">Kategori</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produkTerkait.map((produk, idx) => {

                                            return (
                                                <tr key={produk.id} className="align-top border-b border-dashed border-gray-100">
                                                    <td className="py-4 px-4 font-bold align-top">{idx + 1}.</td>
                                                    <td className="py-4 px-4 align-top">
                                                        <div className="flex items-start gap-3">
                                                            <img src={produk.img} alt={produk.nama} className="w-12 h-12 rounded object-cover border" />
                                                            <div>
                                                                <div className="font-semibold">{produk.nama}</div>
                                                                <div className="text-xs text-gray-500">Kode : {produk.kode}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 align-top">{produk.kategori}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};