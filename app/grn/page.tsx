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
import { GoodReceiveNotesService } from "@/services/grn.service";
import { SupplierService } from "@/services/supplier.service";
import { GrnDTO } from "@/types/grn.type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCheck, TbLockCancel, TbReload } from "react-icons/tb";

const GoodReceiveNotes = () => {
  const router = useRouter();
  const [grns, setGrns] = useState<GrnDTO[]>([]);
  const [supplierNames, setSupplierNames] = useState<Record<string, string>>(
    {}
  );

  const grnService = useMemo(() => GoodReceiveNotesService.getInstance(), []);
  const supplierService = useMemo(() => SupplierService.getInstance(), []);

  const { search } = useContext(SearchContext);

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        let response;
        if (search) {
          response = await grnService.searchGrn({ id: search });
        } else {
          response = await grnService.getAll();
        }

        if (response.success) {
          setGrns(response.data?.purchaseInvoices || []);
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

    fetchGrns();
  }, [grnService, search]);

  useEffect(() => {
    const fetchSupplierNames = async () => {
      const names: Record<string, string> = {};
      const missingIds = grns
        .map((grn) => grn.nhaCungCapId)
        .filter((id) => !supplierNames[id]); // Lọc các ID chưa có tên

      if (missingIds.length === 0) return; // Không cần fetch nếu tất cả đã có

      await Promise.all(
        missingIds.map(async (id) => {
          try {
            const response = await supplierService.getSupplierById(id);
            if (response.success) {
              names[id] = response.data?.supplier.ten || "";
            }
          } catch (error) {
            console.error(`Error fetching supplier name for ID ${id}:`, error);
          }
        })
      );

      setSupplierNames((prev) => ({ ...prev, ...names }));
    };

    fetchSupplierNames();
  }, [grns, supplierService, supplierNames]);

  return (
    <>
      <div className="flex flex-row-reverse mb-5">
        <Button
          className="bg-green-500 hover:bg-white hover:text-green-500 border-2 border-green-500"
          asChild
        >
          <Link href={`/grn/add-grn`}>Add</Link>
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your recent good receive notes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Staff create</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-end">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grns.map((grn, index) => (
            <TableRow key={index}>
              <TableCell>{grn._id}</TableCell>
              <TableCell>
                {supplierNames[grn.nhaCungCapId] || "Loading..."}
              </TableCell>
              <TableCell>{grn.nhanVienId}</TableCell>
              <TableCell>
                {grn.trangThaiDon === "Chờ xác nhận" ? (
                  <>
                    <p className="bg-blue-200 text-blue-700 font-semibold rounded-l-xl rounded-r-xl py-1 flex items-center justify-center gap-1">
                      Processing <TbReload />
                    </p>
                  </>
                ) : grn.trangThaiDon === "Hoàn thành" ? (
                  <>
                    <p className="bg-green-200 text-green-700 font-semibold rounded-l-xl rounded-r-xl py-1 flex items-center justify-center gap-1">
                      Completed <TbCheck />
                    </p>
                  </>
                ) : (
                  <>
                    <p className="bg-red-200 text-red-700 font-semibold rounded-l-xl rounded-r-xl py-1 flex items-center justify-center gap-1">
                      Canceled <TbLockCancel />
                    </p>
                  </>
                )}
              </TableCell>
              <TableCell className="text-end">{grn.tongTien}</TableCell>
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
                          router.push(`/grn/${grn._id}`);
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      {grn.trangThaiDon === "Chờ xác nhận" ? (
                        <>
                          <DropdownMenuItem
                            onClick={async () => {
                              await grnService.confirm(grn._id);
                              window.location.reload();
                            }}
                          >
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await grnService.cancel(grn._id);
                              window.location.reload();
                            }}
                          >
                            Cancel
                          </DropdownMenuItem>
                        </>
                      ) : null}
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
