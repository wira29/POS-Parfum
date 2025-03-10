import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"
import Swal from "sweetalert2"


type DiscountStoreType = {
    isLoading: boolean,
    discounts: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,
    current_discount?: {[key:string]:any},

    setLoading: (current_loading: boolean) => void,
    createDiscount: (form: any) => Promise<void>,
    getDiscounts: () => void,
    deleteDiscount: (id: number) => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void,
    updateDiscount: (form: any) => Promise<void>,
    setCurrentDiscount: (discount: any) => void,
}

const apiClient = useApiClient()

export const useDiscountStore = create<DiscountStoreType>()((set, get) => ({
    isLoading: false,
    discounts: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',
    current_discount: undefined,

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getDiscounts()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getDiscounts()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getDiscounts()
    },
    createDiscount: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.post('/discount-vouchers', form.current, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            })
            get().getDiscounts()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    deleteDiscount: (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data diskon akan dihapus!",
            icon: 'question'
        }).then((result) => {
            if (result.isConfirmed) {
                apiClient.delete('discount-vouchers/'+id)
                .then(res => {
                    Toaster('success', res.data.message)
                    get().getDiscounts()
                })
                .catch(err => {
                    Toaster('error', err.response.data.message)
                })
            }
        })
    },
    getDiscounts: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/discount-vouchers?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            set(() => ({isLoading: false}))
            var discounts = res.data.data
            var pagination = res.data.pagination

            console.log({discounts})

            set(() => ({
                isLoading: false, 
                discounts,
                pagination: pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan user",
                discounts: []
            }))
        })
    },
    firstGet: () => {
        set(() => ({
            page: 1,
            per_page: 10,
            search: ''
        }))

        get().getDiscounts()
    },
    updateDiscount: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.post('/discount-vouchers/'+get().current_discount?.id+'?_method=PUT', form.current, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            })
            get().getDiscounts()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    setCurrentDiscount: (discount) => set({current_discount: discount})
}))