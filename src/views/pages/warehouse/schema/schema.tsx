import { z } from "zod";

export const schema = z.object({
    name: z
      .string()
      .min(1, 'Nama kategori harus diisi'),
    phone: z.string().min(1, 'Nomor telepon harus diisi'),
    address: z.string().min(1, 'Alamat harus diisi'),
  });