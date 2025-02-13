import Textfield from "@/views/components/Input/Textfield"
import { useRef, useState, useEffect } from "react"
import { ZodFormattedError } from "zod"
import { addOutletSchema } from "../schema/addOutletSchema"
import { useOutletStore } from "@/core/stores/OutletStore"
import { Dropdown } from "@/views/components/Input"
import { useApiClient } from "@/core/helpers/ApiClient"
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading"
import TextAreaInput from "@/views/components/Input/TextAreaInput"

export const ModalAddOutlet = () => {
    const formRef = useRef({})
    const apiClient = useApiClient()
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>()
    const {isLoading, isFailure, createOutlet, outlets} = useOutletStore()
    const [users, setUsers] = useState<{[key:string]:any}[]>([])

    const getUsers = () => {
        apiClient.get('users/no-paginate?outlet=false')
        .then(res => {
            const remap_users = res.data.data.map((user:any) => ({label: user.name, value: user.id}))
            setUsers(remap_users)
        }).catch(() => {
            setUsers([])
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validasi 
        const result = addOutletSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            return
        }

        await createOutlet(formRef)

        if (!isFailure) $('#modalAddOutlet').modal('hide')
    }

    useEffect(() => {
        getUsers()
    }, [outlets])
    

    return (
        <div className="modal modal-lg fade" id="modalAddOutlet" tabIndex={-1}>
            <div className="modal-dialog">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header flex-column w-100 align-items-stretch">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Tambah Outlet</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <p>Isi form dibawah ini dengan benar.</p>
                    </div>
                    <div className="modal-body row">
                        <Textfield col="col-lg-6" isRequired={true} title="Nama" name="name" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Nama"/>
                        <Textfield col="col-lg-6" isRequired={true} title="Telp" name="telp" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="No. Telp"/>
                        <TextAreaInput col="" isRequired={true} title="Alamat" name="address" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Alamat"/>
                        <Dropdown isRequired={false} isMulti={true} name="user_id" col="" errors={errors} title="Karyawan/Pekerja" options={users} schema={addOutletSchema} formRef={formRef} setErrors={setErrors}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-dismiss="modal">Tutup</button>
                        <ButtonWithLoading disabled={isLoading} type="submit" loading={isLoading} className="btn btn-primary">Tambah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const BtnModalAddOutlet = () => {
    return (
        <button className="mt-2 btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAddOutlet">
            Tambah Outlet
        </button>
    )
}