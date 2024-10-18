import { DataRoleSelect } from "@/core/data/data_role"
import { Toaster } from "@/core/helpers/BaseAlert"
import { useUserStore } from "@/core/stores/UserStore"
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading"
import { Dropdown } from "@/views/components/Input"
import Textfield from "@/views/components/Input/Textfield"
import React, { useRef, useState } from "react"
import { ZodFormattedError } from "zod"
import { addUserSchema } from "../schema/add-user"

export const ModalAddUser = ({onSuccessEditData}:{onSuccessEditData: () => void}) => {

    const {createUser, isLoading, setLoading, failure} = useUserStore()

    const formRef = useRef({})
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        console.log(formRef.current)

        // validasi 
        const result = addUserSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            setLoading(false)
            return
        }

        await createUser(formRef)

        if (!failure) {
            Toaster('success', "Berhasil menambahkan user")
            $('#modalAddUser').modal('hide')

        } else {
            Toaster('error', failure)
        }

    }

    return (
        <div id="modalAddUser" className="modal fade" tabIndex={-1} aria-labelledby="bs-example-modal-md" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                <div className="modal-header d-flex align-items-start">
                    <div>
                    <h4 className="modal-title" id="myModalLabel">
                    Tambah Pengguna
                    </h4>
                    <p>Isi form dibawah ini dengan benar.</p>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={handleSubmit}>
                <div className="modal-body row">
                    <Textfield col="col-md-6" title="Nama" name="name" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan nama"/>
                    <Textfield inputType="email" col="col-md-6" title="Email" name="email" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan email"/>
                    <Textfield inputType="password" col="col-md-6" title="Password" name="password" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan password"/>
                    <Dropdown isMulti={true} name="role" col="col-md-6" errors={errors} title="Role" options={DataRoleSelect} schema={addUserSchema} formRef={formRef} setErrors={setErrors}/>
                </div>
                <div className="modal-footer">
                    <ButtonWithLoading disabled={isLoading} type="submit" loading={isLoading} className="btn bg-primary-subtle text-primary  waves-effect" >Submit</ButtonWithLoading>
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
    )
}