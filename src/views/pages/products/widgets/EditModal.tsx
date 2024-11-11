import { useProductStore } from "@/core/stores/ProductStore";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import Textfield from "@/views/components/Input/Textfield";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { addProductSchema } from "../schema";
import InputImage from "@/views/components/Input/InputImage";
import TextAreaInput from "@/views/components/Input/TextAreaInput";
import { Dropdown } from "@/views/components/Input";
import { useApiClient } from "@/core/helpers/ApiClient";
import { TMultiSelect } from "@/core/interface/input-interface";
import { SelectInstance } from "react-select";
import { OptionType } from "@/core/interface/select-option-interface";

export default function EditModal() {
    const {isLoading, setLoading, createProduct, isFailure, current_product} = useProductStore()
    const formRef = useRef<any>({
        product_details: [],
    });
    const inputRef = useRef<{[key:string]:HTMLInputElement|HTMLTextAreaElement|null|SelectInstance<OptionType, true>}>({})
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>();

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formdata = addProductSchema.safeParse(formRef.current)
        if(!formdata.success) {
            setErrors(formdata.error.format())
            setLoading(false)
            return
        }

        console.log(formRef.current)
        
        await createProduct(formRef)
        if(!isFailure) $('#add-product-modal').modal('hide')
    }

    const apiClient = useApiClient();
    const [categories, setCategories] = useState<TMultiSelect>([])

    const getCategories = () => {
        apiClient.get('/categories/no-paginate').then(res => {
            const formatted_categories = res.data.data.map((category:{[key:string]:any}) => ({
                label: category.name,
                value: category.id,
            }))
            setCategories(formatted_categories)
        }).catch(() => {
            setCategories([])
        })
    }

    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        formRef.current['image'] = current_product?.image || ''
        formRef.current['name'] = current_product?.name || ''
        formRef.current['category_id'] = current_product?.category_id || ''
        formRef.current['unit_type'] = current_product?.unit_type || ''
        formRef.current['desc'] = current_product?.desc || ''
        if(current_product) {
            const filtered_category = current_product?.category_id ? categories?.filter((category:{[key:string]:any}) => category.id === current_product?.category_id) : []
            formRef.current['category_id'] = filtered_category.length ? filtered_category[0] : {}
        } else {
            formRef.current['category_id'] = {}
        }

        if(inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = current_product?.name || ''
        if(inputRef.current['unit_type'] && 'value' in inputRef.current['unit_type']) inputRef.current['unit_type'].value = current_product?.unit_type || ''
        if(inputRef.current['desc'] && 'value' in inputRef.current['desc']) inputRef.current['desc'].value = current_product?.desc || ''
        if(inputRef.current['category_id']) {
            let current_category_id:TMultiSelect = []
            if(current_product) {
                current_category_id = current_product?.category_id ? categories?.filter((category:{[key:string]:any}) => category.id === current_product?.category_id) : []
            }
            const roleSelectInstance = inputRef.current['category_id'] as SelectInstance<OptionType, true>
            roleSelectInstance.setValue(current_category_id, 'select-option')
        }
        console.log({
            form: formRef.current,
            input: inputRef.current,
        })
    }, [current_product])

    return (
        <div className="modal fade" tabIndex={-1} id="edit-product-modal">
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="card-title">Ubah Produk</h5>
                        <button type="button" data-bs-dismiss="modal" className="btn-close"></button>
                    </div>
                    <div className="modal-body">
                        <InputImage setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="image" errors={errors} col="" title="Gambar Produk" isRequired={false} />
                        <Textfield ref={(el) => (inputRef.current.name = el)} setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="name" errors={errors} col="" title="Nama Produk" isRequired={true} placeholder="Nama Produk" />
                        <Dropdown ref={(el) => (inputRef.current.category_id = el)} isMulti={false} name="category_id" col="" errors={errors} title="Kategori" options={categories} schema={addProductSchema} formRef={formRef} setErrors={setErrors}/>
                        <TextAreaInput ref={(el) => (inputRef.current.desc = el)} setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="desc" errors={errors} col="" title="Deskripsi Produk" isRequired={true} placeholder="Deskripsi Produk" />
                        <Textfield ref={(el) => (inputRef.current.unit_type = el)} setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="unit_type" errors={errors} col="" title="Tipe Unit" isRequired={true} placeholder="Nama Produk"/>
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

export const BtnEditModal = (props:{[key:string]:any}) => {
    return (<button type="button" className="dropdown-item d-flex align-items-center gap-3" data-bs-toggle="modal" data-bs-target="#edit-product-modal" {...props} >
        <i className="fs-4 ti ti-edit"></i>Ubah
    </button>)
}