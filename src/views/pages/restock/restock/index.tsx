import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"
import { useEffect } from "react"
import { BtnOpenAddRestock, ModalAddRestock } from "./widgets/modal-add-restock"
import { useProductRestockStore } from "@/core/stores/ProductRestockStore"
import { formatNum } from "@/core/helpers/FormatNumber"
import moment from "moment"

export const RestockIndex = () => {

    const { firstGet, pagination, product_restocks, setPage, getProductRestocks  } = useProductRestockStore()

    useEffect(() => {
        firstGet()
    }, [])

    return (
        <>
            <ModalAddRestock onSuccessSubmit={getProductRestocks} />
            <Breadcrumb title="Restock" desc="Restock produk di outlet" button={<BtnOpenAddRestock   />} />
            <div className="card rounded-lg">
                <div className="card-body">
                    <div className="mb-4 border rounded-1">
                        <table className="table text-nowrap mb-0 align-middle rounded-1 overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="bg-primary text-white rounded-start overflow-hidden">Produk</th>
                                    <th className="text-center bg-primary text-white">Jumlah Produk</th>
                                    <th className="text-center bg-primary text-white">Alasan</th>
                                    <th className="text-center bg-primary text-white">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !product_restocks.length
                                    ? <tr><th colSpan={4} className="text-center text-muted">-- belum ada riwayat penambahan stok --</th></tr>
                                    : product_restocks.map((restock, index) => (
                                        <tr key={index}>
                                            <th>{ restock?.detail_product?.product?.name ?? "-" } | { restock?.detail_product?.material ?? "-" }</th>
                                            <td className="text-center">{ formatNum((restock.stock ?? 0), true) }</td>
                                            <td className="text-center">{ restock.reason ?? '-' }</td>
                                            <td>{ moment(restock.created_at).format('DD MMMM YYYY') }</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <Pagination paginationData={pagination} updatePage={setPage} />
                </div>
            </div>
        </>
    )
}