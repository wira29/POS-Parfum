import { Breadcrumb } from "@/views/components/Breadcrumb";
import Card from "@/views/components/Card/Card";
import { Calendar, CheckCircle, CreditCard, User } from "lucide-react";
import { useState } from "react";

export const DetailRiwayatTransaksi = () => {
  const [open, setOpen] = useState(false);
  const products = [
    {
      name: "Parfum 9pm Edo",
      variant: "Varian Sang Seri Edo",
      price: 300000,
      qty: 30,
      discount: 50,
      total: 150000,
    },
    {
      name: "Parfum 9pm Edo",
      variant: "Varian Sang Seri Edo",
      price: 300000,
      qty: 30,
      discount: 50,
      total: 150000,
    },
    {
      name: "Parfum 9pm Edo",
      variant: "Varian Sang Seri Edo",
      price: 300000,
      qty: 30,
      discount: 50,
      total: 150000,
    },
    {
      name: "Parfum 9pm Edo",
      variant: "Varian Sang Seri Edo",
      price: 300000,
      qty: 50,
      discount: 50,
      total: 150000,
    },
    {
      name: "Parfum 9pm Edo",
      variant: "Varian Sang Seri Edo",
      price: 300000,
      qty: 30,
      discount: 60,
      total: 150000,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  return (
    <div className="w-full py-5 px-4">
      <Breadcrumb
        title="Detail Riwayat Transaksi"
        desc="kumpulan Data Riwayat Transaksi"
      />

      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        <Card className="flex-1 lg:flex-[5]">
          <div className="py-4">
            <img src="/images/logos/logo-new.png" className="h-10" alt="Logo" />
            <hr className="border border-gray-200 mt-3" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-slate-500 font-semibold mb-4">
            <h1 className="text-lg">Detail Transaksi#3321</h1>
            <h1 className="font-medium text-sm sm:text-base mt-2 sm:mt-0">
              Tanggal 12 Juni 2025
            </h1>
          </div>
          <hr className="border border-gray-200 mt-3" />
          <div className="flex justify-between gap-4 mt-10 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Nama Penjual:
              </h3>
              <p className="text-gray-600 text-sm">
                Retail Monoeluka,
                <br />
                Jl27 Braded2780910 Jl Sobo Pihak Pno42 Sukemaharja,
                <br />
                Kabupaten, Kab Malang
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Nama Pembeli:
              </h3>
              <p className="text-gray-600 text-sm">
                Yusuf Asslam,
                <br />
                Kd Sisx45678910
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">
                    Produk
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">
                    Harga
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">
                    Qty
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">
                    Diskon
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">
                    Total Harga
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-gray-800 font-semibold">
                          {product.name}
                        </p>
                        {product.variant && (
                          <p className="text-xs text-gray-500 mt-1">
                            {product.variant}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      {product.qty} Pcs
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      {product.discount}%
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      {formatCurrency(product.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-full sm:w-80">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal Transaksi</span>
                    <span className="font-medium">
                      {formatCurrency(1500000)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Harga Barang</span>
                    <span className="font-medium">
                      {formatCurrency(1500000)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diskon</span>
                    <span className="font-medium">
                      {formatCurrency(750000)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pajak</span>
                    <span className="font-medium">{formatCurrency(10000)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-800">Total Transaksi</span>
                    <span className="text-gray-800">
                      {formatCurrency(750000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex-1 lg:flex-[2] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6 bg-green-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-green-600">
                Transaksi Berhasil
              </h2>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-medium text-gray-600 mb-2">Detail:</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(750000)}
                </p>
              </div>
              <div>
                <select className="text-sm border cursor-pointer border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Dibayar</option>
                  <option>Pending</option>
                  <option>Gagal</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Nama Kasir:{" "}
                    <span className="font-normal text-gray-600">Yustiar</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Waktu:{" "}
                    <span className="font-normal text-gray-600">
                      23:00 WIB | 23 Juni 2025
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Dibayar Dengan Cash
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 mb-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 font-medium">
                  Barang Dipesan
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  12:00 WIB | 21 Juni 2025
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 font-medium">
                  Barang Diproses
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  03:00 WIB | 22 Juni 2025
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 font-medium">
                  Pembayaran
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  12:00 WIB | 23 Juni 2025
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 mt-10 transition-all duration-500 ease-in-out">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Catatan
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed transition-all duration-500 ease-in-out">
                Sambelnya dipisah
                <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia
                ea similique quaerat sunt, laboriosam perspiciatis sapiente
                quasi ex aliquid impedit
                {open && (
                  <>
                    <span>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Quam voluptatibus incidunt sapiente, assumenda molestiae
                      beatae ad consequuntur? Modi ad, non placeat provident
                      quasi vitae dolor in sed officia consectetur ipsam.
                    </span>
                  </>
                )}
              </p>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="text-blue-600 cursor-pointer text-sm font-medium hover:text-blue-700 transition-colors"
            >
              {open ? "Lebih Sedikit" : "Selengkapnya"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
