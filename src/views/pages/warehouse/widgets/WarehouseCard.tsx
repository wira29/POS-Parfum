import { useWarehouseStore } from "@/core/stores/WarehouseStore";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BtnEditModal } from "./EditModal";
import { Link } from "react-router-dom";

const WarehouseCard = ({warehouse}:{warehouse:{[key:string]:any}}) => {
    const { deleteWarehouse, setCurrentWarehouse } = useWarehouseStore()

    return (
        <div className="col-lg-3 col-md-6">
            <div className="card">
                <img className="card-img-top img-responsive" src="/assets/images/blog/blog-img1.jpg" alt="Card image cap" />
                <div className="card-body"> 
                <h4 className="card-title">{warehouse.name}</h4>
                <p className="text-dark mb-1">{warehouse.telp}</p>
                <p className="card-text">
                    {warehouse.address}
                </p>
                <p className="text-dark mb-1">Total Produk</p>
                <h4 className="card-title mb-3">134</h4>
                <div className="d-flex flex-row">
                    <Link to={`/warehouses/${warehouse.id}`} className="btn btn-primary flex-grow-1 me-1">Detail</Link>
                    <div className="dropdown dropstart">
                        <a href="" className="btn btn-warning" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <HiOutlineDotsVertical />
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ "zIndex": 100, "position": "absolute", "top": "100%", "left": "0", "transform": "translateY(-100%)" }}>
                        <li>
                            <BtnEditModal onClick={() => setCurrentWarehouse(warehouse)} />
                        </li>
                        <li>
                            <button type="button" className="dropdown-item d-flex align-items-center gap-3" onClick={() => deleteWarehouse(warehouse.id)}>
                            <i className="fs-4 ti ti-trash"></i>Hapus
                            </button>
                        </li>
                        </ul>
                    </div>    
                </div>
                </div>
            </div>
        </div>
    );
}

export default WarehouseCard;