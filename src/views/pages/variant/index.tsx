import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddModal, { BtnAddModal } from "./widgets/AddModal";
import { useProductVariantStore } from "@/core/stores/ProductVariantStore";
import { BtnEditModal } from "./widgets/EditModal";
import { useEffect } from "react";

export const VariantIndex = () => {
  const {variants, pagination, firstGet, deleteVariant, setCurrentVariant, setPage} = useProductVariantStore()

  useEffect(() => {
    firstGet()
  }, [])

  return (
    <div>
      <Breadcrumb title="Varian" desc="List varian untuk produk pada toko anda" button={<BtnAddModal />} />
      <AddModal />
      <div className='card rounded-lg'>
        <div className="card-body">
          <div className="mb-4 border rounded-1 row">
            <table className="table text-nowrap mb-0 align-middle">
              <thead className="text-dark fs-4">
                <tr>
                  <th>No</th>
                  <th>Variant</th>
                  <th>Produk</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  variants.length
                  ? variants.map((variant, index) => (
                    <tr key={index}>
                      <th>{index+1}</th>
                      <td>{variant.name}</td>
                      <td><span className="badge bg-light-primary text-primary">20 produk</span></td>
                      <td>
                      <div className="dropdown dropstart">
                          <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical fs-6"></i>
                          </a>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>

                            <li>
                              <BtnEditModal onClick={() => setCurrentVariant(variant)} />
                            </li>
                            <li>
                              <button type="button" className="dropdown-item d-flex align-items-center gap-3" onClick={() => deleteVariant(variant)}>
                                <i className="fs-4 ti ti-trash"></i>Hapus
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                  : <tr>
                    <th colSpan={4} className="text-center text-muted">-- belum ada varian --</th>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <Pagination paginationData={pagination} updatePage={setPage} />
        </div>
      </div>
    </div>
  );
}