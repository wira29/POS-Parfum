import { z } from "zod";

export const addProductSchema = z.object({
    name: z.string().min(1, 'harus diisi'),
    desc: z.string().min(1, 'harus diisi'),
    unit_type: z.string().min(1, 'harus diisi'),
    qr_code: z.string().min(0, 'minimal 1 karakter').optional(),
    image: z.nullable(
        z.instanceof(File, {message: 'tidak boleh kosong'})
        .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {message: 'format harus PNG atau JPEG'})
        .refine((file) => file.size <= 1024 * 1024, {message: "tidak boleh lebih dari 1MB"}),
    ),
    product_details: z.array(
        z.object({
            category_id: z.string().min(1, 'harus diisi'),
            product_variant_id: z.string().min(1, 'harus diisi'),
            material: z.string().min(1, 'harus diisi'),
            capacity: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0'),
            weight: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0'),
            density: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0'),
            price: z.number({message: 'harus angka'}).min(0, 'tidak boleh kurang dari 0'),
        })
    )
});