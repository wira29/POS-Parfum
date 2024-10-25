import { z } from "zod";

export const addProductSchema = z.object({
    name: z.string().min(1, 'harus diisi'),
    desc: z.string().min(1, 'harus diisi'),
    stock: z.number().min(0, 'harus diisi'),
    unit: z.string().min(1, 'harus diisi'),
});