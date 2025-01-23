"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarComponent from "@/components/layout/Sidebar/SidebarComponent";
import { SidebarProvider } from "@/components/ui/sidebar";
import NavbarComponent from "@/components/layout/Navbar/NavbarComponent";
import { AppProvider } from "@/contexts/AppContext";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import ToastProvider from "@/contexts/ToastContext";
import { StaffProvider } from "@/contexts/StaffContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/change-password"
  ) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          {children}
          <ToastContainer />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AppProvider>
              <StaffProvider>
                <SearchProvider>
                  <div className="flex min-h-screen">
                    <div className="w-64">
                      <SidebarProvider>
                        <SidebarComponent />
                      </SidebarProvider>
                    </div>
                    <div className="flex-1">
                      <NavbarComponent />
                      <div className="p-4">{children}</div>
                    </div>
                  </div>
                </SearchProvider>
              </StaffProvider>
            </AppProvider>
          </ToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
