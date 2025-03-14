import { TMultiSelect } from "@/core/interface/input-interface";
import { useProductStore } from "@/core/stores/ProductStore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { addProductSchema, type addProductType } from "./schema";
import InputImage from "@/views/components/Input/InputImage";
import Textfield from "@/views/components/Input/Textfield";
import { Dropdown } from "@/views/components/Input";
import { useApiClient } from "@/core/helpers/ApiClient";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { CreateRepeater } from "./widgets/create-repeater";
import { Link, useNavigate } from "react-router-dom";
import { NormalCreateableDropdown } from "@/views/components/Input/NormalCreatableDropdown";

export const ProductCreate = () => {
    const navigate = useNavigate()
    const { isLoading, setLoading, createProduct, isFailure } = useProductStore()
    const formRef = useRef<any>({
        image: null,
        product_details: [],
    });
    const base_detail_data = {
        product_varian_id: "",
        material: "",
        unit: "",
        capacity: "0",
        weight: "0",
        density: "0",
        price: "0",
        // price_discount: 0
    }
    
    const [details, setDetails] = useState<{[key:string]:string|number}[]>([base_detail_data])
    const [errors, setErrors] = useState<ZodFormattedError<addProductType, string>>();

    const unitOptions: TMultiSelect = [
        {
            value: 'weight',
            label: 'Berat'
        }, {
            value: 'volume',
            label: 'Volume'
        },
    ]
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        formRef.current['product_details'] = details

        const formdata = addProductSchema.safeParse(formRef.current)
        if (!formdata.success) {
            setErrors(formdata.error.format())
            setLoading(false)
            return
        }

        setLoading(false)

        await createProduct(formRef)
        if(!isFailure) navigate('/products')
    }

    const apiClient = useApiClient();
    const [categories, setCategories] = useState<TMultiSelect>([])
    const [variants, setVariants] = useState<TMultiSelect>([])

    const getCategories = () => {
        apiClient.get('/categories/no-paginate').then(res => {
            const formatted_categories = res.data.data.map((category: { [key: string]: any }) => ({
                label: category.name,
                value: category.id,
            }))
            setCategories(formatted_categories)
        }).catch(() => {
            setCategories([])
        })
    }
    const getVariants = () => {
        apiClient.get('/variants/no-paginate').then(res => {
            const formatted_variants = res.data.data.map((variant: { [key: string]: any }) => ({
                label: variant.name,
                value: variant.id,
            }))
            setVariants(formatted_variants)
        }).catch(() => {
            setVariants([])
        })
    }

    useEffect(() => {
        getCategories()
        getVariants()
    }, [])

    return (
        <>
            <Breadcrumb title="Tambah Produk" desc="Tambah produk di toko anda" />
            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-header">
                        <ul className="nav nav-underline nav-fill" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a href="#form-product" className="nav-link active" data-bs-toggle="tab" role="tab" aria-selected={true}>
                                    Produk
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a href="#form-details" className="nav-link" data-bs-toggle="tab" role="tab" aria-selected={false}>
                                    Detail
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="form-product" role="tabpanel">
                                <InputImage setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="image" errors={errors} col="" title="Gambar Produk" isRequired={false} />
                                <Textfield setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="name" errors={errors} col="" title="Nama Produk" isRequired={true} placeholder="Nama Produk" />
                                <NormalCreateableDropdown pa options={categories} setOptions={setCategories} label={{ title: "Kategori" }} handleChangeValue={(value) => {formRef.current.category_id = value}} idValue={formRef.current.category_id} parent={{ className:"w-100 form-group mb-2" }} errors={errors?.category_id} />
                                <Dropdown isMulti={false} isRequired={true} title="Tipe Satuan" formRef={formRef} name="unit_type" errors={errors} col="" options={unitOptions} setErrors={setErrors} schema={addProductSchema} />
                            </div>
                            <div className="tab-pane" id="form-details" role="tabpanel">
                                <CreateRepeater categories={categories} variants={variants} setCategories={setCategories} setVariants={setVariants} baseData={base_detail_data} datas={details} setDatas={setDetails} errors={errors} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-footer d-flex gap-2 justify-content-end">
                        <Link to="/products" className="btn btn-muted">Kembali</Link>
                        <ButtonWithLoading type={'submit'} loading={isLoading} disabled={isLoading} className="btn btn-primary">Tambah</ButtonWithLoading>
                    </div>
                </div>
            </form>
        </>
    )
}