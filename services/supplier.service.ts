import { API_ROUTES } from "@/types/api.route";
import { ApiResponse } from "@/types/api.type";
import ApiUtils from "@/utils/apiUtils";

export class SupplierService {
  private apiUtils: ApiUtils = new ApiUtils();
  private static instance: SupplierService;

  constructor() {}

  public static getInstance(): SupplierService {
    if (!SupplierService.instance) {
      SupplierService.instance = new SupplierService();
    }
    return new SupplierService();
  }

  public async getSuppliers(): Promise<
    ApiResponse<{
      suppliers: Array<{
        _id: string;
        ten: string;
        __v: number;
      }>;
      message: string;
    }>
  > {
    return this.apiUtils.get(`${API_ROUTES.supplier}/get`);
  }

  public async addSupplier(value: { ten: string; danhMucId: string }): Promise<
    ApiResponse<{
      message: string;
      supplier: {
        ten: string;
        _id: string;
        __v: number;
      };
    }>
  > {
    return this.apiUtils.post(`${API_ROUTES.supplier}/add`, value);
  }
}
