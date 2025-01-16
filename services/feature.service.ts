import { API_ROUTES } from "@/types/api.route";
import { ApiResponse } from "@/types/api.type";
import ApiUtils from "@/utils/apiUtils";

export class FeatureService {
  private apiUtils: ApiUtils = new ApiUtils();
  private static instance: FeatureService;

  constructor() {}

  public static getInstance() {
    if (!FeatureService.instance) {
      FeatureService.instance = new FeatureService();
    }
    return new FeatureService();
  }

  public getAllFeatures(): Promise<
    ApiResponse<{
      features: Array<{
        _id: string;
        ten: string;
        tenTruyVan: string;
        truongLoc: boolean;
      }>;
    }>
  > {
    return this.apiUtils.get(`${API_ROUTES.feature}/getAll`);
  }
}
