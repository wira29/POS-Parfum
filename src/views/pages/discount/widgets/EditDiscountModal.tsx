import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { SelectInstance } from "react-select";
import { OptionType } from "@/core/interface/select-option-interface";
import { useDiscountStore } from "@/core/stores/DiscountStore";
import { addDiscountSchema } from "../schema";
import Textfield from "@/views/components/Input/Textfield";
import { Dropdown } from "@/views/components/Input";
import TextAreaInput from "@/views/components/Input/TextAreaInput";
import SingleSwitchInput from "@/views/components/Input/SingleSwitchInput";
import { formatNum } from "@/core/helpers/FormatNumber";
import { TMultiSelect } from "@/core/interface/input-interface";
import { useApiClient } from "@/core/helpers/ApiClient";

export default function EditDiscountModal() {
    const {isLoading, setLoading, updateDiscount, isFailure, current_discount} = useDiscountStore()
    const formRef = useRef<any>({});
    const inputRef = useRef<{[key:string]:HTMLInputElement|HTMLTextAreaElement|null|SelectInstance<OptionType, true>}>({})
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>();
    
    const apiClient = useApiClient()

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
        
        await updateDiscount(formRef)
        if(!isFailure) $('#edit-discount-modal').modal('hide')
    }

    useEffect(() => {
        formRef.current['name'] = current_discount?.name || ''
        formRef.current['discount'] = current_discount?.discount || ''
        formRef.current['max_used'] = current_discount?.max_used || ''
        formRef.current['min'] = current_discount?.min || ''
        formRef.current['outlet_id'] = current_discount?.outlet_id || ''
        formRef.current['product_id'] = current_discount?.product_id || ''
        formRef.current['desc'] = current_discount?.desc || ''
        formRef.current['is_for_store'] = current_discount?.is_for_store || false

        if(inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = current_discount?.name || ''
        if(inputRef.current['discount'] && 'value' in inputRef.current['discount']) inputRef.current['discount'].value = formatNum(current_discount?.discount, true) as string || ''
        if(inputRef.current['max_used'] && 'value' in inputRef.current['max_used']) inputRef.current['max_used'].value = formatNum(current_discount?.max_used, true) as string || ''
        if(inputRef.current['min'] && 'value' in inputRef.current['min']) inputRef.current['min'].value = formatNum(current_discount?.min, true) as string || ''
        if(inputRef.current['desc'] && 'value' in inputRef.current['desc']) inputRef.current['desc'].value = current_discount?.desc || ''
        if(inputRef.current['is_for_store'] && 'checked' in inputRef.current['is_for_store']) inputRef.current['is_for_store'].checked = current_discount?.is_for_store || false

        if(inputRef.current['outlet_id']) {
            const selected_outlet = outletLists.filter((outlet) => outlet.value == current_discount?.outlet_id)
            const outletSelectInstance = inputRef.current['outlet_id'] as SelectInstance<OptionType, true>
            outletSelectInstance.setValue(selected_outlet, 'select-option')
        }
        if(inputRef.current['product_id']) {
            const selected_product = productLists.filter((product) => product.value == current_discount?.product_id)
            const productSelectInstance = inputRef.current['product_id'] as SelectInstance<OptionType, true>
            productSelectInstance.setValue(selected_product, 'select-option')
        }
    }, [current_discount])

    useEffect(() => {
        getOutletLists()
        getProductLists()
    }, [])

    return (
        <div className="modal modal-lg fade" tabIndex={-1} id="edit-discount-modal">
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="card-title">Ubah Produk</h5>
                        <button type="button" data-bs-dismiss="modal" className="btn-close"></button>
                    </div>
                    <div className="modal-body row">
                        <Textfield ref={(el) => inputRef.current.name = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="name" col="col-lg-6" title="Nama Diskon" formRef={formRef} placeholder="Nama Diskon" />
                        <Textfield ref={(el) => inputRef.current.discount = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} onlyNumber={true} name="discount" col="col-lg-6" title="Diskon (%)" formRef={formRef} placeholder="Diskon (%)" />
                        <Textfield isRequired={false} ref={(el) => inputRef.current.max_used = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} onlyNumber={true} name="max_used" col="col-lg-6" title="Digunakan Maksimal" formRef={formRef} placeholder="Digunakan Maksimal Oleh" />
                        <Textfield isRequired={false} ref={(el) => inputRef.current.min = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} onlyNumber={true} name="min" col="col-lg-6" title="Pembelian Minimum" formRef={formRef} placeholder="Pembelian Minimum" />
                        <Dropdown isClearable={true} options={outletLists} isRequired={false} ref={(el) => inputRef.current.outlet_id = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="outlet_id" col="col-lg-6" title="Outlet" formRef={formRef} />
                        <Dropdown isClearable={true} options={productLists} isRequired={false} ref={(el) => inputRef.current.product_id = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="product_id" col="col-lg-6" title="Produk" formRef={formRef} />
                        <TextAreaInput isRequired={false} ref={(el) => inputRef.current.desc = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="desc" col="" title="Deskripsi" formRef={formRef} placeholder="Deskripsi" />
                        <SingleSwitchInput ref={(el) => inputRef.current.is_for_store = el} setErrors={setErrors} errors={errors} schema={addDiscountSchema} name="is_for_store" col="" title="Diskon Store" formRef={formRef} isRequired={false} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-muted" data-bs-dismiss="modal">Tutup</button>
                        <ButtonWithLoading type={'submit'} loading={isLoading} disabled={isLoading} className="btn btn-primary">Ubah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const BtnEditDiscountModal = (props:{[key:string]:any}) => {
    return (<button type="button" className="dropdown-item d-flex align-items-center gap-3" data-bs-toggle="modal" data-bs-target="#edit-discount-modal" {...props} >
        <i className="fs-4 ti ti-edit"></i>Ubah
    </button>)
}