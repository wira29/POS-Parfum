import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { Toaster } from "../helpers/BaseAlert"
import { TPaginationData } from "@/views/components/Pagination"
import Swal from "sweetalert2"


type WarehouseStoreType = {
    isLoading: boolean,
    warehouses: any[],
    warehouse: {[key:string]:any}|null,
    currentWarehouse?: {[key:string]:any},
    pagination: TPaginationData,
    isFailure: boolean,
    page: number,
    per_page: number,
    search: string,

    setLoading: (current_loading: boolean) => void,
    setCurrentWarehouse: (current_warehouse: {[key:string]:any}) => void,
    createWarehouse: (form: any) => Promise<void>,
    getWarehouses: () => void,
    getWarehouse: (id: string) => void,
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
    warehouse: null,
    currentWarehouse: undefined,
    pagination: undefined,
    isFailure: false,
    page: 1,
    per_page: 10,
    search: '',

    setLoading: (current_loading) => set(() => ({isLoading: current_loading})),
    setCurrentWarehouse: (current_warehouse) => set(() => ({currentWarehouse: current_warehouse})),
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
            $('#add-warehouse-modal').modal('hide')
        } catch (err:any) {
            set(() => ({isLoading: false, isFailure: true}))
            Toaster('error', err.response.data.message)
        }
    },
    deleteWarehouse: (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data outlet akan dihapus!",
            icon: 'question',
            confirmButtonText: 'Yakin',
            cancelButtonText: 'Batal',
            showCancelButton: true,
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
                failure: "Gagal mendapatkan data gudang",
                warehouses: []
            }))
        })
    },
    getWarehouse: (id) => {
        set(() => ({
            isLoading: true,
            isFailure: false,
        }))
        apiClient.get(`warehouses/${id}`).then(res => {
            set(() => ({
                isLoading: false,
                warehouse: res.data.data,
                isFailure: true
            }))
        }).catch(() => {
            set(() => ({
                isLoading: false,
                warehouse: null,
                isFailure: true
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