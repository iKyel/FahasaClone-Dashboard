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

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { SupplierDTO } from "@/types/supplier.type";
import { SupplierService } from "@/services/supplier.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
// import IsAuth from "@/components/hoc/IsAuth";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  // const { search, searchType } = useContext(SearchContext);
  const router = useRouter();
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
  }, [supplierService]);

  const handleDeleteSupplier = async (id: string) => {
    try {
      const response = await supplierService.deleteSupplier(id);

      if (response.success) {
        toast.success(response.data?.message);
        setSuppliers(response.data?.suppliers || []);
      } else {
        console.log(response.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
            <TableHead className="w-1/4">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{supplier.ten}</TableCell>
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
                          router.push(`/suppliers/${supplier._id}`);
                        }}
                      >
                        View and Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteSupplier(supplier._id)}
                      >
                        Delete
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

export default Supplier;
