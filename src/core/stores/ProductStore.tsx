import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"
import Swal from "sweetalert2"


type ProductStoreType = {
    isLoading: boolean,
    products: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,

    setLoading: (current_loading: boolean) => void,
    createProduct: (form: any) => Promise<void>,
    getProducts: () => void,
    deleteProduct: (id: number) => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void,
    updateProduct: (id: number, form: any) => Promise<void>,
}

const apiClient = useApiClient()

export const useProductStore = create<ProductStoreType>()((set, get) => ({
    isLoading: false,
    products: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getProducts()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getProducts()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getProducts()
    },
    createProduct: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.post('/products', form.current)
            get().getProducts()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    deleteProduct: (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data product akan dihapus!",
            icon: 'question'
        }).then((result) => {
            if (result.isConfirmed) {
                apiClient.delete('products/'+id)
                .then(res => {
                    Toaster('success', res.data.message)
                    get().getProducts()
                })
                .catch(err => {
                    Toaster('error', err.response.data.message)
                })
            }
        })
    },
    getProducts: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/products?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            set(() => ({isLoading: false}))
            var products = res.data.data
            var pagination = res.data.pagination

            set(() => ({
                isLoading: false, 
                products,
                pagination: pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan user",
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

        get().getProducts()
    },
    updateProduct: async (id, form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.put('/products/'+id, form.current)
            get().getProducts()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    }
}))