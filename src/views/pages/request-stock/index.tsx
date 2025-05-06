import { OptionType } from "@/core/interface/select-option-interface";
import { useProductRequestStockStore } from "@/core/stores/ProductRequestStockStore";
import { useWarehouseStore } from "@/core/stores/WarehouseStore";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import InputSelectLabel from "@/views/components/Input/hook-form/InputSelectLabel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { requestRestockProductSchema, requestRestockProductType } from "./schema";
import { useProductStore } from "@/core/stores/ProductStore";
import { UncontrolledSelect } from "@/views/components/Input/uncontrolled/Select";
import { formatNum } from "@/core/helpers/FormatNumber";
import { Link, useNavigate } from "react-router-dom";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";

export default function RequestStockIndex() {

    const [globalKey, setGlobalKey] = useState(0)
    const [warehouseOptions, setWarehouseOptions] = useState<OptionType[]>([])
    const [productOptions, setProductOptions] = useState<OptionType[]>([])
    const [selectedProduct, setSelectedProduct] = useState<string|null>(null)
    const navigate = useNavigate()

    const { setPerPage, warehouses } = useWarehouseStore()
    const { createProductRequest, isFailure, isLoading } = useProductRequestStockStore()
    const { setPerPage: setPageProduct, products } = useProductStore()

    const { control, formState, handleSubmit, watch, setValue } = useForm({
        mode: 'onChange',
        defaultValues: {
            product_detail: [],
            warehouse_id: '',
        },
        resolver: zodResolver(requestRestockProductSchema)
    })
    const { errors } = formState
    const product_detail = watch('product_detail')

    const addProduct = () => {
        setValue('product_detail', [...product_detail, {
            product_detail_id: selectedProduct as string,
            requested_stock: 0
        }], {shouldValidate: true})

        setSelectedProduct(null)
    }

    const submitForm = async (data:requestRestockProductType) => {
        await createProductRequest(data)

        if(!isFailure) navigate('/products')
    }

    useEffect(() => {
        const mapped_warehouses = warehouses.map((w) => ({
            value: w.id,
            label: w.name + ' | ' + w.address
        }))
        setWarehouseOptions(mapped_warehouses)
    }, [warehouses])

    useEffect(() => {
        const selected_ids = product_detail.map((p) => p.product_detail_id)

        const mapped_products = products.flatMap((product) => (
            product.details.map((detail:{[key:string]:any}) => ({
                value: detail.id,
                label: `${product.name} - ${detail.material} | stock: ${detail.stock} ${detail.unit}`
            }))
        )).filter((p => !selected_ids.includes(p.value)))

        setProductOptions(mapped_products)
    }, [products, product_detail])

    useEffect(() => {
        setPerPage(999)
        setPageProduct(999)
    }, [])

    useEffect(() => {
        setGlobalKey((old) => old + 1)
    }, [selectedProduct])

    return (
        <>
            <Breadcrumb title="Request Stock" desc="Tambah Permintaan Penambahan Stock Produk" />

            <div className="card">
                <div className="card-body">
                    <div className="mb-3">
                        <InputSelectLabel required key={globalKey} control={control} error={errors?.warehouse_id?.message} name="warehouse_id" label="Gudang" options={warehouseOptions} />
                    </div>
                    <div>
                        <label>Produk</label>
                        <div className="d-flex gap-3 mb-3">
                            <div className="w-100">
                                <UncontrolledSelect options={productOptions} value={selectedProduct} onChange={(s) => setSelectedProduct((s as OptionType).value)} key={globalKey} />
                            </div>
                            <button className="btn btn-sm btn-muted px-3" onClick={addProduct} disabled={!selectedProduct}>+</button>
                        </div>
                        <table className="table table-bordered text-center align-middle">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Produk</th>
                                    <th>Stok</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !product_detail.length
                                    ? <tr><th className="text-center text-muted" colSpan={4}>-- belum ada data dipilih --</th></tr>
                                    : product_detail.map((p, index) => {
                                        const prod = products.find(pr => pr.details.find((detail:any) => detail.id === p.product_detail_id))

                                        const product = prod
                                        ? {
                                            ...prod,
                                            details: prod.details.find((detail:any) => detail.id === p.product_detail_id)
                                        }
                                        : null;

                                        return (
                                            <tr key={index}>
                                                <th>{index+1}</th>
                                                <td>{product.name} - {product.details.material} | {formatNum(product.details.stock, true)} {product.details.unit}</td>
                                                <td>
                                                    <Controller
                                                        name={`product_detail.${index}.requested_stock`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <>
                                                                <input
                                                                    {...field}
                                                                    type="number"
                                                                    className={`form-control ${errors.product_detail?.[index]?.requested_stock?.message ? 'is-invalid' : ''}`}
                                                                    placeholder="Permintaan Stok"
                                                                    onChange={(e) => {
                                                                        field.onChange(Number(e.target.value))
                                                                    }}
                                                                    value={field.value !== 0 ? field.value : ''}

                                                                />
                                                                <small className="text-danger">{errors.product_detail?.[index]?.requested_stock?.message}</small>
                                                            </>
                                                        )}
                                                    />
                                                </td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm" onClick={() => {
                                                        setValue('product_detail', product_detail.filter((_, i) => i !== index), {shouldValidate: true})
                                                    }}><i className="ti ti-trash"></i></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <span className="text-danger">{errors?.product_detail?.message}</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body p-3 d-flex align-items-center justify-content-end gap-2">
                    <Link to="/products" className="btn btn-muted">Kembali</Link>
                    <ButtonWithLoading disabled={isLoading} loading={isLoading} type="button" className="btn btn-primary" onClick={handleSubmit(submitForm)}>Submit</ButtonWithLoading>
                </div>
            </div>
        </>
    )
}