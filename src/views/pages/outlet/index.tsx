import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"

export const OutletIndex = () => {

    return (
        <div>
            <Breadcrumb title="Outlet" desc="List outlet yang anda miliki." />
          <div className='card p-6 rounded-lg'>
            <div className="card-body">
            <div className="mb-4 border rounded-1">
                <table className="table text-nowrap mb-0 align-middle">
                  <thead className="text-dark fs-4">
                    <tr>
                    <th>
                        <h6 className="fs-4 fw-semibold mb-0">No</h6>
                      </th>
                      <th>
                        <h6 className="fs-4 fw-semibold mb-0">Outlet</h6>
                      </th>
                      <th>
                        <h6 className="fs-4 fw-semibold mb-0">Jumlah Produk</h6>
                      </th>
                      <th>
                        <h6 className="fs-4 fw-semibold mb-0">Alamat</h6>
                      </th>
                      <th>
                        <h6 className="fs-4 fw-semibold mb-0">Aksi</h6>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td>
                            1
                        </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src="assets/images/profile/user-10.jpg" className="rounded-circle" width="40" height="40" />
                          <div className="ms-3">
                            <h6 className="fs-4 fw-semibold mb-0">Outlet A</h6>
                            <span className="fw-normal">Mohammed Salah</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 fw-normal">400 pcs</p>
                      </td>
                      <td>
                        Jl Ahmad Yani, No 28 Malang
                        Jawa Timur Indonesia
                      </td>
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
                  </tbody>
                </table>
                
              </div>
              <Pagination /> 
            </div>
        </div>
        </div>
        
    )
}