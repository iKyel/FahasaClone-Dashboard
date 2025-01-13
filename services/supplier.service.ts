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

  public async getSupplierName(id: string) {}
}
