import { create } from "zustand"
import { useApiClient } from "../helpers/ApiClient"
import { TPaginationData } from "../interface/PaginationType";
import { DefaultPaginationData } from "../data/default_pagination_data";

export type TransactionType = {
    id: string;
    cashier_name: string|null;
    buyer_name: string;
    quantity: number;
    amount_price: number;
    payment_time: string;
}
export type TransactionDetailType = {
        transaction_code: string;
        created_at: string;
        kasir_name: string;
        buyer_name: string;
        payment_method: string;
        total_price: number;
        total_tax: number;
        total_discount: number;
        total_barang: number;
        details: {
            product_name?: string;
            variant_name?: string;
            price: number;
            quantity: string;
            discount: number;
            total_price: number;
        }[]
    }

type TransactionStoreType = {
    is_loading: boolean;
    fail: string|null;

    search: string;
    _debouncedSearch: string;
    _debounceTimer?: ReturnType<typeof setTimeout>;

    page: number;
    per_page: number;
    pagination: TPaginationData;

    items: TransactionType[];
    current_item?: TransactionDetailType|TransactionType;

    setState: (
        key: Exclude<keyof TransactionStoreType, 'setState'|'getAll'|'getDetail'>,
        value: any
    ) => void;

    getAll: (is_first?: boolean) => void;
    getDetail: (id?: string|number) => void;
}

const apiClient = useApiClient()

export const useTransactionStore = create<TransactionStoreType>()((set, get) => ({
    is_loading: false,
    fail: null,
    is_first: true,

    search: '',
    _debouncedSearch: '',
    _debounceTimer: undefined,

    page: 1,
    per_page: 10,
    pagination: DefaultPaginationData,

    items: [],
    current_item: undefined,

    setState: (key, value) => {
        set(() => ({ [key]: value }))
        if(['_debouncedSearch', 'page', 'per_page'].includes(key)) {
            setTimeout(() => get().getAll(), 1)
        }

        if(key === 'search') {
            clearTimeout(get()._debounceTimer)
            set({
                _debounceTimer: setTimeout(() => get().setState('_debouncedSearch', value), 500)
            })
        }
    },

    getAll: (is_first = false) => {
        if(is_first) {
            set(() => ({
                page: 1,
                per_page: 10,
                search: '',
                is_first: false
            }))
        }

        set(() => ({is_loading: true}))
        apiClient.get(`/transactions?per_page=${get().per_page}&page=${get().page}&search=${get()._debouncedSearch}`)
        .then((res) => {
            set(() => ({is_loading: false}))
            var items = res.data.data
            var pagination = res.data.pagination
            
            set(() => ({
                items,
                pagination
            }))
        }).catch(() => {
            set(() => ({
                is_loading: false,
                fail: "Gagal mendapatkan data transaksi",
                items: [],
            }))
        })
        set(() => ({is_loading: false}))
    },
    getDetail: (id) => {
        set(() => ({is_loading: true}))
        apiClient.get(`/transactions/${id}`)
        .then((res) => {
            set(() => ({is_loading: false}))
            var item = res.data.data
            
            set(() => ({
                current_item: item
            }))
        }).catch(() => {
            set(() => ({
                is_loading: false,
                fail: "Gagal mendapatkan data transaksi",
                items: [],
            }))
        })
        set(() => ({is_loading: false}))
    },
}))
