import { z } from "zod";

export const addDiscountSchema = z.object({
    name: z.string().min(1, 'harus diisi'),
    discount: z.number().min(1, 'minimal 1%').max(100, 'maksimal 100%'),
    is_for_store: z.boolean().nullable().optional(),
    product_id: z.union([
        z.string().min(0),
        z.literal(''),
    ]).nullable().optional(),
    outlet_id: z.union([
        z.string().min(0),
        z.literal(''),
    ]).nullable().optional(),
    desc: z.union([
        z.string().min(0),
        z.literal('')
    ]).nullable().optional(),
    max_used: z.union([
        z.number().min(0),
        z.literal('')
    ]).nullable().optional(),
    min: z.union([
        z.number().min(0),
        z.literal('')
    ]).nullable().optional(),
    expired: z.union([
        z.date(),
        z.literal('')
    ]).nullable().optional(),
    active: z.union([
        z.boolean(),
        z.literal('')
    ]).nullable().optional(),
    type: z.union([
        z.literal('voucer'),
        z.literal('non-voucer')
    ], {message: 'hanya bisa berisi voucer ata non-voucer'}).nullable().optional()
});