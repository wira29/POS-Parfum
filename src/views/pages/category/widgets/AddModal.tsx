import { FormEvent, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { schema } from "../schema/schema";
import Textfield from "@/views/components/Input/Textfield";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import { useProductCategoryStore } from "@/core/stores/ProductCategoryStore";

const AddModal = () => {

    const {isLoading, setLoading, createCategory, isFailure} = useProductCategoryStore()
    const formRef = useRef<any>({});
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

        await createCategory(formRef)

        if(!isFailure) $('#modal-add-category').modal('hide')
    }

    return (
        <div id="modal-add-category" className="modal fade" tabIndex={-1} >
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header d-flex align-items-center">
                        <h5 className="modal-title">Tambah Kategori</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <Textfield setErrors={setErrors} schema={schema} formRef={formRef} errors={errors} col="" name="name" title="Nama Kategori" placeholder="Nama kategori" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-bs-dismiss="modal">
                            Tutup
                        </button>
                        <ButtonWithLoading loading={isLoading} disabled={isLoading} className="btn btn-primary" type="submit">Tambah</ButtonWithLoading>
                    </div>
                </form>
                {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
        </div>
    );
}

export const BtnAddModal = () => {
    return (<button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#modal-add-category">Tambah Kategori</button>)
}

export default AddModal;