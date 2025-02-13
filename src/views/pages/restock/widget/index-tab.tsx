import { Link } from "react-router-dom"

export const IndexTab = () => {
    return (
        <div className="flex">
            <Link to="/restocking">Restock</Link>
            <Link to="/restocking/history">Riwayat</Link>
        </div>
    )
}