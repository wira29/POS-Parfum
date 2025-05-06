import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"

type ProductRequestStockStoreType = {
    isLoading: boolean,
    product_requests: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,
    current_product_request?: {[key:string]:any},

    setLoading: (current_loading: boolean) => void,
    createProductRequest: (form: any) => Promise<void>,
    updateProductRequest: (form: any, id:string) => Promise<void>,
    getProductRequests: () => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void,
    setCurrentProductRequest: (product_request: any) => void,
}

const apiClient = useApiClient()

export const useProductRequestStockStore = create<ProductRequestStockStoreType>()((set, get) => ({
    isLoading: false,
    product_requests: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',
    current_product_request: undefined,

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getProductRequests()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getProductRequests()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getProductRequests()
    },
    createProductRequest: async (data) => {
        set(() => ({isLoading: true, isFailure: false}))
        try {
            const response = await apiClient.post('/stock-request', data)
            set(() => ({isFailure: false}))
            Toaster('success', response.data.message)
        } catch (err:any) {
            set(() => ({isFailure: true}))
            Toaster('error', err.response.data.message)
        } finally {
            set(() => ({isLoading: false}))
        }
    },
    updateProductRequest: async (data, id) => {
        set(() => ({isLoading: true, isFailure: false}))
        try {
            const response = await apiClient.post('/stock-request/'+id, {...data, _method: 'PUT'})
            set(() => ({isFailure: false}))
            Toaster('success', response.data.message)
            get().getProductRequests()
        } catch (err:any) {
            set(() => ({isFailure: true}))
            Toaster('error', err.response.data.message)
        } finally {
            set(() => ({isLoading: false}))
        }
    },
    getProductRequests: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/stock-request?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            set(() => ({isLoading: false}))
            var product_reqs = res.data.data
            var pagination = res.data.pagination

            set(() => ({
                isLoading: false, 
                product_requests: product_reqs,
                pagination: pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan request stock",
                products: []
            }))
        })
    },
    firstGet: () => {
        set(() => ({
            page: 1,
            per_page: 10,
            search: ''
        }))

        get().getProductRequests()
    },
    setCurrentProductRequest: (product_request) => set({current_product_request: product_request})
}))