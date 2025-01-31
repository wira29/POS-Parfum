import { useWarehouseStore } from "@/core/stores/WarehouseStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function WarehouseShow() {
    
    const {id} = useParams()
    const {getWarehouse, warehouse} = useWarehouseStore()

    useEffect(() => {
        getWarehouse(id as string)
        console.log({warehouse})
    }, [id])

    return (
        <>
            <Breadcrumb title="Gudang" desc={"Detail gudang "+warehouse?.name} />
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <img src="https://placehold.co/400x400" alt="" className="rounded w-100" />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="mb-3">
                                <h2 className="fw-bolder mb-4">{warehouse?.name}</h2>
                                <p className="mb-2">{warehouse?.telp}</p>
                                <p className="mb-2">{warehouse?.address}</p>
                                <div className="mt-4">
                                    <div>Pekerja : </div>
                                    <div>
                                        {
                                            warehouse?.users?.length
                                            ? warehouse?.users?.map((user:{[key:string]:any}) => (
                                                <span key={user.id} className="badge bg-primary me-1">{user.name}</span>
                                            ))
                                            : "-"
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}