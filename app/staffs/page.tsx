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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useContext, useMemo } from "react";
import Link from "next/link";
import { UserService } from "@/services/user.service";
import { LuDot } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import StaffContext from "@/contexts/StaffContext";
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
import useEmployees from "@/hooks/use-employees";

const Staff = () => {
  // const [employees, setEmployees] = useState<UserDTO[]>([]);
  const userService = useMemo(() => UserService.getInstance(), []);
  const { search } = useContext(SearchContext);
  const router = useRouter();

  const { setStaff } = useContext(StaffContext);

  const { employees, setEmployees, loading } = useEmployees(search);

  const handleLock = async (id: string) => {
    try {
      const response = await userService.lock(id);
      if (response.success) {
        toast.success(response.data?.message || "Employee locked successfully");
        setEmployees((prev) =>
          prev.map((employee) =>
            employee._id === id
              ? { ...employee, trangThai: !employee.trangThai }
              : employee
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

  return (
    <>
      <div className="flex flex-row-reverse pb-3 shadow-md">
        <Button
          className="bg-green-500 text-white hover:bg-white hover:text-green-600 hover:border-green-600 border-2 m-5 mb-2 px-6 active:border-none"
          asChild
        >
          <Link href="/staffs/add-staff">Add</Link>
        </Button>
      </div>

      <Table className="mt-3">
        <TableCaption>A list of your recent employees.</TableCaption>
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
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee, index) => (
              <TableRow key={employee._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{employee.hoDem}</TableCell>
                <TableCell>{employee.ten}</TableCell>
                <TableCell>{employee.userName}</TableCell>
                <TableCell>
                  {employee.diaChi.map((diaChi, id) => (
                    <div key={id}>
                      <LuDot className="inline" />
                      {diaChi}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.gioiTinh}</TableCell>
                <TableCell>{employee.ngaySinh}</TableCell>
                <TableCell>{employee.sdt}</TableCell>
                <TableCell>
                  <div
                    className={
                      employee.trangThai
                        ? "bg-green-500 rounded-l-full rounded-r-full p-2 text-center text-white"
                        : "bg-red-500 rounded-l-full rounded-r-full p-2 text-center text-white"
                    }
                  >
                    {employee.trangThai ? "Active" : "Locked"}
                  </div>
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
                          onClick={() => {
                            setStaff(employee);
                            router.push(`/staffs/${employee._id}`);
                          }}
                        >
                          View
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              {employee.trangThai ? "Lock" : "Unlock"}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently change the employee status.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleLock(employee._id)}
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
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Staff;
