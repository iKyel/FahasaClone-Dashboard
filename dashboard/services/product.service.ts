import { API_ROUTES } from "@/types/api.route";
import { ApiResponse } from "@/types/api.type";
import { ProductDTO } from "@/types/product.type";
import ApiUtils from "@/utils/apiUtils";

export class ProductService {
  private apiUtils: ApiUtils = new ApiUtils();
  private static instance: ProductService;

  constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return new ProductService();
  }

  public async createProduct(values: {
    tenSP: string;
    giaBan: number;
    giaNhap: number;
    soLuong: number;
    trongLuong: number;
    kichThuoc: {
      dai: number;
      rong: number;
      cao: number;
    };
    moTa?: string | null;
    imageUrl: File | string | null;
    features: Array<{
      _id: string;
      tenDT: string;
      giaTri: string;
    }>;
  }): Promise<ApiResponse<{ message: string }>> {
    return await this.apiUtils.post(
      `${API_ROUTES.product}/createProduct`,
      values
    );
  }

  public async updateProduct(id: string, values: ProductDTO) {
    return await this.apiUtils.put(
      `${API_ROUTES.product}/updateProduct/${id}`,
      values
    );
  }

  public async getProducts(values?: {
    category?: string;
    tenTruyVan_cua_dacTrung?: string;
    supplier?: string;
    price?: string;
    orderBy?: string;
    pageNum: number;
  }): Promise<
    ApiResponse<{
      message: string;
      products: Array<ProductDTO>;
      totalPage: number;
    }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.product}/getProducts`, values);
  }

  public async getProductDetail(
    id: string
  ): Promise<ApiResponse<{ message: string; productDetail: ProductDTO }>> {
    return await this.apiUtils.get(
      `${API_ROUTES.product}/getProductDetail/${id}`
    );
  }
}
