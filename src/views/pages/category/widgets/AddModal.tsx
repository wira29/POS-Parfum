import { handleInputChange } from "@/core/helpers/HandleInputChange";
import { useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { schema } from "../schema/schema";

const AddModal = () => {

    const formRef = useRef<any>({});
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>();
    
    return (
        <div id="bs-example-modal-md" className="modal fade" tabIndex={-1} aria-labelledby="bs-example-modal-md" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                <div className="modal-header d-flex align-items-center">
                    <h4 className="modal-title" id="myModalLabel">
                    Medium Modal
                    </h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form>
                <div className="modal-body">
                        <div className="form-group mb-3">
                            <label className="form-label">Nama Kategori</label>
                            <input type="text" onChange={(e) => handleInputChange(e, setErrors, schema, formRef)} name="name" className={errors?.name?._errors.length ? "form-control is-invalid" : "form-control"} placeholder="Masukkan nama kategori" />
                            {
                                errors?.name?._errors.length && <small className="form-text text-danger">{ errors?.name?._errors[0]}</small>
                            }
                        </div>
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn bg-primary-subtle text-primary  waves-effect" >
                    Tambah
                    </button>
                    <button type="button" className="btn bg-danger-subtle text-danger  waves-effect" data-bs-dismiss="modal">
                    Tutup
                    </button>
                </div>
                </form>

                </div>
                {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
            </div>
    );
}

export default AddModal;