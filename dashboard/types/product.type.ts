export interface ProductDTO {
    tenSP: string;
    giaBan: number;
    giaNhap: number;
    SoLuong: number;
    trongLuong: number;
    kichThuoc: Size;
    khuyenMai?: string;
    moTa: string;
    createdAt?: Date;
    updatedAt?: Date
}

export interface Size {
    dai: number;
    rong: number;
    cao: number;
}