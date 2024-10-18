import { gsap } from 'gsap'
import { FaWarehouse } from 'react-icons/fa6'
import { IoCube, IoStorefront } from 'react-icons/io5'

export const ScoreCard = () => {
    return (
        <div className="row justify-content-stretch">
            <ScoreCardItem title='Jumlah Produk' value={100} color='danger' icon={IoCube} />
            <ScoreCardItem title='Jumlah Outlet' value={12} color='warning' icon={IoStorefront} />
            <ScoreCardItem title='Jumlah Gudang' value={2} color='success' icon={FaWarehouse} />
        </div>
    )
}

import { useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'

const ScoreCardItem = ({title, value, color, icon: Icon}: {title:string, value:number, color:string, icon: IconType}) => {
    const [leftTipClass, setLeftTipClass] = useState('')
    const [iconClass, setIconClass] = useState('')
    const counterRef = useRef(null)
    const [count, setCount] = useState(0);

    useEffect(() => {
        switch(color) {
            case 'success':
                setLeftTipClass('bg-success')
                setIconClass('text-success')
                break;
            case 'warning':
                setLeftTipClass('bg-warning')
                setIconClass('text-warning')
                break;
            case 'info':
                setLeftTipClass('bg-info')
                setIconClass('text-info')
                break;
            case 'danger':
                setLeftTipClass('bg-danger')
                setIconClass('text-danger')
                break;
            default:
                setLeftTipClass('bg-primary')
                setIconClass('text-primary')
                break;
        }
    }, [color])

    useEffect(() => {
        gsap.to(counterRef.current, {
            duration: 0.8, // durasi total untuk menghitung dari 1 sampai 12
            repeat: 0,
            onUpdate: function() {
                const progress = this.progress();
                const currentValue = Math.ceil(progress * value);
                setCount(currentValue);
            }
        });
    }, []);

    return (
        <div className="col-12 col-md-4">
            <div className="card shadow">
                <div className="card-body p-2 position-relative w-full rounded-lg p-4 overflow-hidden">
                    <div className='fw-semibold'>{title}</div>
                    <div className='fs-10 fw-bolder'>{count}</div>
                    <div 
                        className={"position-absolute min-h-16 w-2 rounded "+leftTipClass}
                        style={{
                            minHeight: "100px",
                            width: '10px',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    ></div>
                    <div 
                        className={"position-absolute hidden lg:block fs-13 "+iconClass}
                        style={{
                            right: 0,
                            top: "50%",
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <Icon />
                    </div>
                </div>
            </div>
        </div>
    )
}