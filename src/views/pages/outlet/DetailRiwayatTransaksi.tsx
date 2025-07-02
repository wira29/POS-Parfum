import { Breadcrumb } from "@/views/components/Breadcrumb";
import Card from "@/views/components/Card/Card";

export const DetailRiwayatTransaksi = () => {
  return (
    <div className="max-w-6xl py-5">
      <Breadcrumb
        title="Detail Riwayat Transaksi"
        desc="kumpulan Data  Riwayat Transaksi"
      />

      <div className="flex gap-5 mt-5">
        <Card className="flex-4">
          <div className="py-4">
            <img src="/images/logos/logo-new.png" className="h-10" alt="Logo" />
            <hr className="border border-gray-200 mt-3" />
          </div>
          <div className="flex justify-between items-center text-slate-500 font-semibold">
            <h1>Detail Transaksi#3321</h1>
            <h1 className="font-medium">Tanggal 12 Juni 2025</h1>
          </div>
          <hr className="border border-gray-200 mt-3" />
        </Card>
        <Card className="flex-2">
          <h1>s</h1>
        </Card>
      </div>
    </div>
  );
};
