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
import React, { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UserService } from "@/services/user.service";
import { UserDTO } from "@/types/user.type";
import { LuDot } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import SearchContext from "@/contexts/SearchContext";

const Customer = () => {
  const userService = useMemo(() => UserService.getInstance(), []);
  const [customers, setCustomers] = useState<UserDTO[]>([]);
  const { search, searchType } = useContext(SearchContext);
  const router = useRouter();
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        let response;
        if (search !== "") {
          response = await userService.search({
            searchUser: search,
            loaiTK: "KH",
          });
        } else {
          response = await userService.getCustomers();
        }
        if (response.success) {
          setCustomers(response.data?.user || []);
        } else {
          console.error(response.error?.message || "Failed to fetch customers");
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred while fetching customers:",
          error
        );
      }
    };

    fetchCustomers();
  }, [userService, search, searchType]);

  return (
    <>
      <div className="flex flex-row-reverse space-between pb-3 shadow-md">
        <Button
          asChild
          className="bg-green-500 text-white hover:bg-white hover:text-green-600 hover:border-green-600 border-2 m-5 mb-2 px-6"
        >
          <Link href="/customers/add-customer">Add</Link>
        </Button>
      </div>
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
            <TableHead>Sex</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{customer.hoDem}</TableCell>
              <TableCell>{customer.ten}</TableCell>
              <TableCell>{customer.userName}</TableCell>
              <TableCell>
                {customer.diaChi.map((diaChi, id) => (
                  <div key={id}>
                    <LuDot className="inline" />
                    {diaChi}
                  </div>
                ))}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.gioiTinh}</TableCell>
              <TableCell>{customer.ngaySinh}</TableCell>
              <TableCell>{customer.sdt}</TableCell>
              <TableCell>
                <Button className="bg-green-500 text-white hover:bg-green-500 hover:text-white font-bold px-5 rounded-full">
                  Active
                </Button>
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
                          router.push(`/customers/${customer._id}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Lock</DropdownMenuItem>
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

export default Customer;
