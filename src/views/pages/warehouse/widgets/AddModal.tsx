import { useEffect, useRef, useState } from "react";
import { ZodFormattedError } from "zod";
import { addWarehouseSchema } from "../schema/schema";
import Textfield from "@/views/components/Input/Textfield";
import { Dropdown } from "@/views/components/Input";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useWarehouseStore } from "@/core/stores/WarehouseStore";
import { ButtonWithLoading } from "@/views/components/Button/ButtonWithLoading";
import TextAreaInput from "@/views/components/Input/TextAreaInput";

const AddModal = () => {

    const apiClient = useApiClient()
    const formRef = useRef<any>({});
    const [errors, setErrors] = useState<ZodFormattedError<{ name: string, phone: string, address: string }, string>>();
    const [users, setUsers] = useState<{ [key: string]: any }[]>([])
    const { isLoading, setLoading, createWarehouse, isFailure, warehouses } = useWarehouseStore()

    const getUsers = () => {
        apiClient.get('users/no-paginate?warehouse=false')
            .then(res => {
                const remap_users = res.data.data.map((user: any) => ({ label: user.name, value: user.id }))
                setUsers(remap_users)
            }).catch(() => {
                setUsers([])
            })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // validasi 
        const result = addWarehouseSchema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
            setLoading(false)
            return
        }

        await createWarehouse(formRef)

        if (!isFailure) $('#modalAddUser').modal('hide')

    }

    useEffect(() => {
        getUsers()
    }, [warehouses])

    return (
        <div id="add-warehouse-modal" className="modal modal-lg fade" tabIndex={-1} aria-labelledby="add-warehouse-modal" aria-hidden="true">
            <div className="modal-dialog">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header flex-column w-100 align-items-stretch">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="modal-title">Tambah Gudang</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <p>Isi form dibawah ini dengan benar.</p>
                    </div>
                    <div className="modal-body row">
                        <Textfield col="col-lg-6" isRequired={true} title="Nama" name="name" setErrors={setErrors} schema={addWarehouseSchema} formRef={formRef} errors={errors} placeholder="Nama" />
                        <Textfield col="col-lg-6" isRequired={true} title="No. Telp" name="telp" setErrors={setErrors} schema={addWarehouseSchema} formRef={formRef} errors={errors} placeholder="No. Telp" />
                        <TextAreaInput col="" isRequired={true} title="Alamat" name="address" setErrors={setErrors} schema={addWarehouseSchema} formRef={formRef} errors={errors} placeholder="Alamat" />
                        <Dropdown isRequired={false} isMulti={true} name="user_id" col="" errors={errors} title="Karyawan/Pekerja" options={users} schema={addWarehouseSchema} formRef={formRef} setErrors={setErrors} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-muted" data-bs-dismiss="modal">Tutup</button>
                        <ButtonWithLoading disabled={isLoading} type="submit" loading={isLoading} className="btn btn-primary">Tambah</ButtonWithLoading>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const BtnAddModal = () => {
    return (
        <button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#add-warehouse-modal">Tambah Gudang</button>
    )
}

export default AddModal;