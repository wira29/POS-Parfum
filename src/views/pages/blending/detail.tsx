import { Calendar } from "lucide-react";

export const BlendingDetail = () => {
    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md mb-6">
                <button className="flex items-center text-sm text-black font-medium hover:underline">
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke tabel
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 space-y-4">
                    <h2 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2">
                        Detail Blending
                    </h2>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Nama Blending:</p>
                        <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800">
                            Resep Parfum Racikan Mantap
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Quantity</p>
                        <div className="flex">
                            <div className="flex-1 bg-gray-50 border border-gray-300 border-r-0 rounded-l px-3 py-2 text-sm text-gray-800">
                                3000
                            </div>
                            <div className="bg-gray-100 border border-gray-300 border-l-0 rounded-r px-3 py-2 text-sm text-gray-800">
                                g
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Tanggal Pembuatan</p>
                        <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 space-x-2">
                            <span role="img" aria-label="calendar"><Calendar className="text-gray-600"/></span>
                            <span>12-09-2025</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Bahan Baku</p>
                        <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800">
                            5 Macam
                        </div>
                    </div>
                </div>


                <div className="lg:col-span-2 bg-white rounded-lg p-4 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 p-2 border-b border-gray-300">Cara Blending</h2>
                        <h3 className="font-medium text-gray-700 mb-1">Deskripsi Blending Produk</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            <span className="font-semibold">Langkah-Langkah Blending:</span> Lorem Ipsum Is Simply Dummy Text Of The Printing And
                            Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s, When An Unknown
                            Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries,
                            But Also The Leap Into Electronic Typesetting, Remaining Essentially Unchanged...
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-1">Komposisi Blending Produk</h3>
                        <p className="text-sm text-gray-600 mb-2">Bahan Baku:</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f1f3ff] text-gray-700">
                                    <tr>
                                        <th className="px-4 py-2">Produk</th>
                                        <th className="px-4 py-2">Varian Produk</th>
                                        <th className="px-4 py-2">Qty Digunakan</th>
                                        <th className="px-4 py-2">Stok</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, idx) => (
                                        <tr key={idx} className="bg-white">
                                            <td className="px-4 py-2">
                                                <div>
                                                    <div className="font-medium">Parfum Khas Solo</div>
                                                    <div className="text-xs text-gray-500">PR001</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">Varian Ungu 01</td>
                                            <td className="px-4 py-2">5000 G</td>
                                            <td className="px-4 py-2">10.000 G</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
