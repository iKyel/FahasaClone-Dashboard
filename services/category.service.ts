import { API_ROUTES } from "@/types/api.route";
import { ApiResponse } from "@/types/api.type";
import { CategoryDTO } from "@/types/category.type";
import ApiUtils from "@/utils/apiUtils";

export class CategoryService {
  private apiUtils: ApiUtils = new ApiUtils();
  private static instance: CategoryService;

  constructor() {}

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return new CategoryService();
  }

  public async getCategories(): Promise<
    ApiResponse<{
      categories: Array<{ _id: string; ten: string; parentId: string }>;
    }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.category}/getCategories`);
  }

  public async createCategory(values: {
    ten: string;
    parentId: string | null;
  }): Promise<ApiResponse<{ message: string; danhMuc: CategoryDTO }>> {
    return await this.apiUtils.post(
      `${API_ROUTES.category}/addCategory`,
      values
    );
  }

  public async getCategoryName(id: string): Promise<
    ApiResponse<{
      message: string;
      category: {
        _id: string;
        ten: string;
      };
    }>
  > {
    return await this.apiUtils.get(
      `${API_ROUTES.category}/getCategoryName/${id}`
    );
  }

  public async getFeaturesByCategory(id: string): Promise<
    ApiResponse<{
      features: {
        _id: string;
        ten: string;
        dsGiaTri: string[];
        tenTruyVan: string;
      }[];
    }>
  > {
    return this.apiUtils.get(
      `${API_ROUTES.category}/getFeaturesByCategory/${id}`
    );
  }
}
