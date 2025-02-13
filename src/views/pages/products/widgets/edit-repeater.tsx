import { NormalCreateableDropdown } from "@/views/components/Input/NormalCreatableDropdown"
import { Dispatch, SetStateAction } from "react"
import { TMultiSelect } from "@/core/interface/input-interface"
import { NormalTextInput } from "@/views/components/Input/NormalTextInput"
import { ZodFormattedError } from "zod"
import { addProductType } from "../schema"
import { useProductStore } from "@/core/stores/ProductStore"

type props = {
    variants: TMultiSelect,
    categories: TMultiSelect,
    datas: {[key:string]:any}[],
    setVariants: Dispatch<SetStateAction<TMultiSelect>>,
    setCategories: Dispatch<SetStateAction<TMultiSelect>>,
    setDatas: Dispatch<SetStateAction<{[key:string]:any}[]>>,
    baseData: {[key:string]:any},
    errors: ZodFormattedError<addProductType, string>|undefined
}
export const EditRepeater = ({variants, categories, datas, setVariants, setCategories, setDatas, baseData, errors}:props) => {

    const {deleteDetail} = useProductStore()

    const handleAddRepeat = () => {
        setDatas((old_data) => [...old_data, baseData])
    }

    const handleRemoveRepeat = async (index:number) => {
        console.log(datas[index])
        if(datas[index].product_detail_id) {
            try {
                const success_delete = await deleteDetail(datas[index].product_detail_id)
                if(success_delete) setDatas((old_data) => old_data.filter((_, idx) => idx !== index))
                else throw new Error("Batal menghapus detail")
            } catch ($e:any) {
                console.error($e)
            }
        } else {
            setDatas((old_data) => old_data.filter((_, idx) => idx !== index))
        }
    }

    const handleChangeValue = (index:number, key:string, value: any) => {
        setDatas((old_data) => {
            const new_data = [...old_data]
            new_data[index][key] = value
            return new_data
        })
    }

    return (
        <>
            {
                datas.length
                ? datas.map((data, index) => (
                    <>
                        <div className="card">
                            <div className="card-body border">
                                <div key={index} className="row">
                                    <NormalCreateableDropdown options={categories} setOptions={setCategories} label={{ title: "Kategori" }} handleChangeValue={(value) => {handleChangeValue(index, "category_id", value)}} idValue={data.category_id} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} index={index} detectChange={datas.length} errors={errors?.product_details?.[index]?.category_id} />
                                    <NormalCreateableDropdown options={variants} setOptions={setVariants} label={{ title: "Varian" }} handleChangeValue={(value) => {handleChangeValue(index, "product_varian_id", value)}} idValue={data.product_varian_id} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} index={index} detectChange={datas.length} errors={errors?.product_details?.[index]?.product_varian_id} />
                                    <NormalTextInput label={{ title: "Material" }} handleChangeValue={(value) => {handleChangeValue(index, "material", value)}} value={data.material} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} placeholder="Material" errors={errors?.product_details?.[index]?.material}/>
                                    <NormalTextInput label={{ title: "Unit" }} handleChangeValue={(value) => {handleChangeValue(index, "unit", value)}} value={data.unit} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} placeholder="Unit" errors={errors?.product_details?.[index]?.unit}/>
                                    <NormalTextInput label={{ title: "Kapasitas" }} handleChangeValue={(value) => {handleChangeValue(index, "capacity", value)}} value={data.capacity} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} placeholder="Kapasitas" regex={/^\d+/} errors={errors?.product_details?.[index]?.capacity} />
                                    <NormalTextInput label={{ title: "Berat" }} handleChangeValue={(value) => {handleChangeValue(index, "weight", value)}} value={data.weight} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} placeholder="Berat" regex={/^\d+/} errors={errors?.product_details?.[index]?.weight} />
                                    <NormalTextInput label={{ title: "Kekentalan" }} handleChangeValue={(value) => {handleChangeValue(index, "density", value)}} value={data.density} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} placeholder="Density" regex={/^\d+/} errors={errors?.product_details?.[index]?.density} />
                                    <NormalTextInput label={{ title: "Harga" }} handleChangeValue={(value) => {handleChangeValue(index, "price", value)}} value={data.price} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} placeholder="Harga" regex={/^\d+/} errors={errors?.product_details?.[index]?.price} />
                                    {/* <NormalTextInput label={{ title: "Harga Diskon" }} handleChangeValue={(value) => {handleChangeValue(index, "price_discount", value)}} value={data.price_discount} parent={{ className:"col-md-3 col-sm-6 form-group mb-2" }} placeholder="Harga Diskon" regex={/^\d+/} /> */}
                                </div>
                            </div>
                            <div className="card-footer justify-content-end d-flex">
                                <button type="button" className="btn-close bg-danger p-2" onClick={() => handleRemoveRepeat(index)}></button>
                            </div>
                        </div>
                    </>
                ))
                : <div className="card">
                    <div className="card-body border">
                        <div className="text-center text-muted">-- data detail kosong --</div>
                    </div>
                </div>
            }
            <div className="d-flex justify-content-between align-items-end mb-3">
                <button type="button" className="btn btn-primary" onClick={handleAddRepeat}><i className="ti ti-plus"></i></button>
            </div>
        </>
    )
}