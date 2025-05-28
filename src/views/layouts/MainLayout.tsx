import { useLayoutStore } from '@/core/stores/LayoutStore'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './parts-main/Header'
import { Sidebar } from './parts-main/Sidebar'

export const MainLayout = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { sidebar, setSidebar } = useLayoutStore()

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true)

    if (document.readyState === 'complete') handleLoad()
    else window.addEventListener('load', handleLoad)

    return () => window.removeEventListener('load', handleLoad)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 990) setSidebar('mini-sidebar')
      else setSidebar('full')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebar(sidebar === 'full' ? 'mini-sidebar' : 'full')
  }

  if (!isLoaded) return null

  return (
    <div className="flex">
      <Sidebar sidebar={sidebar} />
      <div
        className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${
          sidebar === 'full' ? 'ml-0' : 'ml-2'
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} sidebar={sidebar} />
        <main
          className={`pt-16 transition-all duration-300 ${
            sidebar === 'full' ? 'pl-70' : 'pl-23'
          } p-6`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}