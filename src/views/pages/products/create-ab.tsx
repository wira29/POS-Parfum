import { useApiClient } from "@/core/helpers/ApiClient";
import { TMultiSelect } from "@/core/interface/input-interface";
import { useProductStore } from "@/core/stores/ProductStore";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import { Dropdown } from "@/views/components/Input";
import InputImage from "@/views/components/Input/InputImage";
import { NormalCreateableDropdown } from "@/views/components/Input/NormalCreatableDropdown";
import TextAreaInput from "@/views/components/Input/TextAreaInput";
import Textfield from "@/views/components/Input/Textfield";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ZodFormattedError } from "zod";
import { addProductSchema, addProductType } from "./schema";


export const ProductCreateAb = () => {

    const formRef = useRef<any>({
        image: null,
        product_details: [],
    });
    const [errors, setErrors] = useState<ZodFormattedError<addProductType, string>>();
    const { isLoading, setLoading, createProduct, isFailure } = useProductStore()

    // categories 
    const apiClient = useApiClient();
    const [categories, setCategories] = useState<TMultiSelect>([])

    const unitOptions: TMultiSelect = [
            {
                value: 'weight',
                label: 'Berat'
            }, {
                value: 'volume',
                label: 'Volume'
            },
        ]

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

    useEffect(() => {
        getCategories()
        // getVariants()
    }, [])

    return (
        <>
        <Breadcrumb title="Tambah Produk" desc="Tambah produk di toko anda" />
            <form>
                <div className="card position-sticky z-3" style={{ top: "6rem" }} id="product-form">
                    <div className="card-body p-0">
                        <ul className="nav nav-underline pt-2 gap-0" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a href="#product-info" className="nav-link active px-3" aria-selected={true}>
                                    Informasi Produk
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a href="#product-sale" className="nav-link px-3" aria-selected={false}>
                                    Informasi Penjualan
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div data-bs-spy="scroll" data-bs-target="#product-form" data-bs-offset="0" tabIndex={0}>
                    <div className="card" id="product-info">
                        <div className="card-body">
                            <h5 className="fs-5 font-bold">Informasi Produk</h5>

                            <InputImage setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="image mb-4" errors={errors} col="mt-3" title="Gambar Produk" isRequired={false} />
                            <Textfield setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="name" errors={errors} col="" title="Nama Produk" isRequired={true} placeholder="Nama Produk" />
                            <NormalCreateableDropdown options={categories} setOptions={setCategories} label={{ title: "Kategori" }} handleChangeValue={(value) => {formRef.current.category_id = value}} idValue={formRef.current.category_id} parent={{ className:"w-100 form-group mb-2" }} errors={errors?.category_id} />
                            <Dropdown isMulti={false} isRequired={true} title="Tipe Satuan" formRef={formRef} name="unit_type" errors={errors} col="" options={unitOptions} setErrors={setErrors} schema={addProductSchema}/>
                            <TextAreaInput areaRows={10} setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="description" errors={errors} col="" title="Deskripsi Produk" isRequired={false} placeholder="Deskripsi Produk" />
                        </div>
                    </div>

                    <div className="card" id="product-sale">
                        <div className="card-body">
                            <h5 className="fs-5 font-bold mb-3">Informasi Penjualan</h5>

                            {
                                formRef.current.unit_type === 'weight' ?
                                <>
                                <div className="form-group mb-2">
                                <label className="form-label mb-2">Variasi </label>
                                    <div className="card bg-light-subtle overflow-hidden shadow-none">
                                        <div className="card-body py-3 row">
                                            <div className="col-md-12">
                                                <div className="col-12 col-md-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-2 col-form-label">Variasi 1</label>
                                                        <div className="col-sm-10">
                                                            <input type="email" className="form-control" id="inputHorizontalSuccess" placeholder="name@example.com"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 row mt-3">
                                            <div className="col-12 col-md-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-2 col-form-label">Opsi</label>
                                                        <div className="col-sm-9">
                                                            <input type="email" className="form-control" id="inputHorizontalSuccess" placeholder="name@example.com"/>
                                                        </div>
                                                        <button className="col-sm-1 btn btn-light-danger text-danger px-0">X</button>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="form-group row">
                                                        <div className="col-sm-10">
                                                            <input type="email" className="form-control" id="inputHorizontalSuccess" placeholder="name@example.com"/>
                                                        </div>
                                                        <button className="col-sm-1 btn btn-light-danger text-danger px-0">X</button>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 mt-3">
                                                    <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label"></label>
                                                        <div className="col-sm-10">
                                                            <input type="email" className="form-control" id="inputHorizontalSuccess" placeholder="name@example.com"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className="input-group">
                                        <button type="button" className="btn btn-light-primary text-primary">+ Tambah Variasi</button>
                                    </div>
                                </div>
                                
                                </>
                                :
                                <>
                                    <Textfield setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="name" errors={errors} col="" title="Harga per (ml)" isRequired={true} placeholder="Rp.10.000" />
                                    <div className="row">
                                        <div className="col">
                                            <Textfield value="1" disabled={true} setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="name" errors={errors} col="" title="Satuan dalam gram" />
                                        </div>
                                        <div className="col">
                                            <Textfield setErrors={setErrors} schema={addProductSchema} formRef={formRef} name="name" errors={errors} col="" title="Satuan dalam ml" isRequired={true} placeholder="0.98" />
                                        </div>
                                    </div>
                                </>
                            }

                            
                        </div>
                    </div>
                </div>

                <div className="card sticky-bottom">
                    <div className="card-footer d-flex gap-2 justify-content-end">
                        <Link to="/products" className="btn btn-muted">Kembali</Link>
                        <ButtonWithLoading type={'submit'} loading={isLoading} disabled={isLoading} className="btn btn-primary">Tambah</ButtonWithLoading>
                    </div>
                </div>
            </form>
        </>
    );
}