import Textfield from "@/views/components/Input/Textfield"
import { useRef, useState, useEffect, ButtonHTMLAttributes } from "react"
import { ZodFormattedError } from "zod"
import { addOutletSchema } from "../schema/addOutletSchema"
import { useOutletStore } from "@/core/stores/OutletStore"
import { Dropdown } from "@/views/components/Input"
import { useApiClient } from "@/core/helpers/ApiClient"
import { SelectInstance } from "react-select"
import { OptionType } from "@/core/interface/select-option-interface"
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading"
import TextAreaInput from "@/views/components/Input/TextAreaInput"

export const ModalEditOutlet = () => {
    const formRef = useRef<{[key:string]:string|string[]}>({})
    const inputRef = useRef<{[key:string]:HTMLInputElement|HTMLTextAreaElement|null|SelectInstance<OptionType, true>}>({})
    const apiClient = useApiClient()
    const [errors, setErrors] = useState<ZodFormattedError<{name: string}, string>>()
    const {isLoading, isFailure, updateOutlet, setLoading, currentOutlet} = useOutletStore()
    const [users, setUsers] = useState<OptionType[]>([])

    const getUsers = async() => {
        try {
            const res = await apiClient.get('users/v2/no-paginate?outlet=true&outlet_id='+currentOutlet?.id)
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

        await updateOutlet(currentOutlet?.id, formRef)

        if (!isFailure) $('#modalEditOutlet').modal('hide')
    }

    useEffect(() => {
        getUsers()
    }, [])

    const firstLoad = async () => {
        formRef.current['name'] = currentOutlet?.name || ''
        formRef.current['address'] = currentOutlet?.address || ''
        formRef.current['telp'] = currentOutlet?.telp || ''
        
        if(currentOutlet) {
            const outlet_to_filter = currentOutlet?.users.length ? currentOutlet?.users?.map((user:{[key:string]:any}) => user.id) : []
            formRef.current['user_id'] = outlet_to_filter
        } else {
            formRef.current['user_id'] = []
        }

        if(inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = currentOutlet?.name || ''
        if(inputRef.current['address'] && 'value' in inputRef.current['address']) inputRef.current['address'].value = currentOutlet?.address || ''
        if(inputRef.current['telp'] && 'value' in inputRef.current['telp']) inputRef.current['telp'].value = currentOutlet?.telp || ''
        if(inputRef.current['user_id']) {
            let current_user:OptionType[] = []
            if(currentOutlet) {
                const user_to_filter = currentOutlet?.users.length ? currentOutlet?.users?.map((user:{[key:string]:any}) => user.id) : []
                current_user = users.filter(user => user_to_filter.includes(user.value))
                console.log({currentOutlet, current_user, user_to_filter, users})
            }
            const userSelectInstance = inputRef.current['user_id'] as SelectInstance<OptionType, true>
            userSelectInstance.setValue(current_user, 'select-option')
        }
    }
    
    useEffect(() => {
        firstLoad()
    }, [users])
    useEffect(() => {
        firstLoad()
        getUsers()
    }, [currentOutlet])

    return (
        <div className="modal modal-lg fade" id="modalEditOutlet" tabIndex={-1}>
            <div className="modal-dialog">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header flex-column w-100 align-items-stretch">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Ubah Outlet</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <p>Isi form dibawah ini dengan benar.</p>
                    </div>
                    <div className="modal-body row">
                        <Textfield ref={(el) => (inputRef.current['name'] = el)} col="col-lg-6" isRequired={true} title="Nama" name="name" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Nama"/>
                        <Textfield ref={(el) => (inputRef.current['telp'] = el)} col="col-lg-6" isRequired={true} title="Telp" name="telp" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="No. Telp"/>
                        <TextAreaInput ref={(el) => (inputRef.current['address'] = el)} col="" isRequired={true} title="Alamat" name="address" setErrors={setErrors} schema={addOutletSchema} formRef={formRef} errors={errors} placeholder="Alamat"/>
                        <Dropdown ref={(el) => (inputRef.current['user_id'] = el)} isRequired={false} isMulti={true} name="user_id" col="" errors={errors} title="Karyawan/Pekerja" options={users} schema={addOutletSchema} formRef={formRef} setErrors={setErrors}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-dismiss="modal">Tutup</button>
                        <ButtonWithLoading disabled={isLoading} type="submit" loading={isLoading} className="btn btn-primary">Ubah</ButtonWithLoading>
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