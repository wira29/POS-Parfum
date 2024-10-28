import { DataRoleSelect } from "@/core/data/data_role"
import { useUserStore } from "@/core/stores/UserStore"
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading"
import { Dropdown } from "@/views/components/Input"
import Textfield from "@/views/components/Input/Textfield"
import React, { useEffect, useRef, useState } from "react"
import { ZodFormattedError } from "zod"
import { addUserSchema } from "../schema/add-user"
import { SelectInstance } from "react-select"
import { OptionType } from "@/core/interface/select-option-interfact"

export const ModalEditUser = () => {

    const {updateUser, isLoading, isFailure, currentUser} = useUserStore()

    const formRef = useRef<{[key:string]:string|string[]}>({})
    const inputRef = useRef<{[key:string]:HTMLInputElement|null|SelectInstance<OptionType, true>}>({})
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validasi 
        const result = addUserSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            return
        }

        await updateUser(currentUser?.id, formRef)

        if (!isFailure) $('#modalEditUser').modal('hide')
    }

    useEffect(() => {
        formRef.current['name'] = currentUser?.name || ''
        formRef.current['email'] = currentUser?.email || ''
        formRef.current['password'] = ''
        
        if(currentUser) {
            const role_to_filter = currentUser?.roles.length ? currentUser?.roles?.map((role:{[key:string]:any}) => role.name) : []
            formRef.current['role'] = role_to_filter
        } else {
            formRef.current['role'] = []
        }

        if(inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = currentUser?.name || ''
        if(inputRef.current['email'] && 'value' in inputRef.current['email']) inputRef.current['email'].value = currentUser?.email || ''
        if(inputRef.current['password'] && 'value' in inputRef.current['password']) inputRef.current['password'].value = ''
        if(inputRef.current['role']) {
            let current_role:OptionType[] = []
            if(currentUser) {
                const role_to_filter = currentUser?.roles.length ? currentUser?.roles?.map((role:{[key:string]:any}) => role.name) : []
                current_role = DataRoleSelect.filter(role => role_to_filter.includes(role.value))
            }
            const roleSelectInstance = inputRef.current['role'] as SelectInstance<OptionType, true>
            roleSelectInstance.setValue(current_role, 'select-option')
        }
    }, [currentUser])

    return (
        <div id="modalEditUser" className="modal fade" tabIndex={-1} aria-labelledby="bs-example-modal-md" aria-hidden="true">
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
                    <Textfield ref={(el) => (inputRef.current['email'] = el)} inputType="email" col="col-md-6" title="Email" name="email" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan email"/>
                    <Textfield ref={(el) => (inputRef.current['password'] = el)} inputType="password" col="col-md-6" title="Password" name="password" setErrors={setErrors} schema={addUserSchema} formRef={formRef} errors={errors} placeholder="Masukkan password"/>
                    <Dropdown ref={(el) => (inputRef.current['role']) = el} isMulti={true} name="role" col="col-md-6" errors={errors} title="Role" options={DataRoleSelect} schema={addUserSchema} formRef={formRef} setErrors={setErrors}/>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-muted" data-bs-dismiss="modal">
                    Tutup
                    </button>
                    <ButtonWithLoading disabled={isLoading} type="submit" loading={isLoading} className="btn btn-primary">Submit</ButtonWithLoading>
                </div>
                </form>

                </div>
                {/* <!-- /.modal-content --> */}
            </div>
        </div>
    )
}

export const BtnModalEditUser = (props:{[key:string]:any}) => {
    return (
        <button type="button" className="dropdown-item d-flex align-items-center gap-3" {...props} data-bs-toggle="modal" data-bs-target="#modalEditUser">
            <i className="fs-4 ti ti-edit"></i>Edit
        </button>
    )
}