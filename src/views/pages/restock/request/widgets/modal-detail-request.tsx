import { formatNum } from "@/core/helpers/FormatNumber"
import { OptionType } from "@/core/interface/select-option-interface"
import { UncontrolledSelect } from "@/views/components/Input/uncontrolled/Select"
import { zodResolver } from "@hookform/resolvers/zod"
import moment from "moment"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { updateRequestRestockProductSchema } from "../../../request-stock/schema"
import { useProductRequestStockStore } from "@/core/stores/ProductRequestStockStore"

type ComponentProps = {
    request:{[key:string]:any}|null
}

export const ModalDetailRequest = ({ request }:ComponentProps) => {

    const { updateProductRequest, isFailure, isLoading } = useProductRequestStockStore()
    const [isEdited, setIsEdited] = useState(false)
    const [globalKey, setGlobalKey] = useState(0)

    const [statuses] = useState<any[]>([
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Setujui' },
        { value: 'rejected', label: 'Tolak' },
    ])

    const { control, formState, handleSubmit, watch, setValue, reset } = useForm({
        mode: 'onChange',
        defaultValues: {
            product_detail: [],
            status: request?.status ?? 'pending',
        },
        resolver: zodResolver(updateRequestRestockProductSchema)
    })
    const { errors } = formState
    const product_detail = watch('product_detail')
    const status = watch('status')

    const submitForm = async (data:any) => {
        await updateProductRequest(data, request?.id)
        if(!isFailure) {
            CloseModalDetailRequest()
            setIsEdited(false)
        }
    }

    useEffect(() => {
        setGlobalKey((old) => old+1)

        if(status !== 'approved') {
            setValue('product_detail', product_detail.map((item:any) => ({
                ...item,
                sended_stock: 0
            })), {shouldValidate: true})
        }
    }, [status])

    useEffect(() => {
        setIsEdited(false)

        const mapped_detail = request?.detail_request_stock?.map((item:any) => ({
            product_detail_id: item.product_detail_id,
            sended_stock: item.sended_stock ?? 0
        }))

        reset({
            status: request?.status ?? 'pending',
            product_detail: mapped_detail
        })
    }, [request])

    return (
        <div className="modal modal-lg fade" id="modal-detail-request" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-primary rounded-top">
                        <h5 className="modal-title text-white">Detail Permintaan Restock</h5>
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" className="text-white bg-transparent border-0 fs-6"><i className="ti ti-x"></i></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-12 col-md-6 mb-3">
                                <div className="border rounded p-2">
                                    <h5 className="fw-semibold text-primary">Data Outlet</h5>
                                    <table>
                                        <tr>
                                            <th>Nama</th>
                                            <td width={20} className="text-center">:</td>
                                            <td>{ request?.outlet?.name ?? "-" }</td>
                                        </tr>
                                        <tr>
                                            <th>Alamat</th>
                                            <td width={20} className="text-center">:</td>
                                            <td>{ request?.outlet?.address ?? "-" }</td>
                                        </tr>
                                        <tr>
                                            <th>Telp.</th>
                                            <td width={20} className="text-center">:</td>
                                            <td>{ request?.outlet?.telp ?? "-" }</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <div className="border rounded p-2">
                                    <h5 className="fw-semibold text-primary">Data Transaksi</h5>
                                    <table>
                                        <tr>
                                            <th>Tanggal Permintaan</th>
                                            <td width={20} className="text-center">:</td>
                                            <td>{ moment(request?.created_at).format('DD MMMM YYYY') }</td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td width={20} className="text-center">:</td>
                                            <td>
                                                {
                                                    isEdited
                                                    ? (
                                                        <>
                                                            <UncontrolledSelect
                                                                options={statuses}
                                                                value={status}
                                                                onChange={(selected) => {
                                                                    setValue('status', (selected as OptionType).value, {shouldValidate: true})
                                                                }}
                                                                key={globalKey}
                                                            />
                                                            <small className="text-danger">{errors.status?.message}</small>
                                                        </>
                                                    )
                                                    : (
                                                        request?.status == 'pending' ? <span className="badge bg-light-dark">Pending</span> :
                                                        request?.status == 'approved' ? <span className="badge bg-light-success text-success">Disetujui</span> :
                                                        request?.status == 'rejected' ? <span className="badge bg-light-danger text-danger">Ditolak</span> : 
                                                        <span className="badge bg-light-primary text-primary">{request?.status}</span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive rounded-1 overflow-hidden border">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th className="bg-light-primary text-primary py-2">Produk</th>
                                        <th className="bg-light-primary text-primary py-2 text-center">Unit</th>
                                        <th className="bg-light-primary text-primary py-2 text-center">Qty Diminta</th>
                                        <th className="bg-light-primary text-primary py-2 text-center" style={{ maxWidth: '200px' }}>Qty Dikirim</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !request?.detail_request_stock?.length
                                        ? <tr><th colSpan={4} className="text-muted text-center">-- tidak ada produk --</th></tr>
                                        : request?.detail_request_stock?.map((item:any, index:number) => (
                                            <tr key={index}>
                                                <th className="py-2">{ item.detail_product?.product?.name ?? '-' } | {item.detail_produk?.material ?? '-'}</th>
                                                <td className="py-2 text-center">{ item.detail_product?.unit ?? '-' }</td>
                                                <td className="py-2 text-center">{ formatNum((item.requested_stock ?? 0), true) }</td>
                                                <td className="py-2 text-center" style={{ maxWidth: 200 }}>
                                                    {
                                                        isEdited
                                                        ? (
                                                            <Controller
                                                                name={`product_detail.${index}.sended_stock`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                                                        <input
                                                                            {...field}
                                                                            type="number"
                                                                            className={`form-control ${errors.product_detail?.[index]?.sended_stock?.message ? 'is-invalid' : ''}`}
                                                                            placeholder="Permintaan Stok"
                                                                            min={0}
                                                                            onChange={(e) => {
                                                                                field.onChange(Number(e.target.value))
                                                                            }}
                                                                            value={field.value !== 0 ? field.value : ''}
                                                                            disabled={status !== 'approved'}
                                                                        />
                                                                        <small className="text-danger">{errors.product_detail?.[index]?.sended_stock?.message}</small>
                                                                    </div>
                                                                )}
                                                            />
                                                        )
                                                        : formatNum((item.sended_stock ?? 0), true)
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            isEdited
                            ? (
                                <>
                                    <button className="btn btn-muted" onClick={() => setIsEdited(false)}>Batal</button>
                                    <button className="btn btn-primary" onClick={handleSubmit(submitForm)}>Submit</button>
                                </>
                            )
                            : (
                                <>
                                    <button className="btn btn-muted" data-bs-dismiss="modal">Tutup</button>
                                    <button className="btn btn-warning" onClick={() => setIsEdited(true)}>Tanggapi</button>
                                </>
                            ) 
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BtnOpenDetailRequest = (props:any) => {
    return (
        <button className="btn btn-sm btn-primary" {...props}><i className="ti ti-eye"></i></button>
    )
}

export const OpenModalDetailRequest = () => $('#modal-detail-request').modal('show')
export const CloseModalDetailRequest = () => $('#modal-detail-request').modal('hide')