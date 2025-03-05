import { useDiscountStore } from "@/core/stores/DiscountStore"
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading"
import Textfield from "@/views/components/Input/Textfield"
import { FormEvent, useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { addDiscountSchema } from "../schema";
import { Dropdown } from "@/views/components/Input";
import TextAreaInput from "@/views/components/Input/TextAreaInput";
import { useApiClient } from "@/core/helpers/ApiClient";
import { TMultiSelect } from "@/core/interface/input-interface";

export default function AddDiscountModal() {
    const {isLoading, setLoading, createDiscount, isFailure} = useDiscountStore()
    const formRef = useRef<any>({});

    const apiClient = useApiClient()

    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>();

    const [outletLists, setOutletLists] = useState<TMultiSelect>([])
    const [productLists, setProductLists] = useState<TMultiSelect>([])

    const getOutletLists = () => {
        apiClient.get('outlets/no-paginate').then(res => {
            const datas:{[key:string]:any}[] = res.data.data
            const formatted_data = datas.map(data => ({value: data.id, label: data.name}))
            setOutletLists(formatted_data)
        })
    }
    const getProductLists = () => {
        apiClient.get('products/no-paginate').then(res => {
            const datas:{[key:string]:any}[] = res.data.data
            const formatted_data = datas.map(data => ({value: data.id, label: data.name}))
            setProductLists(formatted_data)
        })
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formdata = addDiscountSchema.safeParse(formRef.current)
        if(!formdata.success) {
            setErrors(formdata.error.format())
            setLoading(false)
            return
        }

        console.log(formRef.current)
        
        await createDiscount(formRef)
        if(!isFailure) $('#add-discount-modal').modal('hide')
    }

    useEffect(() => {
        getOutletLists()
        getProductLists()
    }, [])

    return (
        <div className="modal modal-lg fade" tabIndex={-1} id="add-discount-modal">
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="card-title">Tambah Diskon</h5>
                        <button type="button" data-bs-dismiss="modal" className="btn-close"></button>
                    </div>
                    <div className="modal-body row">
                        <Textfield setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="name" col="col-lg-6" title="Nama Diskon" formRef={formRef} placeholder="Nama Diskon" />
                        <Textfield setErrors={setErrors} errors={errors} schema={addDiscountSchema} onlyNumber={true} name="discount" col="col-lg-6" title="Diskon (%)" formRef={formRef} placeholder="Diskon (%)" />
                        <Textfield isRequired={false} setErrors={setErrors} errors={errors} schema={addDiscountSchema} onlyNumber={true} name="max_used" col="col-lg-6" title="Digunakan Maksimal" formRef={formRef} placeholder="Digunakan Maksimal Oleh" />
                        <Textfield startText="Rp" isRequired={false} setErrors={setErrors} errors={errors} schema={addDiscountSchema} onlyNumber={true} name="min" col="col-lg-6" title="Pembelian Minimum" formRef={formRef} placeholder="Pembelian Minimum" />
                        <Dropdown isClearable={true} options={outletLists} isRequired={false} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="outlet_id" col="col-lg-6" title="Outlet" formRef={formRef} />
                        <Dropdown isClearable={true} options={productLists} isRequired={false} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="product_id" col="col-lg-6" title="Produk" formRef={formRef} />
                        <TextAreaInput isRequired={false} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="desc" col="" title="Deskripsi" formRef={formRef} placeholder="Deskripsi" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-muted" data-bs-dismiss="modal">Tutup</button>
                        <ButtonWithLoading type={'submit'} loading={isLoading} disabled={isLoading} className="btn btn-primary">Tambah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const BtnAddDiscountModal = () => {
    return <button className="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-discount-modal">+ Tambah</button>
}