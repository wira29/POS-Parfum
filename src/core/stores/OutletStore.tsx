import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"


type OutletStoreType = {
    isLoading: boolean,
    outlets: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,

    setLoading: (current_loading: boolean) => void,
    createOutlet: (form: any) => Promise<void>,
    getOutlets: () => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void
}

const apiClient = useApiClient()

export const useOutletStore = create<OutletStoreType>()((set, get) => ({
    isLoading: false,
    outlets: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getOutlets()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getOutlets()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getOutlets()
    },
    createOutlet: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.post('/outlets', form.current)
            get().getOutlets()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    getOutlets: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/outlets?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            set(() => ({isLoading: false}))
            var outlets = res.data.data
            var pagination = res.data.pagination

            console.log({data: res.data})

            set(() => ({
                isLoading: false, 
                outlets,
                pagination: pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan user",
                outlets: []
            }))
        })
    },
    firstGet: () => {
        set(() => ({
            page: 1,
            per_page: 10,
            search: ''
        }))

        get().getOutlets()
    }
}))