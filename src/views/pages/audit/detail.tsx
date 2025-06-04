import { Toaster } from "@/core/helpers/BaseAlert";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface AuditItem {
    id: number;
    namaAudit: string;
    produk: string;
    tanggal: string;
    stokAsli: string;
    stokSistem: string;
    status: "Disetujui" | "Menunggu";
}

const mockData: AuditItem[] = [
    {
        id: 1,
        namaAudit: "Audit Parfum Josjis",
        produk: "Parfum Josjis",
        tanggal: "23 Mei 2025",
        stokAsli: "1000 Gram",
        stokSistem: "2000 Gram",
        status: "Disetujui",
    },
];

export const AuditDetail = () => {
    const data = mockData[0];

    const stokAsliNum = parseInt(data.stokAsli);
    const stokSistemNum = parseInt(data.stokSistem);
    const hasilAudit = `${stokAsliNum - stokSistemNum} Gram`;

    const navigate = useNavigate();

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
                navigate("/audit");
                Toaster('success', "Audit berhasil dihapus");
            }
        })
    }

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb
                title="Audit"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing."
            />

            <div className="bg-white shadow-md rounded-md p-6 space-y-6">
                <h2 className="text-lg font-semibold">Detail Audit (Nama Produk)</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden text-sm text-left">
                        <tbody className="text-gray-700">
                            {[
                                ["Nama Audit", data.namaAudit],
                                ["Produk", data.produk],
                                ["Stok Sistem", data.stokSistem],
                                ["Stok Asli", data.stokAsli],
                                [
                                    "Hasil Audit",
                                    <>
                                        {hasilAudit}
                                        <span className="text-gray-500 text-xs ml-2">(Asli - Sistem)</span>
                                    </>
                                ],
                                ["Tanggal Audit", data.tanggal],
                                [
                                    "Keterangan",
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate."
                                ],
                                [
                                    "Status",
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${data.status === "Disetujui"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {data.status}
                                    </span>
                                ]
                            ].map(([label, value], idx) => (
                                <tr className="border-b last:border-b-0 border-gray-300" key={idx}>
                                    <td className="px-4 py-3 font-medium w-1/4 bg-gray-50">{label}</td>
                                    <td className="px-4 py-3 border-l border-gray-200">{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                        type="button"
                        onClick={() => navigate('/audit')}
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
};
