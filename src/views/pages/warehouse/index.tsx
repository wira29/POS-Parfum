import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import WarehouseCard from "./widgets/WarehouseCard";


export const WarehouseIndex = () => {
    return (
        <div>
            <Breadcrumb title="Gudang" desc="List gudang yang anda miliki." />

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