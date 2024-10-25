import Textfield from "@/views/components/Input/Textfield"
import { useRef, useState, useEffect } from "react"
import { ZodFormattedError } from "zod"
import { addOutletSchema } from "../schema/addOutletSchema"
import { useOutletStore } from "@/core/stores/OutletStore"
import { Dropdown } from "@/views/components/Input"
import { useApiClient } from "@/core/helpers/ApiClient"

export const ModalAddOutlet = () => {
    const formRef = useRef({})
    const apiClient = useApiClient()
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>()
    const {isLoading, isFailure, createOutlet, setLoading, outlets} = useOutletStore()
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
        setLoading(true)

        // validasi 
        const result = addOutletSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            setLoading(false)
            return
        }

        await createOutlet(formRef)

        if (!isFailure) $('#modalAddUser').modal('hide')

    }

    useEffect(() => {
        getUsers()
    }, [outlets])
    

    return (
        <div className="modal fade" id="modalAddOutlet" tabIndex={-1}>
            <div className="modal-dialog">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Outlet</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <Textfield col="" isRequired={true} title="Nama" name="name" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Nama"/>
                        <Textfield col="" isRequired={true} title="Alamat" name="address" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Alamat"/>
                        <Textfield col="" isRequired={false} title="Telp" name="telp" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="No. Telp"/>
                        <Dropdown isRequired={false} isMulti={true} name="user_id" col="" errors={errors} title="Karyawan/Pekerja" options={users} schema={addOutletSchema} formRef={formRef} setErrors={setErrors}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-dismiss="modal">Tutup</button>
                        <button type="submit" className="btn btn-primary">
                            {
                                isLoading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : 'Tambah'
                            }
                        </button>
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