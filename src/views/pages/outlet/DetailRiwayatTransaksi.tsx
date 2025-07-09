import { formatNum } from "@/core/helpers/FormatNumber";
import { TransactionDetailType, useTransactionStore } from "@/core/stores/TransactionStore";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import Card from "@/views/components/Card/Card";
import { Calendar, CheckCircle, CreditCard, User } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const DetailRiwayatTransaksi = () => {
  const { id } = useParams<{id: string}>()
  const { current_item, getDetail } = useTransactionStore()
  const data = current_item as TransactionDetailType|undefined


  const [open, setOpen] = useState(false);

  useEffect(() => getDetail(id), [id])

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
            <h1 className="text-lg">Detail Transaksi#{data?.transaction_code}</h1>
            <h1 className="font-medium text-sm sm:text-base mt-2 sm:mt-0">
              Tanggal {moment(data?.created_at).format('DD MMMM YYYY')}
            </h1>
          </div>
          <hr className="border border-gray-200 mt-3" />
          <div className="flex justify-between gap-4 mt-10 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Nama Pembeli:
              </h3>
              <p className="text-gray-600 text-sm">
                {data?.buyer_name ?? '-'}
                {/* <br />
                -,
                <br />
                - */}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Nama Kasir:
              </h3>
              <p className="text-gray-600 text-sm">
                {data?.kasir_name}
                {/* <br />
                Kd Sisx45678910 */}
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
                {data?.details.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-gray-800 font-semibold">
                          {product.product_name ?? '-'}
                        </p>
                        {product.variant_name && (
                          <p className="text-xs text-gray-500 mt-1">
                            {product.variant_name ?? '-'}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      Rp {formatNum(product.price, true)}
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      {product.quantity}
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      {product.discount}%
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-semibold">
                      Rp {formatNum(product.total_price, true)}
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
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal Transaksi</span>
                    <span className="font-medium">
                      Rp {formatNum(data?.details.reduce((acc, item) => acc + item.price, 0) as number, true)}
                    </span>
                  </div> */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-medium">
                      Rp {formatNum(data?.total_barang ?? 0, true)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diskon</span>
                    <span className="font-medium">
                      Rp {formatNum(data?.total_discount ?? 0, true)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pajak</span>
                    <span className="font-medium">Rp {formatNum(data?.total_tax ?? 0, true)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-800">Total Transaksi</span>
                    <span className="text-gray-800">
                      Rp {formatNum(data?.total_price ?? 0, true)}
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

            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="font-medium text-gray-600 mb-2">Detail:</h3>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {formatNum(data?.total_price as number, true)}
                </p>
              </div>
              {/* <div>
                <select className="text-sm border cursor-pointer border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Dibayar</option>
                  <option>Pending</option>
                  <option>Gagal</option>
                </select>
              </div> */}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Nama Kasir:{" "}
                    <span className="font-normal text-gray-600">{data?.kasir_name ?? '-'}</span>
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
                      {moment(data?.created_at).format('HH:mm')} WIB | {moment(data?.created_at).format('DD MMMM YYYY')}
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
                    Dibayar Dengan {data?.payment_method.toUpperCase() ?? '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* <hr className="border-gray-200 mb-6" />

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
            </button> */}
          </div>
        </Card>
      </div>
    </div>
  );
};
