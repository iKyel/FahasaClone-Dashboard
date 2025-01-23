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
import { InvoiceDTO } from "@/types/invoice.type";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCheck, TbLockCancel, TbReload } from "react-icons/tb";

const GoodReceiveNotes = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);

  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const invoiceService = useMemo(() => InvoiceService.getInstance(), []);

  const { search } = useContext(SearchContext);

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
          setInvoices(updatedResponse.data?.saleInvoices || []);
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
        // Gọi lại API để cập nhật danh sách invoices
        const updatedResponse = await invoiceService.getAll({
          page: pageNum,
          limit: 24,
        });

        if (updatedResponse.success) {
          setInvoices(updatedResponse.data?.saleInvoices || []);
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
          setInvoices(updatedResponse.data?.saleInvoices || []);
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

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        let response;
        if (search && search !== "") {
          response = await invoiceService.searchInvoice(search, {
            page: pageNum,
            limit: 24,
          });
        } else {
          response = await invoiceService.getAll({
            page: pageNum,
            limit: 24,
          });
        }

        if (response.success) {
          setInvoices(response.data?.saleInvoices || []);
          setTotalPage(response.data?.totalPages || 1);
        } else {
          console.log(response.error?.message);
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred while fetching products:",
          error
        );
      }
    };

    fetchInvoices();
  }, [invoiceService, search, pageNum]);

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
          {invoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell>{invoice._id}</TableCell>
              <TableCell>{invoice.khachHangId}</TableCell>
              <TableCell>{invoice.tenKH}</TableCell>
              <TableCell>{invoice.ptVanChuyen}</TableCell>
              <TableCell>{invoice.diaChiDatHang}</TableCell>
              <TableCell>
                {invoice.trangThaiDon === "Chờ xác nhận" ? (
                  <p className="bg-blue-200 text-blue-700 font-semibold rounded-l-xl rounded-r-xl p-1 flex items-center justify-center gap-1">
                    Processing <TbReload />
                  </p>
                ) : invoice.trangThaiDon === "Hoàn thành" ? (
                  <p className="bg-green-200 text-green-700 font-semibold rounded-l-xl rounded-r-xl p-1 flex items-center justify-center gap-1">
                    Completed <TbCheck />
                  </p>
                ) : invoice.trangThaiDon === "Đã hủy" ? (
                  <p className="bg-red-200 text-red-700 font-semibold rounded-l-xl rounded-r-xl p-1 flex items-center justify-center gap-1">
                    Canceled <TbLockCancel />
                  </p>
                ) : (
                  <p className="bg-green-200 text-green-400 font-semibold rounded-l-xl rounded-r-xl p-1 flex items-center justify-center gap-1">
                    Accepted <TbCheck />
                  </p>
                )}
              </TableCell>
              <TableCell>
                {" "}
                {new Date(invoice.createdAt).toLocaleString()}{" "}
              </TableCell>
              <TableCell className="text-end">
                {invoice.tongTien.toLocaleString()}đ
              </TableCell>
              <TableCell className="text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent text-black hover:bg-transparent">
                      <BsThreeDotsVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`/invoices/${invoice._id}`);
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      {invoice.trangThaiDon === "Chờ xác nhận" ? (
                        <>
                          <DropdownMenuItem
                            onClick={async () => {
                              await handleConfirmInvoice(invoice._id);
                            }}
                          >
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await handleCancelInvoice(invoice._id);
                            }}
                          >
                            Cancel
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <></>
                      )}
                      {invoice.trangThaiDon === "Đã xác nhận" && (
                        <DropdownMenuItem
                          onClick={async () => {
                            await handleConpleteInvoice(invoice._id);
                          }}
                        >
                          Complete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
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

export default GoodReceiveNotes;
