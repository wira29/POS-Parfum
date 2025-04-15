import { formatNum } from "@/core/helpers/FormatNumber"
import { useAuthStore } from "@/core/stores/AuthStore"
import { useProductStore } from "@/core/stores/ProductStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { Pagination } from "@/views/components/Pagination"
import { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const ProductIndex = () => {

  const { pagination, setPage, products, firstGet, deleteProduct, setCustomQuery } = useProductStore()
  const {isRoleCanAccess} = useAuthStore()
  const [openProduct, setOpenProduct] = useState<string>()

  useEffect(() => {
    if(isRoleCanAccess('outlet')) setCustomQuery('orderby_total_stock=asc')
    setTimeout(() => {
      firstGet()
    }, 300)
  }, [])

  return (
    <div>
      <Breadcrumb title="Produk" desc="List produk yang ada pada toko anda" button={ isRoleCanAccess('owner') ? <Link to={'/products/create'} className="mt-2 btn btn-primary">Tambah Produk</Link> : (isRoleCanAccess('outlet') ? <Link to={'/products/request'} className="btn btn-primary mt-2">Restock</Link> : '')} />
      <div className='card rounded-lg'>
        <div className="card-body">
          <div className="mb-4 border rounded-1">
            <table className="table text-nowrap mb-0 align-middle">
              <thead className="text-dark fs-4">
                <tr>
                  <th></th>
                  <th>No</th>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Varian</th>
                  {
                    isRoleCanAccess('owner') && <th>Aksi</th>
                  }
                </tr>
              </thead>
              <tbody>
                {
                  products.length
                    ? products.map((product, index) => (
                      <Fragment key={product.id}>
                        <tr>
                          <th onClick={() => setOpenProduct((old) => (old == product.id ? undefined : product.id))}>
                            <div style={{ rotate: openProduct == product.id ? '180deg' : '0deg', width: "15px", height: "15px", transitionProperty: 'all', transitionDuration: "500ms" }}>
                              <i className="ti ti-chevron-up"></i>
                            </div>
                          </th>
                          <th>{index + 1}</th>
                          <td>{product.name}</td>
                          <td><span className="badge bg-light-warning text-warning">{product?.category?.name ?? '-'}</span> </td>
                          <td><span className="badge bg-light-primary text-primary">{product.details.length} varian</span></td>
                          {
                            isRoleCanAccess('owner') &&
                            <td>
                              <div className="dropdown dropstart">
                                <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                  <i className="ti ti-dots-vertical fs-6"></i>
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>
                                  <li>
                                    <Link to={"/products/"+product.id} className="dropdown-item d-flex align-items-center gap-3"><i className="fs-4 ti ti-eye"></i> Detail</Link>
                                  </li>
                                  <li>
                                    <Link to={"/products/"+product.id+"/edit"} className="dropdown-item d-flex align-items-center gap-3"><i className="fs-4 ti ti-edit"></i> Ubah</Link>
                                  </li>
                                  <li>
                                    <button type="button" className="dropdown-item d-flex align-items-center gap-3" onClick={() => deleteProduct(product.id)}>
                                      <i className="fs-4 ti ti-trash"></i>Hapus
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          }
                        </tr>
                        <tr>
                          <td colSpan={isRoleCanAccess('owner') ? 6 : 5} style={{ padding: openProduct == product.id ? '1rem' : "0px" }}>
                            {
                              openProduct == product.id && <>
                                <table className="table border">
                                  <thead>
                                    <tr>
                                      <th>Material</th>
                                      <th>Stok</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      product.details.length ?
                                      product.details.map((detail:{[key:string]:any}, index:number) => (
                                        <tr key={index}>
                                          <td>{detail.material}</td>
                                          <td>{formatNum(detail.stock, true)} {detail.unit}</td>
                                        </tr>
                                      ))
                                      : <tr><th colSpan={isRoleCanAccess('outlet') ? 3 : 2} className="text-center text-muted">-- tidak ada varian --</th></tr>
                                    }
                                  </tbody>
                                </table>
                              </>
                            }
                          </td>
                        </tr>
                      </Fragment>
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