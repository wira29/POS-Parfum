import 'flowbite/dist/flowbite.min.js'
import { Outlet } from 'react-router-dom'
import { Header } from './parts-main/Header'
import { Sidebar } from './parts-main/Sidebar'

export const MainLayout = () => {
    return (
        <>
        <Sidebar />
            <div className="flex w-full items-stretch ps-0 md:ps-64 bg-background">
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