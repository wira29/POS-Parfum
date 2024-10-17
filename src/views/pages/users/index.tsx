import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useEffect, useState } from "react";
import { ModalAddUser } from "./widgets/index-modal-add-user";

export default function UserPage() {
    const apiClient = useApiClient();
    const [users, setUsers] = useState<{[key:string]:any}[]>([])
    const [dataPagination, setDataPagination] = useState({})

    const getUsers = () => {
        apiClient.get('/users').then(res => {
            setUsers(res.data.data.data)
            delete res.data.data.data
            setDataPagination(res.data.data)
        })
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <ModalAddUser onSuccessEditData={getUsers} />
            <Breadcrumb title="Pengguna" desc="Daftar pengguna yang ada pada toko anda" button={
                <button className="mt-2 btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAddUser">
                    Tambah Pengguna
                </button>
            } />
            <div className="row mb-2">
                <div className="col-4">
                    <input type="text" placeholder="cari..." className="form-control bg-white" />
                </div>
                <div className="col"></div>
                <div className="col-3">
                    <select className="form-select bg-white">
                        <option value="">Filter Outlet</option>
                    </select>
                </div>
                <div className="col-3">
                    <select className="form-select bg-white">
                        <option value="">Filter Posisi</option>
                    </select>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive mb-4 border rounded-1">
                        <table className="table text-nowrap align-middle m-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Posisi</th>
                                    <th>Alamat Kantor</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.length
                                        ? users.map((user, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th>{index + 1}</th>
                                                    <td>{user.name}</td>
                                                    <td>{user.position}</td>
                                                    <td>{user.address}</td>
                                                    <td>
                                                        <div className="dropdown dropstart">
                                                            <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="ti ti-dots-vertical fs-6"></i>
                                                            </a>
                                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>

                                                                <li>
                                                                    <a className="dropdown-item d-flex align-items-center gap-3" href="">
                                                                        <i className="fs-4 ti ti-edit"></i>Edit
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item d-flex align-items-center gap-3" href="">
                                                                        <i className="fs-4 ti ti-trash"></i>Hapus
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        : <tr>
                                            <th className="text-center text-muted" colSpan={5}>-- belum ada data --</th>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}