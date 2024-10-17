import { DataRole, DataRoleSelect } from "@/core/data/data_role"
import { useApiClient } from "@/core/helpers/ApiClient"
import { Toaster } from "@/core/helpers/BaseAlert"
import { TMultiSelect } from "@/core/interface/input-interface"
import { InputMultiSelect, InputText } from "@/views/components/Input"
import { ZodForm } from "@/views/components/ZodForm"
import { SyntheticEvent, useEffect, useState } from "react"
import { z } from "zod"

export const ModalAddUser = ({onSuccessEditData}:{onSuccessEditData: () => void}) => {
    const addUserSchema = z.object({
        name: z.string().min(3, "minimal 3 karakter").max(255, "maksimal 255 karakter"),
        email: z.string().email("harus berupa email").min(1, "tidak boleh kosong").max(255, "maksimal 255 karakter"),
        password: z.string().min(8, "minimal 8 karakter").max(255, "maksimal 255 karakter"),
        role: z.array(z.enum(DataRole)).min(1, 'harus memilih minimal 1')
    })

    const apiClient = useApiClient()

    type TUserSchema = z.infer<typeof addUserSchema>

    const [userForm, setUserForm] = useState<TUserSchema>({
        name: '',
        email: '',
        password: '',
        role: []
    })

    const [errorsMsg, setErrorsMsg] = useState<{[key:string]:string[]}>({})

    const handleSubmit = () => {
        apiClient.post('users', userForm).then(res => {
            Toaster('success', res.data.message)
            onSuccessEditData()
            $('#modalAddUser').modal('hide')
        }).catch(err => {
            Toaster('error', err.response.data.message)
        })
    }

    const handleInputText = (e:SyntheticEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget
        setUserForm((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const [selectedRole, setSelectedRole] = useState<TMultiSelect>([])

    useEffect(() => {
        const formattedRole = selectedRole.map((role) => (role.value))
        setUserForm((prevData) => ({
            ...prevData,
            role: formattedRole
        }))
    }, [selectedRole])

    return (
        <div className="modal" id="modalAddUser" tabIndex={-1}>
            <div className="modal-dialog">
                <ZodForm formdata={userForm} setFormdataFn={setUserForm} schema={addUserSchema} setErrorMsg={setErrorsMsg} onSuccessValidation={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <h5>Tambah Pengguna</h5>
                        <button className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <InputText
                                settings={{
                                    label: "Nama",
                                    name: "name",
                                    placeholder: "Nama",
                                    required: true,
                                    onInput: handleInputText
                                }}
                                errors={errorsMsg.name}
                            />
                        </div>
                        <div className="mb-3">
                            <InputText
                                settings={{
                                    label: "Email",
                                    name: "email",
                                    placeholder: "Email",
                                    required: true,
                                    onInput: handleInputText
                                }}
                                errors={errorsMsg.email}
                            />
                        </div>
                        <div className="mb-3">
                            <InputText
                                settings={{
                                    label: "Password",
                                    name: "password",
                                    placeholder: "Password",
                                    type: "password",
                                    required: true,
                                    onInput: handleInputText
                                }}
                                errors={errorsMsg.password}
                            />
                        </div>
                        <InputMultiSelect
                            settings={{
                                label: "Role",
                                required: true,
                                onChange:(selected:{value: string, label: string}[]) => setSelectedRole(selected)
                            }}
                            errors={errorsMsg.role}
                            options={DataRoleSelect}
                            selectedOptions={selectedRole}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn bg-danger-subtle text-danger  waves-effect" data-bs-dismiss="modal">Tutup</button>
                        <button type="submit" className="btn bg-primary-subtle text-primary  waves-effect" >Tambah</button>
                    </div>
                </ZodForm>
            </div>
        </div>
    )
}