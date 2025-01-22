import { API_ROUTES } from "@/types/api.route";
import { ApiResponse } from "@/types/api.type";
import ApiUtils from "@/utils/apiUtils";

export class GoodReceiveNotesService {
  private apiUtils: ApiUtils = new ApiUtils();
  private static instance: GoodReceiveNotesService;

  constructor() {}

  public static getInstance(): GoodReceiveNotesService {
    if (!GoodReceiveNotesService.instance) {
      GoodReceiveNotesService.instance = new GoodReceiveNotesService();
    }
    return this.instance;
  }

  public async getAll(values?: { pageNum: number }): Promise<
    ApiResponse<{
      purchaseInvoices: Array<{
        _id: string;
        nhaCungCapId: string;
        nhanVienId: string;
        tenNV: string;
        trangThaiDon: string;
        ghiChu: string;
        tongTien: number;
      }>;
      message: string;
      totalPage: number;
    }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.grn}/getAll`, values);
  }

  public async create(values: {
    purchaseInvoice: {
      supplierId: string;
      ghiChu: string;
      tongTien: number;
    };
    detailPurchaseInvoices: Array<{
      productId: string;
      soLuong: number;
      thanhTien: number;
    }>;
  }): Promise<ApiResponse<{ message: string }>> {
    return await this.apiUtils.post(`${API_ROUTES.grn}/create`, values);
  }

  public async confirm(id: string): Promise<
    ApiResponse<{
      purchaseInvoices: Array<{
        nhaCungCapId: string;
        nhanVienId: string;
        trangThaiDon: string;
        ghiChu: string;
        tongTien: number;
      }>;
      message: string;
    }>
  > {
    return await this.apiUtils.patch(`${API_ROUTES.grn}/confirm/${id}`);
  }

  public async cancel(id: string): Promise<
    ApiResponse<{
      purchaseInvoices: Array<{
        nhaCungCapId: string;
        nhanVienId: string;
        trangThaiDon: string;
        ghiChu: string;
        tongTien: number;
      }>;
      message: string;
    }>
  > {
    return await this.apiUtils.patch(`${API_ROUTES.grn}/cancel/${id}`);
  }

  public async getGrnDetails(id: string): Promise<
    ApiResponse<{
      purchaseInvoice: {
        _id: string;
        nhanVienId: string;
        trangThaiDon: string;
        ghiChu: string;
        tongTien: number;
        createdAt: string;
        supplierId: string;
        ten: string;
      };
      detailPurchaseInvoices: Array<{
        _id: string;
        soLuong: number;
        thanhTien: number;
        sanPhamId: string;
        tenSP: string;
        giaNhap: string;
        imageUrl: string;
      }>;
      message: string;
    }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.grn}/getDetail/${id}`);
  }

  public async searchGrn(values?: { id: string; pageNum: number }): Promise<
    ApiResponse<{
      purchaseInvoices: Array<{
        _id: string;
        nhaCungCapId: string;
        nhanVienId: string;
        trangThaiDon: string;
        ghiChu: string;
        tongTien: number;
      }>;
      message: string;
      totalPage: number;
    }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.grn}/searchInvoice`, values);
  }
}
