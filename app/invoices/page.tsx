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
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCheck, TbLockCancel, TbReload } from "react-icons/tb";

const GoodReceiveNotes = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);

  const invoiceService = useMemo(() => InvoiceService.getInstance(), []);

  const { search } = useContext(SearchContext);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        let response;
        if (search) {
          response = await invoiceService.searchInvoice({ id: search });
        } else {
          response = await invoiceService.getAll();
        }

        if (response.success) {
          setInvoices(response.data?.saleInvoices || []);
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
  }, [invoiceService, search]);

  // useEffect(() => {
  //   const fetchSupplierNames = async () => {
  //     const names: Record<string, string> = {};
  //     const missingIds = grns
  //       .map((grn) => grn.nhaCungCapId)
  //       .filter((id) => !supplierNames[id]); // Lọc các ID chưa có tên

  //     if (missingIds.length === 0) return; // Không cần fetch nếu tất cả đã có

  //     await Promise.all(
  //       missingIds.map(async (id) => {
  //         try {
  //           const response = await supplierService.getSupplierById(id);
  //           if (response.success) {
  //             names[id] = response.data?.supplier.ten || "";
  //           }
  //         } catch (error) {
  //           console.error(`Error fetching supplier name for ID ${id}:`, error);
  //         }
  //       })
  //     );

  //     setSupplierNames((prev) => ({ ...prev, ...names }));
  //   };

  //   fetchSupplierNames();
  // }, [grns, supplierService, supplierNames]);

  return (
    <>
      <div className="flex flex-row-reverse mb-5 py-5">
        {/* <Button
          className="bg-green-500 hover:bg-white hover:text-green-500 border-2 border-green-500"
          asChild
        >
          <Link href={`/grn/add-grn`}>Add</Link>
        </Button> */}
      </div>

      <Table>
        <TableCaption>A list of your recent good receive notes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
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
              <TableCell>{invoice.ptVanChuyen}</TableCell>
              <TableCell>{invoice.diaChiDatHang}</TableCell>
              <TableCell>
                {invoice.trangThaiDon === "Chờ xác nhận" ? (
                  <>
                    <p className="bg-blue-200 text-blue-700 font-semibold rounded-l-xl rounded-r-xl p-1 flex items-center justify-center gap-1">
                      Processing <TbReload />
                    </p>
                  </>
                ) : invoice.trangThaiDon === "Hoàn thành" ? (
                  <>
                    <p className="bg-green-200 text-green-700 font-semibold rounded-l-xl rounded-r-xl p-1 flex items-center justify-center gap-1">
                      Completed <TbCheck />
                    </p>
                  </>
                ) : (
                  <>
                    <p className="bg-red-200 text-red-700 font-semibold rounded-l-xl rounded-r-xl p-1 flex items-center justify-center gap-1">
                      Canceled <TbLockCancel />
                    </p>
                  </>
                )}
              </TableCell>
              <TableCell>
                {" "}
                {new Date(invoice.createdAt).toLocaleString()}{" "}
              </TableCell>
              <TableCell className="text-end">{invoice.tongTien}.00</TableCell>
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
                      <DropdownMenuItem
                        onClick={async () => {
                          await invoiceService.confirm(invoice._id);
                          window.location.reload();
                        }}
                      >
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          await invoiceService.cancel(invoice._id);
                          window.location.reload();
                        }}
                      >
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default GoodReceiveNotes;
