import { z } from "zod";

export const productRestockSchema = z.object({
    product_detail_id: z.string().min(1, 'tidak boleh kosong'),
    stock: z.union([
        z.string().min(1, { message: "tidak boleh kosong" }).regex(/^\d+$/, "hanya boleh berupa angka"),
        z.number(),
    ]).transform((value) => Number(value))
    .refine((value) => value > 0, { message: "minimal lebih dari 0" }),
    reason: z.string().nullable()
})

export type productRestockType = z.infer<typeof productRestockSchema>