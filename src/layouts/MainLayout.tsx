import { Outlet } from 'react-router-dom'
import { Sidebar } from './parts-main/Sidebar'
import { Header } from './parts-main/Header'
import 'flowbite/dist/flowbite.min.js'

export const MainLayout = () => {
    return (
        <div className="flex w-full items-stretch">
            <Sidebar />
            <div className="flex-1">
                <Header/>
                <div className='p-6'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}