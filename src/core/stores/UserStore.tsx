import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"


type UserStoreType = {
    isLoading: boolean,
    users: any[],
    pagination: {},
    failure: string | null,

    setLoading: (current_loading: boolean) => void,
    createUser: (form: any) => void,
    getUsers: () => void,
}

const apiClient = useApiClient()

export const useUserStore = create<UserStoreType>()((set, get) => ({
    isLoading: false,
    users: [],
    pagination: {},
    failure: null,

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    createUser: (form) => {
        set(() => ({isLoading: true, failure: null}))
        apiClient.post('/users', form.current).then((res) => {
            
            get().getUsers()
        }).catch((err) => {
            set(() => ({isLoading: false, failure: "Gagal menambahkan user"}))
            console.log(err)
        })
    },
    getUsers: () => {
        set(() => ({isLoading: true}))
        apiClient.get('/users').then((res) => {
            set(() => ({isLoading: false}))
            var users = res.data.data.data
            delete res.data.data.data
            var pagination = res.data.data

            set(() => ({
                isLoading: false, 
                users: users,
                pagination: pagination
            }))
        }).catch((err) => {
            set(() => ({isLoading: false, failure: "Gagal mendapatkan user"}))
            console.log(err)
        })
    }
}))