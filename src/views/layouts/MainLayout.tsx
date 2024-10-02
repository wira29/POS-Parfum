import { Outlet } from 'react-router-dom'
import { Sidebar } from './parts-main/Sidebar'
import { Header } from './parts-main/Header'
import { useEffect, useState } from 'react'
import { useLayoutStore } from '@/core/stores/LayoutStore'

export const MainLayout = () => {

    const [isLoaded, setIsLoaded] = useState(false)
    const {sidebar, setSidebar} = useLayoutStore()

    useEffect(() => {
        const handleLoad = () => {
            setIsLoaded(true)
        }

        if(document.readyState === 'complete') handleLoad()
        else window.addEventListener('load', handleLoad)

        return () => {
            window.removeEventListener('load', handleLoad)
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth <= 990) setSidebar('mini-sidebar')
            else setSidebar('full')
        };
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            { 
                !isLoaded &&
                <div className="preloader">
                    <img src="/images/logos/logo-full-1.png" alt="loader" className="lds-ripple img-fluid" />
                </div>
            }
            <div className="page-wrapper" id="main-wrapper" data-theme="blue_theme" data-layout="vertical" data-sidebartype={sidebar} data-sidebar-position="fixed" data-header-position="fixed">
                <Sidebar />
                <div className="body-wrapper">
                    <Header />
                    <div className="container-fluid" style={{maxWidth: "100%"}}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}