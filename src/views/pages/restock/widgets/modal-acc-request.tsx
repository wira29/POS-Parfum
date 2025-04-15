import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestRestockProductSchema, requestRestockProductType } from '../schema'
import { useWarehouseStore } from '@/core/stores/WarehouseStore'
import { useEffect, useState } from 'react'
import { OptionType } from '@/core/interface/select-option-interface'
import InputTextLabel from '@/views/components/Input/hook-form/InputTextLabel'
import InputSelectLabel from '@/views/components/Input/hook-form/InputSelectLabel'
import { useProductStockStore } from '@/core/stores/ProductStockStore'


type ComponentProps = {
    product?: {[key:string]:any},
    detail?: {[key:string]:any},
}

export default function AccRequestModal({product, detail}: ComponentProps) {

    const [globalKey, setGlobalKey] = useState(0)
    const [warehouseOptions, setWarehouseOptions] = useState<OptionType[]>([])
    const { setPerPage, warehouses } = useWarehouseStore()
    const { createProductRequest, isFailure } = useProductStockStore()

    const { control, formState, reset, handleSubmit } = useForm({
        mode: 'onChange',
        defaultValues: {
            product_detail_id: '',
            warehouse_id: '',
            requested_stock: 0,
        },
        resolver: zodResolver(requestRestockProductSchema)
    })

    const { errors } = formState

    const onSubmit = async (data:requestRestockProductType) => {
        await createProductRequest(data)
        if(!isFailure) $('#modal-request-restock').modal('hide')
    }

    useEffect(() => {
        setPerPage(999)
    }, [])

    useEffect(() => {
        const mapped_warehouses = warehouses.map((w) => ({
            value: w.id,
            label: w.name + ' | ' + w.address
        }))
        setWarehouseOptions(mapped_warehouses)
    }, [warehouses])

    useEffect(() => {
        reset({
            product_detail_id: detail?.id,
            warehouse_id: '',
            requested_stock: 0
        })
        setGlobalKey((o) => o+1)
    }, [product, detail])

    return (
        <div className="modal fade" id="modal-request-restock">
            <div className="modal-dialog">
                <form onSubmit={handleSubmit(onSubmit)} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah permintaan restocking</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group mb-3">
                            <label>Produk</label>
                            <input className="form-control" disabled value={ product?.name ?? '-' } />
                        </div>
                        <div className="form-group mb-3">
                            <InputTextLabel control={control} error={errors?.requested_stock?.message} name="requested_stock" type="number" label="Requested Stock" endText={detail?.unit ?? '-'} />
                        </div>
                        <div className="form-group mb-3">
                            <InputSelectLabel key={globalKey} control={control} error={errors?.warehouse_id?.message} name="warehouse_id" label="Gudang" options={warehouseOptions} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-muted" data-bs-dismiss="modal">Tutup</button>
                        <button type="submit" className="btn btn-primary">Kirim</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

type ComponentBtnProps = {
    [key: string]: any
}

export function BtnAccRequestModal(props: ComponentBtnProps) {
    return <button {...props} className="btn btn-sm btn-outline-muted" title="Restock" data-bs-toggle="modal" data-bs-target="#modal-request-restock"><i className="ti ti-repeat"></i></button>
}