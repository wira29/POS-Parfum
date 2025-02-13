import { z } from "zod";

export const addVariantSchema = z.object({
    name: z.string().min(1, 'harus diisi'),
});