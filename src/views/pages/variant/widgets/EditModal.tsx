import { FormEvent, useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { addVariantSchema } from "../schema";
import { useProductVariantStore } from "@/core/stores/ProductVariantStore";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import Textfield from "@/views/components/Input/Textfield";

const EditModal = () => {
    const {isLoading, setLoading, updateVariant, isFailure, current_variant} = useProductVariantStore()
    const formRef = useRef<{[key:string]:string}>({});
    const inputRef = useRef<{[key:string]:HTMLInputElement|null}>({})
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formdata = addVariantSchema.safeParse(formRef.current)
        if(!formdata.success) {
            setErrors(formdata.error.format())
            setLoading(false)
            return
        }

        await updateVariant(formRef)
        
        if(!isFailure) $('#edit-variant-modal').modal('hide')
    }
    
    useEffect(() => {
        formRef.current['name'] = current_variant?.name || ''

        if(inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = current_variant?.name || ''
    }, [current_variant])
    return (
        <div id="edit-variant-modal" className="modal fade" tabIndex={-1} aria-labelledby="bs-example-modal-md" aria-hidden="true">
            <div className="modal-dialog">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header d-flex align-items-center">
                        <h4 className="modal-title">Ubah Varian</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <Textfield ref={(el) => (inputRef.current.name = el)} setErrors={setErrors} schema={addVariantSchema} formRef={formRef} errors={errors} col="" name="name" title="Nama Varian" placeholder="Nama Varian" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-muted" data-bs-dismiss="modal">Batal</button>
                        <ButtonWithLoading type={'submit'} loading={isLoading} className="btn btn-primary" disabled={isLoading}>Ubah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const BtnEditModal = ({onClick}:{onClick: () => void}) => {
    return (<button type="button" data-bs-toggle="modal" data-bs-target="#edit-variant-modal" className="dropdown-item d-flex align-items-center gap-3" onClick={onClick}><i className="fs-4 ti ti-edit"></i>Ubah</button>)
}

export default EditModal;