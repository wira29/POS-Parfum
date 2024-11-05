import { useProductStore } from "@/core/stores/ProductStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"
import { useEffect } from "react"
import AddModal, { BtnAddModal } from "./widgets/AddModal"

export const ProductIndex = () => {

  const { pagination, setPage, products, firstGet, setCurrentProduct, deleteProduct } = useProductStore()

  useEffect(() => {
    firstGet()
  }, [])

  return (
    <div>
      <AddModal />
      <Breadcrumb title="Produk" desc="List produk yang ada pada toko anda" button={<BtnAddModal />} />
      <div className='card rounded-lg'>
        <div className="card-body">
          <div className="mb-4 border rounded-1">
            <table className="table text-nowrap mb-0 align-middle">
              <thead className="text-dark fs-4">
                <tr>
                  <th>No</th>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Varian</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.length
                    ? products.map((product, index) => (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td>Produk</td>
                        <td>Kategori</td>
                        <td>Varian</td>
                        <td>
                          <div className="dropdown dropstart">
                            <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="ti ti-dots-vertical fs-6"></i>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>
                              <li>
                                {/* <BtnEditModal onClick={() => setCurrentProduct(product)} /> */}
                              </li>
                              <li>
                                <button type="button" className="dropdown-item d-flex align-items-center gap-3" onClick={() => deleteProduct(product)}>
                                  <i className="fs-4 ti ti-trash"></i>Hapus
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                    : <tr>
                      <th colSpan={5} className="text-center text-muted">-- belum ada produk --</th>
                    </tr>
                }
              </tbody>
            </table>

          </div>
          <Pagination paginationData={pagination} updatePage={setPage} />
        </div>
      </div>
    </div>

  )
}