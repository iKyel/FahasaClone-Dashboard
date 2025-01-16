"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

import React, { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import SearchContext from "@/contexts/SearchContext";

import { SupplierDTO } from "@/types/supplier.type";
import { SupplierService } from "@/services/supplier.service";
// import IsAuth from "@/components/hoc/IsAuth";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  const { search, searchType } = useContext(SearchContext);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // let response;
        // if (search !== "") {
        //   response = await supplierService.search({
        //     searchUser: search,
        //     loaiTK: "NV",
        //   });
        // } else {
        const response = await supplierService.getSuppliers();
        // }
        if (response.success && response.data) {
          setSuppliers(response.data?.suppliers || []);
        } else {
          console.error(response.error?.message || "Failed to fetch employees");
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred while fetching employees:",
          error
        );
      }
    };

    fetchSuppliers();
  }, [supplierService, search, searchType]);

  return (
    <>
      <div className="flex flex-row-reverse pb-3 shadow-md">
        <Button
          className="bg-green-500 text-white hover:bg-white hover:text-green-600 hover:border-green-600 border-2 m-5 mb-2 px-6 active:border-none"
          asChild
        >
          <Link href="/suppliers/add-supplier">Add</Link>
        </Button>
      </div>

      <Table className="mt-3">
        <TableCaption>A list of your recent suppliers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">ID</TableHead>
            <TableHead className="w-2/3">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{supplier._id}</TableCell>
              <TableCell>{supplier.ten}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <div className="bottom-1 flex justify-center items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div> */}
    </>
  );
};

export default Supplier;
