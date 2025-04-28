import { formatNum } from "@/core/helpers/FormatNumber"
import { useProductStockStore } from "@/core/stores/ProductStockStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"
import moment from "moment"
import { useEffect, useState } from "react"
import { BtnOpenDetailRequest, ModalDetailRequest, OpenModalDetailRequest } from "./widgets/modal-detail-request"

export const RestockIndex = () => {

    const { firstGet, pagination, product_requests, setPage,  } = useProductStockStore()

    const [selectedRequest, setSelectedRequest] = useState<any>(null)

    useEffect(() => {
        firstGet()
    }, [])

    return (
        <>
            <ModalDetailRequest request={selectedRequest} />
            <Breadcrumb title="Permintaan Restock" desc="Permintaan restock dari kepala outlet" />
            <div className="card rounded-lg">
                <div className="card-body">
                    <div className="mb-4 border rounded-1">
                        <table className="table text-nowrap mb-0 align-middle rounded-1 overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="bg-primary text-white rounded-start overflow-hidden">Outlet</th>
                                    <th className="text-center bg-primary text-white">Jumlah Produk</th>
                                    <th className="text-center bg-primary text-white">Status</th>
                                    <th className="bg-primary text-white">Tanggal</th>
                                    <th className="text-center bg-primary text-white rounded-end">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !product_requests.length
                                    ? <tr><th colSpan={5} className="text-center text-muted">-- belum ada permintaan request --</th></tr>
                                    : product_requests.map((request, index) => (
                                        <tr key={index}>
                                            <th>{ request.outlet?.name ?? "-" } | { request.outlet?.address ?? "-" }</th>
                                            <td className="text-center">{ formatNum((request.detail_request_stock?.length ?? 0), true) }</td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    {
                                                        request.status == 'pending' ? <span className="badge bg-light-dark">Pending</span> :
                                                        request.status == 'approved' ? <span className="badge bg-light-success text-success">Disetujui</span> :
                                                        request.status == 'rejected' ? <span className="badge bg-light-danger text-danger">Ditolak</span> : 
                                                        <span className="badge bg-light-primary text-primary">{request.status}</span>
                                                    }
                                                </div>
                                            </td>
                                            <td>{ moment(request.created_at).format('DD MMMM YYYY') }</td>
                                            <td>
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    <BtnOpenDetailRequest onClick={() => {
                                                        setSelectedRequest(request)
                                                        OpenModalDetailRequest()
                                                    }} />
                                                </div>
                                            </td>
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