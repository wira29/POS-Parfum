import { handleInputChange } from "@/core/helpers/HandleInputChange";
import Required from "@/views/components/Required";
import { useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { schema } from "../schema/schema";

const AddModal = () => {

    const formRef = useRef<any>({});
    const [errors, setErrors] = useState<ZodFormattedError<{name: string, phone: string, address: string}, string>>();
    
    return (
        <div id="bs-example-modal-md" className="modal fade" tabIndex={-1} aria-labelledby="bs-example-modal-md" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                <div className="modal-header d-flex align-items-start">
                    <div>
                    <h4 className="modal-title" id="myModalLabel">
                    Tambah Gudang
                    </h4>
                    <p>Isi form dibawah ini dengan benar.</p>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form>
                <div className="modal-body row">
                    <div className="form-group mb-1 col-md-6">
                        <label className="form-label">Nama Gudang <Required/></label>
                        <input type="text" onChange={(e) => handleInputChange(e, setErrors, schema, formRef)} name="name" className={errors?.name?._errors.length ? "form-control is-invalid" : "form-control"} placeholder="Masukkan nama kategori" />
                        {
                            errors?.name?._errors.length && <small className="form-text text-danger">{ errors?.name?._errors[0]}</small>
                        }
                    </div>
                    <div className="form-group mb-1 col-md-6">
                        <label className="form-label">Nomor Telepon <Required/></label>
                        <input type="text" onChange={(e) => handleInputChange(e, setErrors, schema, formRef)} name="phone" className={errors?.phone?._errors.length ? "form-control is-invalid" : "form-control"} placeholder="Masukkan nama kategori" />
                        {
                            errors?.phone?._errors.length && <small className="form-text text-danger">{ errors?.phone?._errors[0]}</small>
                        }
                    </div>
                    <div className="form-group mb-1">
                        <label className="form-label">Alamat <Required/></label>
                        <textarea name="address" className={errors?.address?._errors.length ? "form-control is-invalid" : "form-control"} placeholder="Masukkan alamat kategori" onChange={(e) => handleInputChange(e, setErrors, schema, formRef)}></textarea>
                        {
                            errors?.address?._errors.length && <small className="form-text text-danger">{ errors?.address?._errors[0]}</small>
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn bg-primary-subtle text-primary  waves-effect" >
                    Tambah
                    </button>
                    <button type="button" className="btn bg-light-subtle text-muted  waves-effect" data-bs-dismiss="modal">
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