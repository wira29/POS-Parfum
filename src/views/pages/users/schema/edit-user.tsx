import { DataRole } from "@/core/data/data_role";
import { z } from "zod";

export const editUserSchema = z.object({
    name: z.string().min(3, "minimal 3 karakter").max(255, "maksimal 255 karakter"),
    email: z.string().email("harus berupa email").min(1, "tidak boleh kosong").max(255, "maksimal 255 karakter"),
    password: z.union([
        z.string().min(8, "minimal 8 karakter").max(255, "maksimal 255 karakter"),
        z.literal(""),
        z.undefined()
    ]).nullable(),
    role: z.array(z.enum(DataRole)).min(1, 'harus memilih minimal 1')
})

export type TEditUserSchema = z.infer<typeof editUserSchema>