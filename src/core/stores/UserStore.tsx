import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { TPaginationData } from "@/views/components/Pagination"
import { Toaster } from "../helpers/BaseAlert"


type UserStoreType = {
    isLoading: boolean,
    users: any[],
    currentUser?: {[key:string]:any},
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,
    role: string,
    outlet: string,

    setLoading: (current_loading: boolean) => void,
    setCurrentUser: (current_user: {[key:string]:any}) => void,
    createUser: (form: any) => Promise<void>,
    updateUser: (id:string, form: any) => Promise<void>,
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
    currentUser: undefined,
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',
    role: '',
    outlet: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setCurrentUser: (current_user) => set(() => ({currentUser: current_user})),
    createUser: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const res:any = await apiClient.post('/users', form.current, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            Toaster('success', res.data.message)
            get().getUsers()
            set(() => ({isLoading: false, isFailure: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    updateUser: async (id, form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const res:any = await apiClient.post('/users/'+id, form.current, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            Toaster('success', res.data.message)
            get().getUsers()
            set(() => ({isLoading: false, isFailure: false}))
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