import { useLayoutStore } from '@/lib/stores/LayoutStore'
import { useEffect } from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Dropdown } from 'flowbite-react'

export const Header = () => {
    const {setNavOpen} = useLayoutStore()

    return (
        <nav className="grid content-center w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-[70px]">
            <div className="px-3 lg:px-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <button onClick={setNavOpen} type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <BsFilterLeft className='text-2xl'/>
                        </button>
                        <Link to="/" className="flex ms-2 md:me-24 sm:hidden">
                            <img src="/src/assets/logo.png" className="h-8 me-3" alt="FlowBite Logo" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Pos Parfum</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3">
                            <Dropdown label=""  renderTrigger={() => (
                                <button type="button" className="flex text-sm gap-4 items-center">
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            Neil Sims
                                        </p>
                                        <p className="text-sm text-gray-900 truncate dark:text-gray-300" role="none">
                                            neil.sims@flowbite.com
                                        </p>
                                    </div>
                                    <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                                </button>
                            )}>
                                <Dropdown.Item>Logout</Dropdown.Item>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}