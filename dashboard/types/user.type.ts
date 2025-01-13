export interface UserDTO {
  _id: string;
  hoDem: string;
  ten: string;
  userName: string;
  password: string;
  email?: string;
  diaChi: string[];
  gioiTinh?: string;
  ngaySinh?: string;
  loaiTK: string;
  trangThai: boolean;
  sdt?: string;
}
