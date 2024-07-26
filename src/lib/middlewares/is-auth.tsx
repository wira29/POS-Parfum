import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/stores/AuthStore"

export const IsAuth = ({guest = false, redirectOnError}: {guest: boolean, redirectOnError: string}) => {
    const {isAuth} = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if((!guest && !isAuth) || (guest && isAuth)) navigate(redirectOnError)
    })

    return (
        <>
            {!((!guest && !isAuth) || (guest && isAuth)) && <Outlet />}
        </>
    )
}