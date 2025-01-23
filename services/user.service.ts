import { API_ROUTES } from "@/types/api.route";
import { ApiResponse } from "@/types/api.type";
import { UserDTO } from "@/types/user.type";
import ApiUtils from "@/utils/apiUtils";
import nookies from "nookies";

export class UserService {
  private apiUtils: ApiUtils = new ApiUtils();
  private static instance: UserService;

  constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return new UserService();
  }

  public async register(values: {
    hoDem: string;
    ten: string;
    userName: string;
    password: string;
    loaiTK: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return await this.apiUtils.post(`${API_ROUTES.user}/register`, values);
  }

  public async login<UserDTO>(values: {
    userName: string;
    password: string;
    loaiTK: string;
  }): Promise<ApiResponse<{ message: string; user: UserDTO }>> {
    const response: any = await this.apiUtils.post(`${API_ROUTES.user}/login`, values);
    if (response && response.data && response.data.token) {
      console.log(response.data);
      nookies.set(null, 'token', response.data.token, { path: '/' });
    }
    return response;
  }

  public async getCustomers(): Promise<
    ApiResponse<{ user: UserDTO[]; message: string }>
  > {
    return await this.apiUtils.get<{ user: UserDTO[]; message: string }>(
      `${API_ROUTES.user}/getCustomers`
    );
  }

  public async getEmployees(): Promise<
    ApiResponse<{ user: UserDTO[]; message: string }>
  > {
    return await this.apiUtils.get<{ user: UserDTO[]; message: string }>(
      `${API_ROUTES.user}/getEmployees`
    );
  }

  public async updateProfile(values: {
    hoDem: string;
    ten: string;
    email: string;
    gioiTinh: string;
    ngaySinh: string;
    sdt: string;
  }): Promise<ApiResponse<{ message: string; user: UserDTO }>> {
    return await this.apiUtils.put(`${API_ROUTES.user}/updateAccount`, values);
  }

  public async search(values: {
    searchUser: string;
    loaiTK: string;
  }): Promise<ApiResponse<{ user: UserDTO[]; message: string }>> {
    return await this.apiUtils.get(`${API_ROUTES.user}/search`, values);
  }

  public async lock(
    userId: string
  ): Promise<
    ApiResponse<{ message: string; userId: string; trangThai: boolean }>
  > {
    return await this.apiUtils.patch(
      `${API_ROUTES.user}/${userId}/lockAccount`,
      {}
    );
  }

  public async getAccount(): Promise<
    ApiResponse<{ message: string; user: UserDTO }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.user}/getAccount`);
  }

  public async getUserById(id: string): Promise<
    ApiResponse<{
      message: string;
      user: {
        _id: string;
        hoDem: string;
        ten: string;
        userName: string;
        // password: string;
        email?: string;
        diaChi: string[];
        gioiTinh?: string;
        ngaySinh?: string;
        loaiTK: string;
        trangThai: boolean;
        sdt?: string;
      };
    }>
  > {
    return await this.apiUtils.get(`${API_ROUTES.user}/get/${id}`);
  }

  public async changePassword(values: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return await this.apiUtils.put(`${API_ROUTES.user}/changePassword`, values);
  }

  public async logout() {
    nookies.destroy(null, 'token', { path: '/' });
    return { message: "Đăng xuất thành công" };
  }
}
