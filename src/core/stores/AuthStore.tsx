import { create } from "zustand"
import { getToken, removeToken } from "../helpers/TokenHandle"
import { useApiClient } from "../helpers/ApiClient"

type UserType = {[key:string]:any} | null

export type RoleList = "admin"|"owner"|"outlet"|"warehouse"
export type RoleType = RoleList[]

type AuthType = {
    isAuth: boolean,
    user: UserType,
    role: RoleType,
    
    setAuth: (current_auth: boolean) => void,
    setUser: (login_user: UserType) => void,
    setRole: (login_role: RoleType) => void,

    isRoleCanAccess: (role_name: RoleList|RoleType) => boolean
    updateUser: () => void,
    setUserDefault: () => void
}

const apiClient = useApiClient()

export const useAuthStore = create<AuthType>()((set, get) => ({
    isAuth: false,
    user: null,
    role: [],

    setAuth: (current_auth) => set(() => ({isAuth: current_auth})),
    setUser: (login_user) => set(() => ({user: login_user})),
    setRole: (login_role) => set(() => ({role: login_role})),

    isRoleCanAccess: (role_name) => {
        const {role} = get()
        if (typeof role_name === 'string') {
            return role.includes(role_name);
        } else {
            return role_name.some(r => role.includes(r));
        }
    },
    updateUser: () => {
        const token = getToken()
        if(token) {
            apiClient.get('/me')
                .then((res) => {
                    set(() => ({isAuth: true}))
                    set(() => ({user: res.data.data}))
                    set(() => ({role: [res.data.data.role]}))
                }).catch(() => {
                    get().setUserDefault()
                })
        } else {
            get().setUserDefault()
        }
    },
    setUserDefault: () => {
        set(() => ({isAuth: false}))
        set(() => ({user: null}))
        set(() => ({role: []}))
        removeToken()
    }
}))