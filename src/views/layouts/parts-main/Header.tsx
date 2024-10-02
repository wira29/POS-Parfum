// import { useApiClient } from '@/core/helpers/ApiClient'
// import { Toaster } from '@/core/helpers/BaseAlert'
import { useAuthStore } from '@/core/stores/AuthStore'
// import { useAuthStore } from '@/core/store/auth-store'
import { useLayoutStore } from '@/core/stores/LayoutStore'
import { Notification } from '@/views/components/Notification'
import { IoLogOut } from 'react-icons/io5'
// import { useNavigate } from 'react-router-dom'

export const Header = () => {
    const {user, role} = useAuthStore()
    const {sidebar, setSidebar} = useLayoutStore()
    // const apiClient = useApiClient()
    const storage = import.meta.env.VITE_STORAGE_URL

    const handleSidebar = () => {
        if(sidebar === 'full') setSidebar('mini-sidebar')
        else setSidebar('full')
    }

    // const navigate = useNavigate()

    // const handleLogout = () => {
    //     apiClient.post('/auth/logout')
    //         .then(res => {
    //             setUserDefault()
    //             Toaster('success', res.data.meta.message)
    //             navigate('/login')
    //         }).catch(err => {
    //             Toaster('error', err.response.data.meta.message)
    //         })
    // }

    return (
        <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button onClick={handleSidebar} className="nav-link sidebartoggler nav-icon-hover ms-n3" id="headerCollapse">
                            <i className="ti ti-menu-2"></i>
                        </button>
                    </li>
                </ul>
                <div className="d-block d-lg-none">
                    <img src="/images/logos/logo-full.png" className="dark-logo" width="180" alt="" />
                </div>
                <button className="navbar-toggler p-0 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="p-2">
                        <i className="ti ti-dots fs-7"></i>
                    </span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <div className="d-flex align-items-center justify-content-between">
                        <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                            <li className="nav-item dropdown">
                                <Notification />
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link pe-0" href="#" id="drop1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="d-flex align-items-center">
                                        <div className="user-profile-img">
                                            <img src={(user?.photo ? storage+user.photo : "/images/profile/user-1.jpg")} className="rounded-circle object-fit-cover" width="35" height="35" alt="" />
                                        </div>
                                    </div>
                                </a>
                                <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop1">
                                    <div className="profile-dropdown position-relative" data-simplebar>
                                        <div className="py-3 px-7 pb-0">
                                            <h5 className="mb-0 fs-5 fw-semibold">Profil Pengguna</h5>
                                        </div>
                                        <div className="d-flex align-items-center py-9 mx-7 border-bottom">
                                            <img src={(user?.photo ? storage+user.photo : "/images/profile/user-1.jpg")} className="rounded-circle object-fit-cover" width="80" height="80" alt="" />
                                            <div className="ms-3">
                                                <h5 className="mb-1 fs-3">{user?.name}</h5>
                                                <span className="mb-1 d-block text-dark">
                                                    { role.join(', ') }
                                                </span>
                                                <p className="mb-0 d-flex text-dark align-items-center gap-2">
                                                    <i className="ti ti-mail fs-4"></i> {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="message-body mx-7 border-bottom d-none">
                                            <a href="page-user-profile.html" className="py-8 mt-8 d-flex align-items-center">
                                                <span className="d-flex align-items-center justify-content-center bg-light rounded-1 p-6">
                                                    <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-account.svg" alt="" width="24" height="24" />
                                                </span>
                                                <div className="w-75 d-inline-block v-middle ps-3">
                                                    <h6 className="mb-1 bg-hover-primary fw-semibold"> My Profile </h6>
                                                    <span className="d-block text-dark">Account Settings</span>
                                                </div>
                                            </a>
                                            <a href="app-email.html" className="py-8 d-flex align-items-center">
                                                <span className="d-flex align-items-center justify-content-center bg-light rounded-1 p-6">
                                                    <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-inbox.svg" alt="" width="24" height="24" />
                                                </span>
                                                <div className="w-75 d-inline-block v-middle ps-3">
                                                    <h6 className="mb-1 bg-hover-primary fw-semibold">My Inbox</h6>
                                                    <span className="d-block text-dark">Messages & Emails</span>
                                                </div>
                                            </a>
                                            <a href="app-notes.html" className="py-8 d-flex align-items-center">
                                                <span className="d-flex align-items-center justify-content-center bg-light rounded-1 p-6">
                                                    <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-tasks.svg" alt="" width="24" height="24" />
                                                </span>
                                                <div className="w-75 d-inline-block v-middle ps-3">
                                                    <h6 className="mb-1 bg-hover-primary fw-semibold">My Task</h6>
                                                    <span className="d-block text-dark">To-do and Daily Tasks</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div className="message-body mx-7 mt-2">
                                            <button className="py-8 d-flex align-items-center justify-content-center gap-3 w-100 btn btn-light text-muted">
                                                <IoLogOut width={24} />
                                                <h6 className="fw-semibold m-0 text-muted">Logout</h6>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}