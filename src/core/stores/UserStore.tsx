import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { TPaginationData } from "@/views/components/Pagination"
import { Toaster } from "../helpers/BaseAlert"


type UserStoreType = {
    isLoading: boolean,
    users: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,
    role: string,
    outlet: string,

    setLoading: (current_loading: boolean) => void,
    createUser: (form: any) => Promise<void>,
    getUsers: () => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    setRole: (role:string) => void,
    setOutlet: (outlet_id:string) => void,
    firstGet: () => void,
}

const apiClient = useApiClient()

export const useUserStore = create<UserStoreType>()((set, get) => ({
    isLoading: false,
    users: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',
    role: '',
    outlet: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    createUser: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const res:any = await apiClient.post('/users', form.current)
            Toaster('success', res.data.message)
            get().getUsers()
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    getUsers: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/users?page=${get().page}&per_page=${get().per_page}&search=${get().search}&outlet_id=${get().outlet}&role=${get().role}`).then(res => {
            set(() => ({isLoading: false}))
            var users = res.data.data
            var pagination = res.data.pagination

            console.log({users: users})

            set(() => ({
                isLoading: false, 
                users: users,
                pagination: pagination,
                isFailure: false
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                isFailure: true,
                users: []
            }))
        })
    },
    setPage: (page) => {
        set(() => ({page}))
        get().getUsers()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getUsers()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getUsers()
    },
    setRole:(role) => {
        set(() => ({role}))
        get().getUsers()
    },
    setOutlet:(outlet) => {
        set(() => ({outlet}))
        get().getUsers()
    },
    firstGet: () => {
        set(() => ({
            page: 1,
            per_page: 10,
            search: '',
            role: '',
            outlet: ''
        }))
        get().getUsers()
    },
}))