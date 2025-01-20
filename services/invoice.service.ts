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

  public async getAll(): Promise<
    ApiResponse<{
      message: string;
      soLuong: number;
      saleInvoices: Array<{
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
    }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.invoice}/staffGetSaleInvokes`);
  }

  public async searchInvoice(values: { id: string }): Promise<
    ApiResponse<{
      saleInvoices: Array<{
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
      soLuong: number;
      message: string;
    }>
  > {
    return await this.apiUtils.get(
      `${API_ROUTES.invoice}/findSaleInvoices/${values.id}`
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
      `${API_ROUTES.invoice}/getSaleInvokesById/${id}`
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
    return await this.apiUtils.patch(`${API_ROUTES.grn}/confirm/${id}`);
  }
}
