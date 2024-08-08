import { Outlet, Link } from "react-router-dom"

export const RestockIndex = () => {
    return (
        <div>
            <div className="flex">
                <Link to="">Restock</Link>
                <Link to="">Riwayat</Link>
            </div>
            <Outlet/>
        </div>
    )
}