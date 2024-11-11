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

export default function AddModal() {
    const {isLoading, setLoading, createProduct, isFailure} = useProductStore()
    const formRef = useRef<any>({
        product_details: [],
    });
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

    return (
        <div className="modal fade" tabIndex={-1} id="add-product-modal">
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="card-title">Tambah Produk</h5>
                        <button type="button" data-bs-dismiss="modal" className="btn-close"></button>
                    </div>
                    <div className="modal-body">
                        <InputImage setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="image" errors={errors} col="" title="Gambar Produk" isRequired={false} />
                        <Textfield setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="name" errors={errors} col="" title="Nama Produk" isRequired={true} placeholder="Nama Produk" />
                        <Dropdown isMulti={false} name="category_id" col="" errors={errors} title="Kategori" options={categories} schema={addProductSchema} formRef={formRef} setErrors={setErrors}/>
                        <TextAreaInput setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="desc" errors={errors} col="" title="Deskripsi Produk" isRequired={true} placeholder="Deskripsi Produk" />
                        <Textfield setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="unit_type" errors={errors} col="" title="Tipe Unit" isRequired={true} placeholder="Nama Produk"/>
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

export const BtnAddModal = () => {
    return (<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-product-modal">Tambah Produk</button>)
}