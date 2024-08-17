import { Outlet } from 'react-router-dom'
import { Sidebar } from './parts-main/Sidebar'
import { Header } from './parts-main/Header'
import 'flowbite/dist/flowbite.min.js'

export const MainLayout = () => {
    return (
        <>
        <Sidebar />
            <div className="flex w-full items-stretch ps-0 md:ps-64">
                <div className="flex-1">
                    <Header/>
                    <div className='p-6'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}