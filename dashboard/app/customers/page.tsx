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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";

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

  const handleLock = async (id: string) => {
    try {
      const response = await userService.lock(id);
      if (response.success) {
        setCustomers((prev) =>
          prev.map((customer) =>
            customer._id === id ? { ...customer, trangThai: false } : customer
          )
        );
        toast.success(response.data?.message || "Employee locked successfully");
        window.location.reload();
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
            <TableHead>Gender</TableHead>
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
                {customer.trangThai === true ? (
                  <Button className="bg-green-500 text-white hover:bg-green-500 hover:text-white font-bold px-5 rounded-full">
                    Active
                  </Button>
                ) : (
                  <Button className="bg-red-500 text-white hover:bg-red-500 hover:text-white font-bold px-5 rounded-full">
                    Locked
                  </Button>
                )}
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            {customer.trangThai ? `Lock` : `Unlock`}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleLock(customer._id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
