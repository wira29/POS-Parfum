import { Link } from 'react-router-dom'

export const Home  = () => {
    return (
        <>
        <div>Halaman Home</div>
        <Link to="/dashboard"> ke dashboard</Link>
        </>
    )
}