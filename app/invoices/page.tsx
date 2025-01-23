"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchContext from "@/contexts/SearchContext";
import { InvoiceService } from "@/services/invoice.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { memo, useContext, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCheck, TbLockCancel, TbReload } from "react-icons/tb";

const InvoiceStatus = memo(
  ({
    status,
  }: {
    status: "Chờ xác nhận" | "Hoàn thành" | "Đã hủy" | "Đã xác nhận";
  }) => {
    const statusStyles = {
      "Chờ xác nhận": "bg-blue-200 text-blue-700",
      "Hoàn thành": "bg-green-200 text-green-700",
      "Đã hủy": "bg-red-200 text-red-700",
      "Đã xác nhận": "bg-green-200 text-green-400",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-2 text-sm font-semibold rounded-full ${
          statusStyles[status] || ""
        }`}
      >
        {status === "Chờ xác nhận" ? (
          <>
            Processing <TbReload className="ml-1" />
          </>
        ) : status === "Hoàn thành" ? (
          <>
            Completed <TbCheck className="ml-1" />
          </>
        ) : status === "Đã hủy" ? (
          <>
            Canceled <TbLockCancel className="ml-1" />
          </>
        ) : (
          <>
            Accepted <TbCheck className="ml-1" />
          </>
        )}
      </span>
    );
  }
);

InvoiceStatus.displayName = "Invoice Status";

const Invoices = () => {
  const router = useRouter();
  // const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);

  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const invoiceService = useMemo(() => InvoiceService.getInstance(), []);

  const { search } = useContext(SearchContext);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["invoices", search, pageNum],
    queryFn: async () => {
      const response =
        search && search !== ""
          ? await invoiceService.searchInvoice(search, {
              page: pageNum,
              limit: 24,
            })
          : await invoiceService.getAll({ page: pageNum, limit: 24 });
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error?.message);
      }
    },
  });

  const handleConfirmInvoice = async (id: string) => {
    try {
      const response = await invoiceService.confirm(id);
      if (response.success) {
        // Gọi lại API để cập nhật danh sách invoices
        const updatedResponse = await invoiceService.getAll({
          page: pageNum,
          limit: 24,
        });

        if (updatedResponse.success) {
          refetch();
          console.log("Invoice confirmed successfully!");
        } else {
          console.error(updatedResponse.error?.message);
        }
      } else {
        console.error(response.error?.message);
      }
    } catch (error) {
      console.error("Error confirming invoice:", error);
    }
  };

  const handleConpleteInvoice = async (id: string) => {
    try {
      const response = await invoiceService.complete(id);
      if (response.success) {
        const updatedResponse = await invoiceService.getAll({
          page: pageNum,
          limit: 24,
        });

        if (updatedResponse.success) {
          refetch();
          console.log("Invoice confirmed successfully!");
        } else {
          console.error(updatedResponse.error?.message);
        }
      } else {
        console.error(response.error?.message);
      }
    } catch (error) {
      console.error("Error confirming invoice:", error);
    }
  };

  const handleCancelInvoice = async (id: string) => {
    try {
      const response = await invoiceService.cancel(id);
      if (response.success) {
        // Gọi lại API để cập nhật danh sách invoices
        const updatedResponse = await invoiceService.getAll({
          page: pageNum,
          limit: 24,
        });

        if (updatedResponse.success) {
          // setInvoices(updatedResponse.data?.saleInvoices || []);
          refetch();
          console.log("Invoice canceled successfully!");
        } else {
          console.error(updatedResponse.error?.message);
        }
      } else {
        console.error(response.error?.message);
      }
    } catch (error) {
      console.error("Error canceling invoice:", error);
    }
  };

  return (
    <>
      <div className="flex flex-row-reverse mb-5 py-5"></div>

      <Table>
        <TableCaption>A list of your recent good receive notes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Shipment Type</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-end">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data?.saleInvoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice._id}</TableCell>
                <TableCell>{invoice.khachHangId}</TableCell>
                <TableCell>{invoice.tenKH}</TableCell>
                <TableCell>{invoice.ptVanChuyen}</TableCell>
                <TableCell>{invoice.diaChiDatHang}</TableCell>
                <TableCell>
                  <InvoiceStatus
                    status={
                      invoice.trangThaiDon as
                        | "Chờ xác nhận"
                        | "Hoàn thành"
                        | "Đã hủy"
                        | "Đã xác nhận"
                    }
                  />
                </TableCell>
                <TableCell>
                  {new Date(invoice.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-end">
                  {invoice.tongTien.toLocaleString()}đ
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-transparent text-black hover:bg-transparent">
                        <BsThreeDotsVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/invoices/${invoice._id}`)
                          }
                        >
                          View
                        </DropdownMenuItem>
                        {invoice.trangThaiDon === "Chờ xác nhận" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleConfirmInvoice(invoice._id)}
                            >
                              Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelInvoice(invoice._id)}
                            >
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                        {invoice.trangThaiDon === "Đã xác nhận" && (
                          <DropdownMenuItem
                            onClick={() => handleConpleteInvoice(invoice._id)}
                          >
                            Complete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="bottom-1 flex justify-center items-center">
        <Pagination>
          <PaginationContent>
            {/* Nút Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPageNum((num) => num - 1)}
                tabIndex={pageNum <= 1 ? -1 : undefined}
                aria-disabled={pageNum === 1}
                className={
                  pageNum <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {/* Hiển thị các trang */}
            {Array.from({ length: totalPage }, (_, index) => index + 1)
              .filter((page) => {
                // Hiển thị trang đầu tiên, trang cuối cùng và 3 trang gần nhất xung quanh trang hiện tại
                return (
                  page === 1 ||
                  page === totalPage ||
                  (page >= pageNum - 1 && page <= pageNum + 1)
                );
              })
              .map((page, idx, visiblePages) => (
                <React.Fragment key={page}>
                  {/* Hiển thị dấu 3 chấm nếu có khoảng cách giữa các trang */}
                  {idx > 0 && page > visiblePages[idx - 1] + 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Hiển thị trang */}
                  <PaginationItem
                    style={
                      page === pageNum
                        ? {
                            backgroundColor: "orange",
                            borderRadius: "5px",
                            border: "none",
                          }
                        : {}
                    }
                  >
                    <PaginationLink onClick={() => setPageNum(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              ))}

            {/* Nút Next */}
            <PaginationItem>
              <PaginationNext
                tabIndex={pageNum >= totalPage ? -1 : undefined}
                aria-disabled={pageNum === totalPage}
                className={
                  pageNum >= totalPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={() => setPageNum((num) => num + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Invoices;
