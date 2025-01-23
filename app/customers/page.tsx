"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";
import { UserDTO } from "@/types/user.type";

import SearchContext from "@/contexts/SearchContext";

import { toast } from "react-toastify";
import CustomerRow from "@/components/ui/Customer/CustomerRow";

const Customer = () => {
  const userService = useMemo(() => UserService.getInstance(), []);
  const [customers, setCustomers] = useState<UserDTO[]>([]);
  const { search } = useContext(SearchContext);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      try {
        const response = search
          ? await userService.search({
              searchUser: search,
              loaiTK: "KH",
            })
          : await userService.getCustomers();
        if (response.success) {
          setCustomers(response.data?.user || []);
        } else {
          toast.error(response.error?.message || "Failed to fetch customers");
        }
        return response;
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("An unexpected error occurred while fetching customers.");
        throw error;
      }
    },
  });

  const handleLockAndUnlock = async (id: string) => {
    try {
      const response = await userService.lock(id);
      if (response.success) {
        toast.success(response.data?.message || "Employee locked successfully");
        setCustomers((prev) =>
          prev.map((customer) =>
            customer._id === id
              ? { ...customer, trangThai: !customer.trangThai }
              : customer
          )
        );
      } else {
        console.error(response.error?.message || "Failed to lock employee");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred while locking employee:",
        error
      );
    }
  };

  if (!customers) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-row-reverse space-between p-5 shadow-md"></div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table className="mt-3">
          <TableCaption>A list of your recent customers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer: UserDTO, index: number) => (
              <CustomerRow
                key={customer._id}
                index={index + 1}
                customer={customer}
                onLockAndUnlock={handleLockAndUnlock}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default Customer;
