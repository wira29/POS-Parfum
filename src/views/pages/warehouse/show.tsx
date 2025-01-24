import { useWarehouseStore } from "@/core/stores/WarehouseStore"
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
        </>
    )
}