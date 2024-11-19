import { useDiscountStore } from "@/core/stores/DiscountStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect } from "react"
import AddDiscountModal, { BtnAddDiscountModal } from "./widgets/AddDiscountModal"
import DetailDiscountModal, { BtnDetailDiscountModal } from "./widgets/DetailDicountModal"
import { Pagination } from "@/views/components/Pagination"
import EditDiscountModal, { BtnEditDiscountModal } from "./widgets/EditDiscountModal"

export default function DiscountIndex() {
    const { firstGet, discounts, deleteDiscount, pagination, setPage, setCurrentDiscount } = useDiscountStore()

    useEffect(() => {
        firstGet()
    }, [])

    useEffect(() => {
        console.log(discounts)
    }, [discounts])

    return (
        <div>
            <AddDiscountModal />
            <DetailDiscountModal />
            <EditDiscountModal />
            <Breadcrumb title="Diskon" desc="Daftar diskon pada toko anda" button={<BtnAddDiscountModal />} />
            <div className="card rounded-lg">
                <div className="card-body">
                    <table className="table text-nowrap mb-0 align-middle">
                        <thead className="text-dark fs-4">
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Diskon</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                discounts.length
                                    ? discounts.map((discount, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{discount.name}</td>
                                            <td>{discount.discount}%</td>
                                            <td>{discount.active ? <span className="badge bg-primary">Aktif</span> : <span className="badge bg-warning">Tidak Aktif</span>}</td>
                                            <td>
                                                <div className="dropdown dropstart">
                                                    <a href="" className="text-muted" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="ti ti-dots-vertical fs-6"></i>
                                                    </a>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>
                                                        <li>
                                                            <BtnDetailDiscountModal onClick={() => setCurrentDiscount(discount)} />
                                                        </li>
                                                        <li>
                                                            <BtnEditDiscountModal onClick={() => setCurrentDiscount(discount)} />
                                                        </li>
                                                        <li>
                                                            <button type="button" className="dropdown-item d-flex align-items-center gap-3" onClick={() => deleteDiscount(discount.id)}>
                                                                <i className="fs-4 ti ti-trash"></i>Hapus
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    : <tr>
                                        <th colSpan={5} className="text-center">-- Belum Ada Data Diskon --</th>
                                    </tr>
                            }
                        </tbody>
                    </table>
                    <div className="mt-3">
                        <Pagination paginationData={pagination} updatePage={setPage} />
                    </div>
                </div>
            </div>
        </div>
    )
}