import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddModal, { BtnAddModal } from "./widgets/AddModal";
import WarehouseCard from "./widgets/WarehouseCard";
import { useWarehouseStore } from "@/core/stores/WarehouseStore";
import { useEffect } from "react";
import { SearchInput } from "@/views/components/SearchInput";
import { NoData } from "@/views/components/NoData";
import EditModal from "./widgets/EditModal";


export const WarehouseIndex = () => {
    const {warehouses, pagination, setSearch, setPage, firstGet} = useWarehouseStore()

    useEffect(() => {
        firstGet()
    }, [])

    return (
        <div>
            <AddModal />
            <EditModal />
            <Breadcrumb title="Gudang" desc="List gudang yang anda miliki." button={<BtnAddModal />}/>
            <div className="mb-2 row">
                <div className="col-12 col-md-4">
                    <SearchInput setSearch={setSearch}/>
                </div>
            </div>

            <div className="row">
                {
                    warehouses.length
                    ?  <>
                        {
                            warehouses.map((warehouse:any, index:number) => (
                                <WarehouseCard key={index} warehouse={warehouse} />
                            ))
                        }
                        <Pagination paginationData={pagination} updatePage={setPage} /> 
                    </>
                    : <div className="card">
                        <div className="card-body">
                            <NoData img_size={300} />
                        </div>
                    </div>
                }
            </div>
            
        </div>
    )
}