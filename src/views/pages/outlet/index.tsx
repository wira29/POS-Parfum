import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"
import { BtnModalAddOutlet, ModalAddOutlet } from "./widgets/modal-add-outlet"
import { useEffect } from "react"
import { useOutletStore } from "@/core/stores/OutletStore"
import { SearchInput } from "@/views/components/SearchInput"
import Swal from "sweetalert2"
import { useApiClient } from "@/core/helpers/ApiClient"
import { Toaster } from "@/core/helpers/BaseAlert"
import { BtnModalEditOutlet, ModalEditOutlet } from "./widgets/modal-edit-outlet"

export const OutletIndex = () => {
  const apiClient = useApiClient()
  const { outlets, firstGet, pagination, setPage, setSearch, getOutlets } = useOutletStore()

  const handleDelete = (id:string) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data outlet akan dihapus!",
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient.delete('outlets/'+id)
        .then(res => {
          Toaster('success', res.data.message)
          getOutlets()
        })
        .catch(err => {
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
      <ModalAddOutlet />
      <ModalEditOutlet />
      <div>
        <Breadcrumb title="Outlet" desc="List outlet yang anda miliki." button={<BtnModalAddOutlet />} />
        <div className="mb-2 row">
          <div className="col-12 col-md-4">
            <SearchInput setSearch={setSearch} />
          </div>
        </div>
        <div className='card p-6 rounded-lg'>
          <div className="card-body">
            <div className="mb-4 border rounded-1">
              <table className="table text-nowrap mb-0 align-middle">
                <thead className="text-dark fs-4">
                  <tr>
                    <th className="fs-4 fw-semibold mb-0 h6">#</th>
                    <th className="fs-4 fw-semibold mb-0 h6">Outlet</th>
                    <th className="fs-4 fw-semibold mb-0 h6">Jumlah Produk</th>
                    <th className="fs-4 fw-semibold mb-0 h6">Alamat</th>
                    <th className="fs-4 fw-semibold mb-0 h6">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    outlets.length
                    ? outlets.map((outlet, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src="assets/images/profile/user-10.jpg" className="rounded-circle" width="40" height="40" />
                            <div className="ms-3">
                              <h6 className="fs-4 fw-semibold mb-0">{outlet.name}</h6>
                              <span className="fw-normal">Mohammed Salah</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="mb-0 fw-normal">400 pcs</p>
                        </td>
                        <td>{outlet.address}</td>
                        <td>
                          <div className="dropdown dropstart">
                            <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="ti ti-dots-vertical fs-6"></i>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>

                              <li>
                                <BtnModalEditOutlet />
                              </li>
                              <li>
                                <button type="button" className="dropdown-item d-flex align-items-center gap-3" onClick={() => handleDelete(outlet.id)}>
                                  <i className="fs-4 ti ti-trash"></i>Hapus
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                    : <tr>
                      <th colSpan={5} className="text-center text-muted">-- belum ada outlet --</th>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <Pagination paginationData={pagination} updatePage={setPage} />
          </div>
        </div>
      </div>
    </>

  )
}