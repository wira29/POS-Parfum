import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"
import Swal from "sweetalert2"


type WarehouseStoreType = {
    isLoading: boolean,
    warehouses: any[],
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,

    setLoading: (current_loading: boolean) => void,
    createWarehouse: (form: any) => Promise<void>,
    getWarehouses: () => void,
    deleteWarehouse: (id:number) => void,
    setPage: (page:number) => void,
    setPerPage: (per_page:number) => void,
    setSearch: (search:string) => void,
    firstGet: () => void,
    updateWarehouse: (id: number, form: any) => Promise<void>,
}

const apiClient = useApiClient()

export const useWarehouseStore = create<WarehouseStoreType>()((set, get) => ({
    isLoading: false,
    warehouses: [],
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setPage: (page) => {
        set(() => ({page}))
        get().getWarehouses()
    },
    setPerPage: (per_page) => {
        set(() => ({per_page}))
        get().getWarehouses()
    },
    setSearch: (search) => {
        set(() => ({search}))
        get().getWarehouses()
    },
    createWarehouse: async (form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.post('/warehouses', form.current)
            get().getWarehouses()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    deleteWarehouse: (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data outlet akan dihapus!",
            icon: 'question'
        }).then((result) => {
            if (result.isConfirmed) {
                apiClient.delete('warehouses/'+id)
                .then(res => {
                    Toaster('success', res.data.message)
                    get().getWarehouses()
                })
                .catch(err => {
                    Toaster('error', err.response.data.message)
                })
            }
        })
    },
    getWarehouses: () => {
        set(() => ({isLoading: true}))
        apiClient.get(`/warehouses?per_page=${get().per_page}&page=${get().page}&search=${get().search}`).then((res) => {
            var warehouses = res.data.data
            var pagination = res.data.pagination

            set(() => ({
                isLoading: false, 
                warehouses,
                pagination
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                failure: "Gagal mendapatkan user",
                warehouses: []
            }))
        })
    },
    firstGet: () => {
        set(() => ({
            page: 1,
            per_page: 10,
            search: ''
        }))

        get().getWarehouses()
    },
    updateWarehouse: async (id, form) => {
        set(() => ({isLoading: true, failure: null}))
        try {
            const response = await apiClient.put('/warehouses/'+id, form.current)
            get().getWarehouses()
            Toaster('success', response.data.message)
            set(() => ({isFailure: false, isLoading: false}))
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    }
}))