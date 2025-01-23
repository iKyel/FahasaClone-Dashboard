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
import { GoodReceiveNotesService } from "@/services/grn.service";
import { GrnDTO } from "@/types/grn.type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbCheck, TbLockCancel, TbReload } from "react-icons/tb";

const GoodReceiveNotes = () => {
  const router = useRouter();
  const [grns, setGrns] = useState<GrnDTO[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const grnService = useMemo(() => GoodReceiveNotesService.getInstance(), []);
  // const supplierService = useMemo(() => SupplierService.getInstance(), []);

  const { search } = useContext(SearchContext);

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        let response;
        if (search) {
          response = await grnService.searchGrn({
            id: search,
            pageNum: pageNum,
          });
        } else {
          response = await grnService.getAll({ pageNum: pageNum });
        }

        if (response.success) {
          setGrns(response.data?.purchaseInvoices || []);
          setTotalPage(response.data?.totalPage || 1);
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
  }, [grnService, search, pageNum]);

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
            <TableHead>Staff create</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-end">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grns.map((grn, index) => (
            <TableRow key={index}>
              <TableCell>{grn._id}</TableCell>
              <TableCell>{grn.tenNV}</TableCell>
              <TableCell>{grn.tenNCC}</TableCell>
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
              <TableCell className="text-end">
                {grn.tongTien.toLocaleString()}
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
                          router.push(`/grn/${grn._id}`);
                        }}
                      >
                        View
                      </DropdownMenuItem>

                      {grn.trangThaiDon === "Chờ xác nhận" ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(`/grn/edit-grn/${grn._id}`);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
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

      <div className="bottom-1 flex justify-center items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  setPageNum((num) => num - 1);
                }}
                tabIndex={pageNum <= 1 ? -1 : undefined}
                aria-disabled={pageNum === 1}
                className={
                  pageNum <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPage }, (_, index) => index + 1).map(
              (page) => (
                <PaginationItem
                  key={page}
                  className={page === pageNum ? `bg-yellow` : ``}
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
              )
            )}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                tabIndex={pageNum >= totalPage ? -1 : undefined}
                aria-disabled={pageNum === totalPage}
                className={
                  pageNum >= totalPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={() => {
                  setPageNum((num) => num + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default GoodReceiveNotes;
