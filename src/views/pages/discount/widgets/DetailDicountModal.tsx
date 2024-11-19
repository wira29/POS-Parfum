import { formatNum } from "@/core/helpers/FormatNumber";
import { useDiscountStore } from "@/core/stores/DiscountStore";

export default function DetailDiscountModal() {
    const {current_discount} = useDiscountStore()

    return (
        <div className="modal fade" tabIndex={-1} id="detail-discount-modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="card-title">Detail Diskon</h5>
                        <button type="button" data-bs-dismiss="modal" className="btn-close"></button>
                    </div>
                    <div className="modal-body">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th style={{ width: '170px' }}>Nama</th>
                                    <td>: {current_discount?.name}</td>
                                </tr>
                                <tr>
                                    <th style={{ width: '170px' }}>Deskripsi</th>
                                    <td>: {current_discount?.desc}</td>
                                </tr>
                                <tr>
                                    <th style={{ width: '170px' }}>Diskon</th>
                                    <td>: {current_discount?.discount} %</td>
                                </tr>
                                <tr>
                                    <th style={{ width: '170px' }}>Minimal Pembelian</th>
                                    <td>: Rp {formatNum(current_discount?.min, true)}</td>
                                </tr>
                                <tr>
                                    <th style={{ width: '170px' }}>Sisa Diskon</th>
                                    <td>: 10/{formatNum(current_discount?.max_used ?? '0', true)}</td>
                                </tr>
                                <tr>
                                    <th style={{ width: '170px' }}>Status</th>
                                    <td>: <span className="p-0">{current_discount?.active ? <span className="badge bg-primary">Aktif</span> : <span className="bg-warning">Tidak Aktif</span>}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BtnDetailDiscountModal = (props:{[key:string]:any}) => {
    return (<button type="button" className="dropdown-item d-flex align-items-center gap-3" data-bs-toggle="modal" data-bs-target="#detail-discount-modal" {...props} >
        <i className="fs-4 ti ti-eye"></i>Detail
    </button>)
}