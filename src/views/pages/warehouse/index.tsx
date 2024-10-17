import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddModal from "./widgets/AddModal";
import WarehouseCard from "./widgets/WarehouseCard";


export const WarehouseIndex = () => {
    return (
        <div>
            <AddModal />
            <Breadcrumb title="Gudang" desc="List gudang yang anda miliki." button={<button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#bs-example-modal-md">Tambah Gudang</button>}/>

            <div className="row">
                <WarehouseCard />
                <WarehouseCard />
                <WarehouseCard />
                <WarehouseCard />
                <WarehouseCard />
                <WarehouseCard />
            </div>
            <Pagination /> 
            
        </div>
    )
}