import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"

type ProductRestockStoreType = {
    isLoading: boolean,
    product_restocks: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,
    current_product_restock?: {[key:string]:any},

    setLoading: (current_loading: boolean) => void,
    createProductRestock: (form: any) => Promise<void>,
    updateProductRestock: (form: any, id:string) => Promise<void>,
    getProductRestocks: () => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void,
    setCurrentProductRestock: (product_restock: any) => void,
}

const apiClient = useApiClient()

export const useProductRestockStore = create<ProductRestockStoreType>()((set, get) => ({
    isLoading: false,
    product_restocks: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',
    current_product_restock: undefined,

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getProductRestocks()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getProductRestocks()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getProductRestocks()
    },
    createProductRestock: async (data) => {
        set(() => ({isLoading: true, isFailure: false}))
        try {
            const response = await apiClient.post('/warehouses/add/stock', data)
            set(() => ({isFailure: false}))
            Toaster('success', response.data.message)
        } catch (err:any) {
            set(() => ({isFailure: true}))
            Toaster('error', err.response.data.message)
        } finally {
            set(() => ({isLoading: false}))
        }
    },
    updateProductRestock: async (data, id) => {
        set(() => ({isLoading: true, isFailure: false}))
        try {
            const response = await apiClient.post('/stock-restock/'+id, {...data, _method: 'PUT'})
            set(() => ({isFailure: false}))
            Toaster('success', response.data.message)
            get().getProductRestocks()
        } catch (err:any) {
            set(() => ({isFailure: true}))
            Toaster('error', err.response.data.message)
        } finally {
            set(() => ({isLoading: false}))
        }
    },
    getProductRestocks: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/warehouses/history/stock?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            set(() => ({isLoading: false}))
            var product_reqs = res.data.data
            var pagination = res.data.pagination

            set(() => ({
                isLoading: false, 
                product_restocks: product_reqs,
                pagination: pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan restock stock",
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

        get().getProductRestocks()
    },
    setCurrentProductRestock: (product_restock) => set({current_product_restock: product_restock})
}))