// import { useApiClient } from "@/core/helpers/ApiClient"
import { formatNum } from "@/core/helpers/FormatNumber"
import moment from "moment"
import { useEffect, useState } from "react"
import { IoNotificationsCircle } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

export const Notification = () => {
    // const apiClient = useApiClient()
    const navigate = useNavigate()

    const storage = import.meta.env.VITE_STORAGE_URL

    const [notifications, setNotifications] = useState<{[key:string]:any}[]>([])
    const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0)

    // const handleClickNotification = (notification: any) => {
    //     apiClient.get('/notifications/mark-as-read/'+notification.id)
    //     getNotification()
    //     navigate('/transactions/details/'+notification.notification.transaction_id)
    // }
    // const seeAllNotifications = () => {
    //     apiClient.get('/notifications/mark-as-read/10').then(() => {
    //         getNotification()
    //     })
    // }

    // const getNotification = () => {
    //     apiClient.get("notifications/take/10").then(res => {
    //         setNotifications(res.data.data)
    //     })
    //     apiClient.get("notifications/count").then(res => {
    //         setUnreadNotifCount(res.data.data)
    //     })
    // }

    // useEffect(() => {
    //     getNotification()
    // }, [])
    return (
        <>
            <a className="nav-link nav-icon-hover" href="#" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="ti ti-bell-ringing"></i>
                <div className={"notification "+(unreadNotifCount ? "bg-primary rounded-circle" : '')}></div>
            </a>
            <div className="pb-0 dropdown-menu dropdown-menu-lg content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2" style={{width: "500px"}}>
                <div className="d-flex align-items-center justify-content-between py-3 px-7">
                    <h5 className="mb-0 fs-5 fw-semibold">Notifikasi</h5>
                    <span className="badge bg-primary rounded-4 px-3 py-1 lh-sm">{formatNum(unreadNotifCount, true)} belum dibaca</span>
                </div>
                <div className="message-body">
                    {
                        notifications.map((notif, index) => (
                            <div className={(!notif.read_at ? "bg-light-primary" : "") +" px-7 py-6"} key={index} style={{borderBottom: "1px solid rgba(0,0,0,.1)", borderTop: "1px solid rgba(0,0,0,.1)"}}>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <IoNotificationsCircle className="text-dark fs-7"/>
                                        <div className="text-dark fs-4">{notif.notification?.transaction_status || 'Aktivitas'}</div>
                                    </div>
                                    <div>{moment(notif.created_at).format("DD MMM YYYY")}</div>
                                </div>
                                <div className="row align-items-center mt-2">
                                    <div className="col-9">
                                        <h5 className="m-0">Lorem ipsum dolor sit amet consectetur.</h5>
                                        <p className="text-muted mb-0 text-clamp-2">{notif.notification?.message}</p>
                                    </div>
                                    <div className="col-3 d-flex justify-content-end">
                                        <img src={notif.notification?.shop_photo ? storage+notif.notification.shop_photo : "/public/images/blog/blog-img1.jpg"} alt="notification image" className="object-fit-cover rounded" style={{width: "75px", height: '75px'}} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="py-6 px-7 mb-1">
                    <button type="button" className="btn btn-outline-primary w-100"> Tandai Telah Dibaca </button>
                </div>
            </div>
        </>
    )
}