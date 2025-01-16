export interface ProductDTO {
  _id?: string;
  tenSP: string;
  giaBan: number;
  giaNhap: number;
  soLuong: number;
  trongLuong: number;
  kichThuoc: Size;
  khuyenMai?: number;
  imageUrl: string;
  moTa?: string;
  danhMucId: string;
  features: Array<{
    _id: string;
    tenDT: string;
    giaTri: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Size {
  dai: number;
  rong: number;
  cao: number;
}
