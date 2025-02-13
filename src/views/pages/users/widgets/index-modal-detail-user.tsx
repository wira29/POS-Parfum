import { useUserStore } from "@/core/stores/UserStore"
import { useEffect } from "react"

export const ModalDetailUser = () => {

    const {currentUser} = useUserStore()

    useEffect(() => {
        console.log({currentUser})
    }, [currentUser])

    return (
        <div id="modalDetailUser" className="modal fade" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-primary rounded-top-4 flex-column w-100 align-items-stretch">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="modal-title text-white m-0">Detail Pengguna</h4>
                            <button type="button" className="btn p-0 text-white fs-6" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                        </div>
                    </div>
                    <div className="modal-body d-flex flex-column justify-content-center align-items-center gap-3">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="fw-bolder">{currentUser?.name}</div>
                            <div>{currentUser?.email}</div>
                            <div className="d-flex gap-2">
                                {
                                    currentUser?.roles?.map((role:{name:string}, index:number) => (
                                        <span key={index} className="badge bg-light-warning text-warning">{role.name}</span>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="fw-semibold">{currentUser?.related_store?.name}</div>
                            <div>{currentUser?.related_store?.address}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BtnModalDetailUser = (props:{[key:string]:any}) => {
    return (
        <button type="button" className="dropdown-item d-flex align-items-center gap-3" {...props} data-bs-toggle="modal" data-bs-target="#modalDetailUser">
            <i className="fs-4 ti ti-list"></i>Detail
        </button>
    )
}