import { useUserStore } from "@/core/stores/UserStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function UserDetail() {
    const { id } = useParams()
    const { getUser, user } = useUserStore()

    useEffect(() => {
        getUser(id as string)
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