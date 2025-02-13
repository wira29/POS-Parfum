import { z } from "zod";

export const addProductSchema = z.object({
    name: z.string().min(1, 'harus diisi'),
    unit_type: z.string().min(1, 'harus diisi'),
    qr_code: z.string().min(0, 'minimal 1 karakter').optional(),
    image: z.nullable(
        z.instanceof(File, {message: 'tidak boleh kosong'})
        .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {message: 'format harus PNG atau JPEG'})
        .refine((file) => file.size <= 1024 * 1024, {message: "tidak boleh lebih dari 1MB"}),
    ),
    product_details: z.array(
        z.object({
            category_id: z.string().min(1, 'harus diisi').or(z.number().min(1, 'harus diisi')),
            product_varian_id: z.string().min(1, 'harus diisi').or(z.number().min(1, 'harus diisi')),
            material: z.string().min(1, 'harus diisi'),
            unit: z.string().min(1, 'harus diisi'),
            capacity: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
            weight: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
            density: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
            price: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
        })
    )
});

export const editProductSchema = z.object({
    name: z.string().min(1, 'harus diisi'),
    unit_type: z.string().min(1, 'harus diisi'),
    qr_code: z.string().min(0, 'minimal 1 karakter').optional().nullable(),
    image: z.nullable(
        z.instanceof(File, {message: 'tidak boleh kosong'})
        .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {message: 'format harus PNG atau JPEG'})
        .refine((file) => file.size <= 1024 * 1024, {message: "tidak boleh lebih dari 1MB"}),
    ),
    product_details: z.array(
        z.object({
            product_detail_id: z.string().min(1, 'harus diisi').or(z.number().min(1, 'harus diisi')).optional(),
            category_id: z.string().min(1, 'harus diisi').or(z.number().min(1, 'harus diisi')),
            product_varian_id: z.string().min(1, 'harus diisi').or(z.number().min(1, 'harus diisi')),
            material: z.string().min(1, 'harus diisi'),
            unit: z.string().min(1, 'harus diisi'),
            capacity: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
            weight: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
            density: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
            price: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0').or(z.string().regex(/^\d+$/, 'harus angka')),
        })
    )
});

export type addProductType = z.infer<typeof addProductSchema>

export type editProductType = z.infer<typeof editProductSchema>