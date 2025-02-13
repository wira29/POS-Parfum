import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddModal, { BtnAddModal } from "./widgets/AddModal";
import { useProductCategoryStore } from "@/core/stores/ProductCategoryStore";
import { useEffect } from "react";
import EditModal, { BtnEditModal } from "./widgets/EditModal";

export const CategoryIndex = () => {

  const { categories, pagination, firstGet, setPage, deleteCategory, setCurrentCategory } = useProductCategoryStore()

  useEffect(() => {
    firstGet()
  }, [])

  return (
    <div>
      <Breadcrumb title="Kategori" desc="List kategori yang ada pada toko anda" button={<BtnAddModal />} />
      <AddModal />
      <EditModal />
      <div className='card rounded-lg'>
        <div className="card-body">
          <div className="mb-4 border rounded-1 row">
            <table className="table text-nowrap mb-0 align-middle">
              <thead className="text-dark fs-4">
                <tr>
                  <th>No</th>
                  <th>Kategori</th>
                  <th>Jumlah Produk</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  categories.map((category, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{category.name}</td>
                      <td><span className="badge text-primary bg-light-primary">{category.products_count} produk</span></td>
                      <td>
                        <div className="dropdown dropstart">
                          <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="ti ti-dots-vertical fs-6"></i>
                          </a>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>

                            <li>
                              <BtnEditModal onClick={() => setCurrentCategory(category)} />
                            </li>
                            <li>
                              <button type="button" className="dropdown-item d-flex align-items-center gap-3" onClick={() => deleteCategory(category.id)}>
                                <i className="fs-4 ti ti-trash"></i>Hapus
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
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