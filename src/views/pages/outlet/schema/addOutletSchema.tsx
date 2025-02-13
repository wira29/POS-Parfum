import { z } from "zod";

export const addOutletSchema = z.object({
    name: z.string().min(3, "minimal 3 karakter").max(255, "maksimal 255 karakter"),
    telp: z.union([
        z.string().min(0, 'tidak boleh kosong').regex(/^[0-9]+$/, "hanya boleh angka"),
        z.literal(''),
    ]).optional(),
    address: z.string().min(1, 'tidak boleh kosong'),
    user_id: z.array(z.string().min(1)).min(0).optional()
})

export type TAddOutletSchema = z.infer<typeof addOutletSchema>