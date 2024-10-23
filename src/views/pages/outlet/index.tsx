import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"
import { BtnModalAddOutlet, ModalAddOutlet } from "./widgets/modal-add-outlet"
import { useEffect } from "react"
import { useOutletStore } from "@/core/stores/OutletStore"
import { SearchInput } from "@/views/components/SearchInput"

export const OutletIndex = () => {
  const { outlets, firstGet, pagination, setPage, setSearch } = useOutletStore()

  useEffect(() => {
    firstGet()
  }, [])

  return (
    <>
      <ModalAddOutlet />
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