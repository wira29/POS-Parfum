import { IoStorefront, IoCube } from 'react-icons/io5'
import { FaWarehouse } from 'react-icons/fa6'

export const ScoreCard = () => {
    return (
        <div className="flex gap-6 items-center justify-stretch">
            <ScoreCardItem title='Jumlah Produk' value={12} color='danger' icon={IoCube} />
            <ScoreCardItem title='Jumlah Outlet' value={12} color='warning' icon={IoStorefront} />
            <ScoreCardItem title='Jumlah Gudang' value={12} color='success' icon={FaWarehouse} />
        </div>
    )
}

import { useEffect, useState } from 'react'
import { IconType } from 'react-icons'

const ScoreCardItem = ({title, value, color, icon: Icon}: {title:string, value:number, color:string, icon: IconType}) => {
    const [leftTipClass, setLeftTipClass] = useState('')
    const [iconClass, setIconClass] = useState('')
    
    const defaultLeftTipClass = "absolute min-h-16 w-2 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full "
    const defaultIconClass = "absolute hidden lg:block -translate-x-1/2 -translate-y-1/2 text-5xl top-1/2 right-0 "

    useEffect(() => {
        switch(color) {
            case 'success':
                setLeftTipClass(defaultLeftTipClass+'bg-success-500')
                setIconClass(defaultIconClass+'text-success-500')
                break;
            case 'warning':
                setLeftTipClass(defaultLeftTipClass+'bg-warning-500')
                setIconClass(defaultIconClass+'text-warning-500')
                break;
            case 'info':
                setLeftTipClass(defaultLeftTipClass+'bg-info-500')
                setIconClass(defaultIconClass+'text-info-500')
                break;
            case 'danger':
                setLeftTipClass(defaultLeftTipClass+'bg-danger-500')
                setIconClass(defaultIconClass+'text-danger-500')
                break;
            default:
                setLeftTipClass(defaultLeftTipClass+'bg-primary-500')
                setIconClass(defaultIconClass+'text-primary-500')
                break;
        }
    }, [color])

    return (
        <div className='bg-white shadow-md relative w-full rounded-lg p-4 min-h-30 overflow-hidden'>
            <div className='font-semibold'>{title}</div>
            <div className='text-3xl font-bold text-subtitle'>{value}</div>
            <div className={leftTipClass}></div>
            <div className={iconClass}><Icon /></div>
        </div>
    )
}