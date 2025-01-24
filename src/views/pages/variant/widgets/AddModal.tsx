import { FormEvent, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { addVariantSchema } from "../schema";
import { useProductVariantStore } from "@/core/stores/ProductVariantStore";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import Textfield from "@/views/components/Input/Textfield";

const AddModal = () => {
    const {isLoading, setLoading, createVariant, isFailure} = useProductVariantStore()
    const formRef = useRef<any>({});
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

        await createVariant(formRef)
        
        if(!isFailure) $('#add-variant-modal').modal('hide')
    }
    
    return (
        <div id="add-variant-modal" className="modal fade" tabIndex={-1} aria-labelledby="bs-example-modal-md" aria-hidden="true">
            <div className="modal-dialog">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header d-flex align-items-center">
                        <h4 className="modal-title">Tambah Varian</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <Textfield setErrors={setErrors} schema={addVariantSchema} formRef={formRef} errors={errors} col="" name="name" title="Nama Varian" placeholder="Nama Varian" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-muted" data-bs-dismiss="modal">Batal</button>
                        <ButtonWithLoading type={'submit'} loading={isLoading} className="btn btn-primary" disabled={isLoading}>Tambah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const BtnAddModal = () => {
    return (
        <button type="button" className="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-variant-modal">Tambah Varian</button>
    )
}

export default AddModal;