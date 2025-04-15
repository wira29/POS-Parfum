import { formatNum } from "@/core/helpers/FormatNumber"
import { useProductStockStore } from "@/core/stores/ProductStockStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"
import moment from "moment"
import { useEffect } from "react"

export const RestockIndex = () => {

    const { firstGet, pagination, product_requests, setPage,  } = useProductStockStore()

    useEffect(() => {
        firstGet()
    }, [])

    return (
        <>
            <Breadcrumb title="Permintaan Restock" desc="Permintaan restock dari kepala outlet" />
            <div className="card rounded-lg">
                <div className="card-body">
                    <div className="mb-4 border rounded-1">
                        <table className="table text-nowrap mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Jumlah</th>
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !product_requests.length
                                    ? <tr><th colSpan={3} className="text-center text-muted">-- belum ada permintaan request --</th></tr>
                                    : product_requests.map((request, index) => (
                                        <tr key={index}>
                                            <th>{ request.detail_product?.product?.name ?? "" } - { request.detail_product?.material ?? '' }</th>
                                            <td>{ formatNum(request.requested_stock, true) } { request.detail_product?.unit }</td>
                                            <td>{ moment(request.created_at).format('DD MMMM YYYY') }</td>
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