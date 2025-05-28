import { useWarehouseStore } from "@/core/stores/WarehouseStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function WarehouseDetail() {
    const { id } = useParams()
    const { getWarehouse, warehouse } = useWarehouseStore()

    useEffect(() => {
        getWarehouse(id as string)
    }, [id])

    return (
        <div className="p-6 space-y-6">
              <Breadcrumb 
                title="Detail Retail" 
                desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus."
              />
        </div>
    )
}