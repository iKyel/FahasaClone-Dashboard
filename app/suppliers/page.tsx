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

import React, { useMemo } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useSuppliers = () => {
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  return useQuery<SupplierDTO[], Error>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await supplierService.getSuppliers();
      if (response.success) {
        return response.data?.suppliers || [];
      }
      throw new Error(response.error?.message || "Failed to fetch suppliers");
    },
  });
};

const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  const supplierService = useMemo(() => SupplierService.getInstance(), []);

  return useMutation<string, Error, string>({
    mutationFn: async (id: string) => {
      const response = await supplierService.deleteSupplier(id);
      if (!response.success) {
        throw new Error(response.error?.message);
      }
      return id;
    },
    onSuccess: (id: string) => {
      // Cập nhật dữ liệu trong cache
      queryClient.setQueryData<SupplierDTO[]>(["suppliers"], (oldSuppliers) => {
        if (oldSuppliers) {
          return oldSuppliers.filter((supplier) => supplier._id !== id); // Lọc bỏ nhà cung cấp đã xóa
        }
        return oldSuppliers; // Trả lại dữ liệu cũ nếu không có
      });
      toast.success("Supplier deleted successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    },
  });
};

const Supplier = () => {
  const deleteSupplierMutation = useDeleteSupplier();
  const router = useRouter();

  const { data: suppliers = [], error } = useSuppliers();
  const handleDeleteSupplier = async (id: string) => {
    deleteSupplierMutation.mutate(id);
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
