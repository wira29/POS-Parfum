import { z } from "zod"

export const requestRestockProductSchema = z.object({
    warehouse_id: z.string().min(1, 'gudang tidak boleh kosong'),
    product_detail: z.array(
        z.object({
            product_detail_id: z.string().min(1, 'pilih produk terlebih dahulu'),
            requested_stock: z.number().min(1, 'tidak boleh kurang dari 1'),
        })
    ).min(1, 'minimal 1 produk')
})
export type requestRestockProductType = z.infer<typeof requestRestockProductSchema>

export const updateRequestRestockProductSchema = z.object({
    status: z.string().min(1, 'status tidak boleh kosong'),
    product_detail: z.array(
        z.object({
            product_detail_id: z.string().min(1, 'pilih produk terlebih dahulu'),
            sended_stock: z.number().min(0, 'tidak boleh kurang dari 0'),
        })
    ).min(1, 'minimal 1 produk')
})
export type updateRequestRestockProductType = z.infer<typeof updateRequestRestockProductSchema>