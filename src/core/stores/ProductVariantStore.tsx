import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"
import Swal from "sweetalert2"


type ProductVariantStoreType = {
    isLoading: boolean,
    variants: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,

    setLoading: (current_loading: boolean) => void,
    createVariant: (form: any) => Promise<void>,
    getVariants: () => void,
    deleteVariant: (id: number) => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void,
    updateVariant: (id: number, form: any) => Promise<void>,
}

const apiClient = useApiClient()

export const useProductVariantStore = create<ProductVariantStoreType>()((set, get) => ({
    isLoading: false,
    variants: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getVariants()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getVariants()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getVariants()
    },
    createVariant: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.post('/variants', form.current)
            get().getVariants()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    deleteVariant: (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data variant akan dihapus!",
            icon: 'question'
        }).then((result) => {
            if (result.isConfirmed) {
                apiClient.delete('variants/'+id)
                .then(res => {
                    Toaster('success', res.data.message)
                    get().getVariants()
                })
                .catch(err => {
                    Toaster('error', err.response.data.message)
                })
            }
        })
    },
    getVariants: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/variants?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            set(() => ({isLoading: false}))
            var variants = res.data.data
            var pagination = res.data.pagination

            set(() => ({
                isLoading: false, 
                variants,
                pagination: pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan user",
                variants: []
            }))
        })
    },
    firstGet: () => {
        set(() => ({
            page: 1,
            per_page: 10,
            search: ''
        }))

        get().getVariants()
    },
    updateVariant: async (id, form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.put('/variants/'+id, form.current)
            get().getVariants()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    }
}))