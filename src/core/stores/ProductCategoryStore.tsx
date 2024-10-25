import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"
import Swal from "sweetalert2"


type ProductCategoryStoreType = {
    isLoading: boolean,
    categories: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,

    setLoading: (current_loading: boolean) => void,
    createCategory: (form: any) => Promise<void>,
    getCategories: () => void,
    deleteCategory: (id: number) => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void,
    updateCategory: (id: number, form: any) => Promise<void>,
}

const apiClient = useApiClient()

export const useProductCategoryStore = create<ProductCategoryStoreType>()((set, get) => ({
    isLoading: false,
    categories: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getCategories()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getCategories()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getCategories()
    },
    createCategory: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.post('/categories', form.current)
            get().getCategories()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    deleteCategory: (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data category akan dihapus!",
            icon: 'question'
        }).then((result) => {
            if (result.isConfirmed) {
                apiClient.delete('categories/'+id)
                .then(res => {
                    Toaster('success', res.data.message)
                    get().getCategories()
                })
                .catch(err => {
                    Toaster('error', err.response.data.message)
                })
            }
        })
    },
    getCategories: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/categories?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            set(() => ({isLoading: false}))
            var categories = res.data.data
            var pagination = res.data.pagination

            set(() => ({
                isLoading: false, 
                categories,
                pagination: pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan user",
                categories: []
            }))
        })
    },
    firstGet: () => {
        set(() => ({
            page: 1,
            per_page: 10,
            search: ''
        }))

        get().getCategories()
    },
    updateCategory: async (id, form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.put('/categories/'+id, form.current)
            get().getCategories()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    }
}))