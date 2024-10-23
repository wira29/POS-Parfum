import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useEffect } from "react";
import { ModalAddUser } from "./widgets/index-modal-add-user";
import Swal from "sweetalert2";
import { Toaster } from "@/core/helpers/BaseAlert";
import { Pagination } from "@/views/components/Pagination";
import { useUserStore } from "@/core/stores/UserStore";
import { SearchInput } from "@/views/components/SearchInput";

export default function UserPage() {
    const apiClient = useApiClient();

    const {users, getUsers, pagination, firstGet, setPage, setSearch} = useUserStore()

    const deleteUser = (user_id:string) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data pengguna ini akan dihapus!",
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                apiClient.delete(`/users/${user_id}`).then(res => {
                    Toaster('success', res.data.message)
                    getUsers()
                }).catch(err => {
                    Toaster('error', err.response.data.message)
                })
            }
        })
    }

    useEffect(() => {
        firstGet()
    }, [])

    return (
        <>
            <ModalAddUser />
            <Breadcrumb title="Pengguna" desc="Daftar pengguna yang ada pada toko anda" button={
                <button className="mt-2 btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAddUser">
                    Tambah Pengguna
                </button>
            } />
            <div className="row mb-2">
                <div className="col-4">
                    <SearchInput setSearch={setSearch} />
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
                                                <td>
                                                    {user.roles.map((role:any, index:number) => (
                                                        <span key={index} className="badge bg-light-primary text-primary me-1">{role.name}</span>
                                                    ))}
                                                </td>
                                                <td>{user.related_store.address}</td>
                                                <td>
                                                    <div className="dropdown dropstart">
                                                        <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i className="ti ti-dots-vertical fs-6"></i>
                                                        </a>
                                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>

                                                            <li>
                                                                <button type="button" className="dropdown-item d-flex align-items-center gap-3">
                                                                    <i className="fs-4 ti ti-edit"></i>Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button type="button" onClick={() => deleteUser(user.id)} className="dropdown-item d-flex align-items-center gap-3">
                                                                    <i className="fs-4 ti ti-trash"></i>Hapus
                                                                </button>
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
                    <Pagination paginationData={pagination} updatePage={setPage}/>
                </div>
            </div>
        </>
    )
}