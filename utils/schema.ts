import { z } from "zod";
import { phoneRegex } from "./regex";

// User schemas:
export const userFormSchema = z.object({
  hoDem: z
    .string()
    .min(3, {
      message: "First name must be at least 3 characters.",
    })
    .max(50),
  ten: z
    .string()
    .min(3, {
      message: "First name must be at least 3 characters.",
    })
    .max(50),
  userName: z.string().min(3),
  password: z.string().min(8),
  loaiTK: z.string(),
});

export const loginFormSchema = z.object({
  userName: z.string().min(3),
  password: z.string().min(8),
  loaiTK: z.string().min(2),
});

export const registerFormSchema = z.object({
  hoDem: z.string().min(3),
  ten: z.string().min(3),
  userName: z.string().min(3),
  password: z.string().min(8),
  loaiTK: z.string().min(2),
});

export const updateFormSchema = z.object({
  hoDem: z.string().min(3),
  ten: z.string().min(3),
  email: z.string().email(),
  gioiTinh: z.string().min(2),
  ngaySinh: z.string(),
  sdt: z.string().regex(phoneRegex),
});

export const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

// ===================================================
// Product schemas:
export const productFormSchema = z.object({
  tenSP: z.string().min(3),
  giaBan: z.number().positive(),
  // giaNhap: z.number().positive(),
  soLuong: z.number(),
  trongLuong: z.number().positive(),
  kichThuoc: z.object({
    dai: z.number().positive(),
    rong: z.number().positive(),
    cao: z.number().positive(),
  }),
  khuyenMai: z.number().nullable(),
  imageUrl: z.union([z.instanceof(File), z.string().nullable()]),
  moTa: z.string().nullable(),
  danhMucId: z.string(),
  features: z.array(
    z.object({
      _id: z.string(),
      tenDT: z.string(),
      giaTri: z.string(),
    })
  ),
});

// ===================================================
// Category schemas:
export const categoryFormSchema = z.object({
  ten: z.string().min(3),
  parentId: z.union([z.string(), z.null()]),
});

// ===================================================
// Supplier schemas:
export const supplierFormSchema = z.object({
  ten: z.string(),
});

export const updateSupplierFormSchema = z.object({
  ten: z.string(),
});

// ===================================================
export const grnFormSchema = z.object({
  purchaseInvoice: z.object({
    supplierId: z.string(),
    ghiChu: z.string(),
    tongTien: z.number(),
  }),
  detailPurchaseInvoices: z.array(
    z.object({
      productId: z.string(),
      giaNhap: z.number(),
      soLuong: z.number(),
      thanhTien: z.number(),
    })
  ),
});

export const updateGrnFormSchema = z.object({
  supplierId: z.string(),
  ghiChu: z.string(),
  tongTien: z.number(),
  detailPurchaseInvoices: z.array(
    z.object({
      productId: z.string(),
      giaNhap: z.number(),
      soLuong: z.number(),
      thanhTien: z.number(),
    })
  ),
});
