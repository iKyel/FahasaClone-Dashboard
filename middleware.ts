import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Cấu hình các đường dẫn middleware áp dụng
export const config = {
  matcher: [
    "/", // Kiểm tra các route con trong dashboard
    "/staffs", // Kiểm tra trực tiếp đường dẫn profile
  ],
};
