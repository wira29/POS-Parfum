import { FormEvent, useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import Textfield from "@/views/components/Input/Textfield";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import { useProductCategoryStore } from "@/core/stores/ProductCategoryStore";

const EditModal = () => {

    const {isLoading, setLoading, updateCategory, isFailure, current_category } = useProductCategoryStore()
    const formRef = useRef<{[key:string]:string}>({});
    const inputRef = useRef<{[key:string]:HTMLInputElement|null}>({})
    const [errors, setErrors] = useState<ZodFormattedError<{ name: string }, string>>();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        const result = schema.safeParse(formRef.current);
        if(!result.success) {
            setErrors(result.error.format())
            setLoading(false)
            return
        }

        await updateCategory(formRef)

        if(!isFailure) $('#modal-add-category').modal('hide')
    }

    useEffect(() => {
        formRef.current['name'] = current_category?.name || ''
        
        if(inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = current_category?.name || ''
    }, [current_category])

    return (
        <div id="modal-edit-category" className="modal fade" tabIndex={-1} >
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header d-flex align-items-center">
                        <h5 className="modal-title">Ubah Kategori</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <Textfield ref={(el) => (inputRef.current.name = el)} setErrors={setErrors} schema={schema} formRef={formRef} errors={errors} col="" name="name" title="Nama Kategori" placeholder="Nama kategori" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-bs-dismiss="modal">
                            Tutup
                        </button>
                        <ButtonWithLoading loading={isLoading} disabled={isLoading} className="btn btn-primary" type="submit">Ubah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const BtnEditModal = ({onClick}:{onClick: () => void}) => {
    return (<button type="button" data-bs-toggle="modal" data-bs-target="#modal-edit-category" className="dropdown-item d-flex align-items-center gap-3" onClick={onClick}><i className="fs-4 ti ti-edit"></i>Ubah</button>)
}

export default EditModal;