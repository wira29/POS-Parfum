import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { getToken, removeToken } from "../helpers/TokenHandle"

type UserType = { [key: string]: any } | null

export type RoleList = "admin" | "owner" | "outlet" | "warehouse" | "cashier" | "employee"
export type RoleType = RoleList[]

type AuthType = {
    isLoading: boolean,
    isAuth: boolean,
    user: UserType,
    role: RoleType,
    hasRequestedMe: boolean,

    setLoading: (current_loading: boolean) => void,
    setAuth: (current_auth: boolean) => void,
    setUser: (login_user: UserType) => void,
    setRole: (login_role: RoleType) => void,

    isRoleCanAccess: (role_name: RoleList | RoleType) => boolean,
    updateUser: () => void,
    setUserDefault: () => void,
}

const apiClient = useApiClient()

export const useAuthStore = create<AuthType>()((set, get) => ({
    isLoading: false,
    isAuth: false,
    user: null,
    role: [],
    hasRequestedMe: false,

    setLoading: (current_loading) => set(() => ({ isLoading: current_loading })),
    setAuth: (current_auth) => set(() => ({ isAuth: current_auth })),
    setUser: (login_user) => set(() => ({ user: login_user })),
    setRole: (login_role) => set(() => ({ role: login_role })),

    isRoleCanAccess: (role_name) => {
        const { role } = get()
        if (typeof role_name === 'string') {
            return role.includes(role_name)
        } else {
            return role_name.some(r => role.includes(r))
        }
    },

    updateUser: () => {
        const { isAuth, user, isLoading, hasRequestedMe } = get()
        const token = getToken()

        if (isLoading || (isAuth && user) || hasRequestedMe) return

        if (token) {
            set(() => ({ isLoading: true, hasRequestedMe: true }))
            apiClient.get('/me')
                .then((res) => {
                    const data = res.data.data

                    const roleFromStrings = Array.isArray(data.role) ? data.role : []
                    const roleFromObjects =
                        Array.isArray(data.roles) && typeof data.roles[0] === "object"
                            ? data.roles.map((r: any) => r.name)
                            : []

                    const uniqueRoles = [...new Set([...roleFromStrings, ...roleFromObjects])]

                    set(() => ({
                        isAuth: true,
                        user: data,
                        role: uniqueRoles,
                    }))
                })
                .catch(() => {
                    get().setUserDefault()
                })
                .finally(() => {
                    set(() => ({ isLoading: false }))
                })
        } else {
            get().setUserDefault()
        }
    },

    setUserDefault: () => {
        set(() => ({
            isAuth: false,
            user: null,
            role: [],
            hasRequestedMe: false,
        }))
        removeToken()
    }
}))
