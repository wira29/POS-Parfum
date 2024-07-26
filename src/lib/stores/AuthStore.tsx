import {create} from "zustand"

type UserType = {
    email: string
} | null

type RoleList = "admin"|"owner"|"outlet"
type RoleType = RoleList[]

type AuthType = {
    isAuth: boolean,
    user: UserType,
    role: RoleType,
    
    setAuth: (current_auth: boolean) => void,
    setUser: (login_user: UserType) => void,
    setRole: (login_role: RoleType) => void,

    isRoleCanAccess: (role_name: RoleList|RoleType) => boolean
}


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
    }
}))