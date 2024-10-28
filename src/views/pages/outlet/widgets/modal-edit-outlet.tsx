import Textfield from "@/views/components/Input/Textfield"
import { useRef, useState, useEffect, ButtonHTMLAttributes } from "react"
import { ZodFormattedError } from "zod"
import { addOutletSchema } from "../schema/addOutletSchema"
import { useOutletStore } from "@/core/stores/OutletStore"
import { Dropdown } from "@/views/components/Input"
import { useApiClient } from "@/core/helpers/ApiClient"
import { SelectInstance } from "react-select"
import { OptionType } from "@/core/interface/select-option-interfact"

export const ModalEditOutlet = ({current_outlet}:{current_outlet?:{[key:string]:any}}) => {
    const formRef = useRef<{[key:string]:string|string[]}>({})
    const inputRef = useRef<{[key:string]:HTMLInputElement|null|SelectInstance<OptionType, true>}>({})
    const apiClient = useApiClient()
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>()
    const {isLoading, isFailure, updateOutlet, setLoading} = useOutletStore()
    const [users, setUsers] = useState<OptionType[]>([])

    const getUsers = async() => {
        try {
            const res = await apiClient.get('users/no-paginate?outlet=false&outlet_id='+current_outlet?.id)
            const remap_users = res.data.data.map((user:any) => ({label: user.name, value: user.id}))
            setUsers(remap_users)
        } catch(e:any) {
            setUsers([])
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // validasi 
        const result = addOutletSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            return
        }

        await updateOutlet(current_outlet?.id, formRef)

        if (!isFailure) $('#modalEditOutlet').modal('hide')
    }

    useEffect(() => {
        getUsers()
    }, [])

    const firstLoad = async () => {
        await getUsers()

        formRef.current['name'] = current_outlet?.name || ''
        formRef.current['address'] = current_outlet?.address || ''
        formRef.current['telp'] = current_outlet?.telp || ''
        
        if(current_outlet) {
            const outlet_to_filter = current_outlet?.users.length ? current_outlet?.users?.map((user:{[key:string]:any}) => user.id) : []
            formRef.current['user_id'] = outlet_to_filter
        } else {
            formRef.current['user_id'] = []
        }

        if(inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = current_outlet?.name || ''
        if(inputRef.current['address'] && 'value' in inputRef.current['address']) inputRef.current['address'].value = current_outlet?.address || ''
        if(inputRef.current['telp'] && 'value' in inputRef.current['telp']) inputRef.current['telp'].value = current_outlet?.telp || ''
        if(inputRef.current['user_id']) {
            let current_user:OptionType[] = []
            if(current_outlet) {
                const user_to_filter = current_outlet?.users.length ? current_outlet?.users?.map((user:{[key:string]:any}) => user.name) : []
                current_user = users.filter(user => user_to_filter.includes(user.value))
            }
            const userSelectInstance = inputRef.current['user_id'] as SelectInstance<OptionType, true>
            userSelectInstance.setValue(current_user, 'select-option')
        }
    }
    
    useEffect(() => {
        firstLoad()
    }, [current_outlet])

    return (
        <div className="modal fade" id="modalEditOutlet" tabIndex={-1}>
            <div className="modal-dialog">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Ubah Outlet</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <Textfield ref={(el) => (inputRef.current['name'] = el)} col="" isRequired={true} title="Nama" name="name" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Nama"/>
                        <Textfield ref={(el) => (inputRef.current['address'] = el)} col="" isRequired={true} title="Alamat" name="address" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Alamat"/>
                        <Textfield ref={(el) => (inputRef.current['telp'] = el)} col="" isRequired={false} title="Telp" name="telp" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="No. Telp"/>
                        <Dropdown ref={(el) => (inputRef.current['user_id'] = el)} isRequired={false} isMulti={true} name="user_id" col="" errors={errors} title="Karyawan/Pekerja" options={users} schema={addOutletSchema} formRef={formRef} setErrors={setErrors}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-dismiss="modal">Tutup</button>
                        <button type="submit" className="btn btn-primary">
                            {
                                isLoading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : 'Ubah'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const BtnModalEditOutlet = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button className="dropdown-item d-flex align-items-center gap-3" data-bs-toggle="modal" data-bs-target="#modalEditOutlet" {...props}>
            <i className="fs-4 ti ti-edit"></i>Edit
        </button>
    )
}