import { OptionType } from "@/core/interface/select-option-interface"
import { useProductRestockStore } from "@/core/stores/ProductRestockStore"
import { UncontrolledSelect } from "@/views/components/Input/uncontrolled/Select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { productRestockSchema } from "../schema"
import { useProductStore } from "@/core/stores/ProductStore"

type ComponentProps = {
    onSuccessSubmit: () => void
}

export const ModalAddRestock = ({ onSuccessSubmit }: ComponentProps) => {

    const { createProductRestock, isFailure } = useProductRestockStore()
    const { products, setPerPage } = useProductStore()
    const [globalKey, setGlobalKey] = useState(0)
    const [optionProducts, setOptionProducts] = useState<OptionType[]>([])

    const { control, formState, handleSubmit, watch, setValue, reset } = useForm({
        mode: 'onChange',
        defaultValues: {
            product_detail_id: '',
            stock: 0,
            reason: ''
        },
        resolver: zodResolver(productRestockSchema)
    })
    const { errors } = formState
    const product_detail_id = watch('product_detail_id')

    const submitForm = async (data: any) => {
        await createProductRestock(data)
        if (!isFailure) {
            CloseModalAddRestock()
            onSuccessSubmit()
            resetForm()
        }
    }

    const resetForm = () => {
        reset({
            product_detail_id: '',
            stock: 0,
            reason: ''
        })
    }

    useEffect(() => {
        setGlobalKey((old) => old + 1)
    }, [product_detail_id])

    useEffect(() => {
        setPerPage(99999)
    }, [])

    useEffect(() => {
        const mapped_data = products.flatMap(product => {
            return product.details.map((detail:any) => ({
                label: `${product.name} - ${detail.material}`,
                value: detail.id
            }))
        })
        setOptionProducts(mapped_data)
    }, [products])

    return (
        <div className="modal modal-lg fade" id="modal-add-restock" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-primary rounded-top">
                        <h5 className="modal-title text-white">Tambah Stok Produk</h5>
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" className="text-white bg-transparent border-0 fs-6"><i className="ti ti-x"></i></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label>Produk</label>
                            <UncontrolledSelect
                                options={optionProducts}
                                value={product_detail_id}
                                onChange={(selected) => {
                                    setValue('product_detail_id', (selected as OptionType).value, { shouldValidate: true })
                                }}
                                key={globalKey}
                            />
                        </div>

                        <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label>Qty</label>
                                    <input
                                        {...field}
                                        type="number"
                                        className={`form-control ${errors?.stock?.message ? 'is-invalid' : ''}`}
                                        placeholder="Qty"
                                        min={0}
                                    />
                                    <small className="text-danger">{errors?.stock?.message}</small>
                                </div>
                            )}
                        />

                        <Controller
                            name="reason"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label>Alasan</label>
                                    <textarea
                                        {...field}
                                        className={`form-control ${errors?.reason?.message ? 'is-invalid' : ''}`}
                                        placeholder="Alasan"
                                    ></textarea>
                                    <small className="text-danger">{errors?.reason?.message}</small>
                                </div>
                            )}
                        />

                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-muted" data-bs-dismiss="modal">Tutup</button>
                        <button className="btn btn-primary" onClick={handleSubmit(submitForm)}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BtnOpenAddRestock = (props: any) => {
    return (
        <button className="btn btn-primary" onClick={OpenModalAddRestock} {...props}><i className="ti ti-plus"></i> Tambah</button>
    )
}

export const OpenModalAddRestock = () => $('#modal-add-restock').modal('show')
export const CloseModalAddRestock = () => $('#modal-add-restock').modal('hide')