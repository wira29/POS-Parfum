import { ReactNode } from "react"
import { useAuthStore } from "../stores/AuthStore"


export const IsRole = ({role, children} : {role: string[], children?: ReactNode}) => {

    const {role: userRoles} = useAuthStore()

    const hasRole = () => {
        return userRoles.some(r => role.includes(r))
    }

    return hasRole() && <>{children}</>
}