import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { addWarehouseSchema } from "../schema/schema";
import Textfield from "@/views/components/Input/Textfield";
import { Dropdown } from "@/views/components/Input";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useWarehouseStore } from "@/core/stores/WarehouseStore";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import { SelectInstance } from "react-select";
import { OptionType } from "@/core/interface/select-option-interface";
import TextAreaInput from "@/views/components/Input/TextAreaInput";

const EditModal = () => {

    const apiClient = useApiClient()
    const formRef = useRef<any>({});
    const inputRef = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | null | SelectInstance<OptionType, true> }>({})
    const [errors, setErrors] = useState<ZodFormattedError<{ name: string, phone: string, address: string }, string>>();
    const [users, setUsers] = useState<OptionType[]>([])
    const { isLoading, updateWarehouse, isFailure, currentWarehouse } = useWarehouseStore()

    const getUsers = async () => {
        try {
            const res = await apiClient.get('users/v2/no-paginate?warehouse=true&warehouse_id=' + currentWarehouse?.id)
            const remap_users = res.data.data.map((user: any) => ({ label: user.name, value: user.id }))
            setUsers(remap_users)
        } catch (e: any) {
            setUsers([])
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const result = addWarehouseSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            return
        }

        await updateWarehouse(currentWarehouse?.id, formRef)

        if (!isFailure) $('#edit-warehouse-modal').modal('hide')
    }

    const firstLoad = async () => {
        await getUsers()

        formRef.current['name'] = currentWarehouse?.name || ''
        formRef.current['address'] = currentWarehouse?.address || ''
        formRef.current['telp'] = currentWarehouse?.telp || ''

        if (currentWarehouse) {
            const outlet_to_filter = currentWarehouse?.users.length ? currentWarehouse?.users?.map((user: { [key: string]: any }) => user.id) : []
            formRef.current['user_id'] = outlet_to_filter
        } else {
            formRef.current['user_id'] = []
        }

        if (inputRef.current['name'] && 'value' in inputRef.current['name']) inputRef.current['name'].value = currentWarehouse?.name || ''
        if (inputRef.current['address'] && 'value' in inputRef.current['address']) inputRef.current['address'].value = currentWarehouse?.address || ''
        if (inputRef.current['telp'] && 'value' in inputRef.current['telp']) inputRef.current['telp'].value = currentWarehouse?.telp || ''
        if (inputRef.current['user_id']) {
            let current_user: OptionType[] = []
            if (currentWarehouse) {
                const user_to_filter = currentWarehouse?.users.length ? currentWarehouse?.users?.map((user: { [key: string]: any }) => user.id) : []
                current_user = users.filter(user => user_to_filter.includes(user.value))
            }
            const userSelectInstance = inputRef.current['user_id'] as SelectInstance<OptionType, true>
            userSelectInstance.setValue(current_user, 'select-option')
        }
    }

    useEffect(() => {
        firstLoad()
    }, [currentWarehouse])

    return (
        <div id="edit-warehouse-modal" className="modal modal-lg fade" tabIndex={-1} aria-labelledby="add-warehouse-modal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header flex-column w-100 align-items-stretch">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Ubah Gudang</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <p>Isi form dibawah ini dengan benar.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body row">
                            <Textfield ref={(el) => (inputRef.current['name'] = el)} col="col-lg-6" isRequired={true} title="Nama" name="name" setErrors={setErrors} schema={addWarehouseSchema} formRef={formRef} errors={errors} placeholder="Nama" />
                            <Textfield ref={(el) => (inputRef.current['telp'] = el)} col="col-lg-6" isRequired={true} title="Telp" name="telp" setErrors={setErrors} schema={addWarehouseSchema} formRef={formRef} errors={errors} placeholder="No. Telp" />
                            <TextAreaInput ref={(el) => (inputRef.current['address'] = el)} col="" isRequired={true} title="Alamat" name="address" setErrors={setErrors} schema={addWarehouseSchema} formRef={formRef} errors={errors} placeholder="Alamat" />
                            <Dropdown ref={(el) => (inputRef.current['user_id'] = el)} isRequired={false} isMulti={true} name="user_id" col="" errors={errors} title="Karyawan/Pekerja" options={users} schema={addWarehouseSchema} formRef={formRef} setErrors={setErrors} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-muted" data-bs-dismiss="modal">Tutup</button>
                            <ButtonWithLoading disabled={isLoading} type="submit" loading={isLoading} className="btn btn-primary">Ubah</ButtonWithLoading>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export const BtnEditModal = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            type="button"
            className="dropdown-item d-flex align-items-center gap-3"
            data-bs-toggle="modal"
            data-bs-target="#edit-warehouse-modal"
            {...props}
        >
            <i className="fs-4 ti ti-edit"></i>Ubah
        </button>
    )
}

export default EditModal;