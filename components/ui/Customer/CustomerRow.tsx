import { UserDTO } from "@/types/user.type";
import React from "react";
import { TableCell, TableRow } from "../table";
import { LuDot } from "react-icons/lu";
import { Button } from "../button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../alert-dialog";

const CustomerRow = React.memo(
  ({
    index,
    customer,
    onLockAndUnlock,
  }: {
    index: number;
    customer: UserDTO;
    onLockAndUnlock: (id: string) => Promise<void>;
  }) => {
    return (
      <TableRow>
        <TableCell className="font-medium">{index}</TableCell>
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
          <Button
            className={`px-5 rounded-full ${
              customer.trangThai
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {customer.trangThai ? "Active" : "Locked"}
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      {customer.trangThai ? "Lock" : "Unlock"}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onLockAndUnlock(customer._id)}
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
    );
  }
);

// Đặt displayName cho component
CustomerRow.displayName = "CustomerRow";

export default CustomerRow;
