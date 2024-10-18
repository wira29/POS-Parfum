import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/core/stores/AuthStore"
import { useApiClient } from "../helpers/ApiClient"
import { getToken } from "../helpers/TokenHandle"

export const IsAuth = ({guest = false, redirectOnError}: {guest: boolean, redirectOnError: string}) => {
    const {isAuth, updateUser} = useAuthStore()
    const navigate = useNavigate()
    const apiClient = useApiClient()

    const handleNavigator = () => {
        if((!guest && !isAuth) || (guest && isAuth)) {
            navigate(redirectOnError)
        }
    }

    useEffect(() => {
        const token = getToken()
        if(token && !isAuth) {
            updateUser()
            apiClient.get('/me').catch(() => {
                handleNavigator()
            })
        } else {
            handleNavigator()
        }
    }, [guest, isAuth])

    return (
        <>
            {!((!guest && !isAuth) || (guest && isAuth)) && <Outlet />}
        </>
    )
}