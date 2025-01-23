import { API_ROUTES } from "@/types/api.route";
import { ApiResponse } from "@/types/api.type";
import ApiUtils from "@/utils/apiUtils";

export class InvoiceService {
  private apiUtils: ApiUtils = new ApiUtils();
  private static instance: InvoiceService;

  constructor() {}

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return this.instance;
  }

  public async getAll(values?: { page: number; limit?: number }): Promise<
    ApiResponse<{
      message: string;
      saleInvoices: Array<{
        _id: string;
        khachHangId: string;
        tenKH: string;
        trangThaiDon: string;
        ptVanChuyen: string;
        ptThanhToan: string;
        ghiChu: string;
        tongTien: number;
        diaChiDatHang: string;
        createdAt: string;
        updatedAt: string;
      }>;
      totalOrders: number;
      totalPages: number;
      currentPage: number;
    }>
  > {
    return await this.apiUtils.get(
      `${API_ROUTES.invoice}/staffGetSaleInvokes`,
      values
    );
  }

  public async searchInvoice(
    id: string,
    values?: {
      page: number;
      limit?: number;
    }
  ): Promise<
    ApiResponse<{
      saleInvoices: Array<{
        _id: string;
        khachHangId: string;
        tenKH: string;
        trangThaiDon: string;
        ptVanChuyen: string;
        ptThanhToan: string;
        ghiChu: string;
        tongTien: number;
        diaChiDatHang: string;
        createdAt: string;
        updatedAt: string;
      }>;
      totalPages: number;
      totalOrders: number;
      currentPage: number;
      message: string;
    }>
  > {
    return await this.apiUtils.get(
      `${API_ROUTES.invoice}/findSaleInvoices/${id}`,
      values
    );
  }

  public async getInvoiceDetailById(id: string): Promise<
    ApiResponse<{
      saleInvoice: {
        _id: string;
        khachHangId: string;
        trangThaiDon: string;
        ptVanChuyen: string;
        ptThanhToan: string;
        ghiChu: string;
        tongTien: number;
        diaChiDatHang: string;
        createdAt: string;
      };
      detailSaleInvoices: Array<{
        _id: string;
        soLuong: number;
        thanhTien: number;
        sanPhamId: string;
        tenSP: string;
        giaBan: number;
        imageUrl: string;
      }>;
    }>
  > {
    return await this.apiUtils.get(
      `${API_ROUTES.invoice}/getSaleInvoikeDetail/${id}`
    );
  }

  public async confirm(id: string): Promise<
    ApiResponse<{
      saleInvoices: {
        orders: Array<{
          _id: string;
          khachHangId: string;
          trangThaiDon: string;
          ptVanChuyen: string;
          ptThanhToan: string;
          ghiChu: string;
          tongTien: number;
          diaChiDatHang: string;
          createdAt: string;
          updatedAt: string;
        }>;
        totalOrders: number;
      };
      message: string;
    }>
  > {
    return await this.apiUtils.patch(
      `${API_ROUTES.invoice}/comfirmOrder/${id}`
    );
  }

  public async complete(id: string): Promise<
    ApiResponse<{
      saleInvoices: {
        orders: Array<{
          _id: string;
          khachHangId: string;
          trangThaiDon: string;
          ptVanChuyen: string;
          ptThanhToan: string;
          ghiChu: string;
          tongTien: number;
          diaChiDatHang: string;
          createdAt: string;
          updatedAt: string;
        }>;
        totalOrders: number;
      };
      message: string;
    }>
  > {
    return await this.apiUtils.patch(
      `${API_ROUTES.invoice}/completeOrder/${id}`
    );
  }

  public async cancel(id: string): Promise<
    ApiResponse<{
      saleInvoices: {
        orders: Array<{
          _id: string;
          khachHangId: string;
          trangThaiDon: string;
          ptVanChuyen: string;
          ptThanhToan: string;
          ghiChu: string;
          tongTien: number;
          diaChiDatHang: string;
          createdAt: string;
          updatedAt: string;
        }>;
        totalOrders: number;
      };
      message: string;
    }>
  > {
    return await this.apiUtils.patch(`${API_ROUTES.invoice}/cancelOrder/${id}`);
  }
}
