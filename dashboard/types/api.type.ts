export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
};
