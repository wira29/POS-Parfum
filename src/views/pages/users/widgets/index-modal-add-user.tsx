import { DataRoleSelect } from "@/core/data/data_role"
import { useUserStore } from "@/core/stores/UserStore"
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading"
import { Dropdown } from "@/views/components/Input"
import Textfield from "@/views/components/Input/Textfield"
import React, { useRef, useState } from "react"
import { ZodFormattedError } from "zod"
import { addUserSchema } from "../schema/add-user"
import InputImage from "@/views/components/Input/InputImage"

export const ModalAddUser = ({}:{}) => {

    const {createUser, isLoading, setLoading, isFailure} = useUserStore()

    const formRef = useRef({})
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // validasi 
        const result = addUserSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            setLoading(false)
            return
        }

        await createUser(formRef)

        if (!isFailure) $('#modalAddUser').modal('hide')
    }

    return (
        <div id="modalAddUser" className="modal fade" tabIndex={-1} aria-labelledby="bs-example-modal-md" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header flex-column w-100 align-items-stretch">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Tambah Pengguna</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <p>Isi form dibawah ini dengan benar.</p>
                    </div>
                    <div className="modal-body row">
                        <InputImage setErrors={setErrors} schema={addUserSchema} formRef={formRef} name="image" errors={errors} col="" title="Profil Pengguna" isRequired={false} />
                        <Textfield col="" title="Nama" name="name" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan nama"/>
                        <Textfield inputType="email" col="col-lg-6" title="Email" name="email" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan email"/>
                        <Textfield inputType="password" col="col-lg-6" title="Password" name="password" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan password"/>
                        <Dropdown isMulti={true} name="role" col="" errors={errors} title="Role" options={DataRoleSelect} schema={addUserSchema} formRef={formRef} setErrors={setErrors}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-bs-dismiss="modal">
                        Tutup
                        </button>
                        <ButtonWithLoading disabled={isLoading} type="submit" loading={isLoading} className="btn btn-primary">Tambah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    )
}