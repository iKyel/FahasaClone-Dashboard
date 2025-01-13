import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfileComponent = () => {
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src="/assets/profile.jpg" // Đường dẫn tới ảnh đại diện
            alt="Profile Picture"
            width={40}
            height={40}
            className="w-8 h-8 rounded-full border border-gray-300 object-cover"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full h-full">
          <DropdownMenuItem
            className=" p-2 cursor-pointer hover:bg-orange-300 border-none hover:border-none"
            onClick={() => {
              router.push("/edit-profile");
            }}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" p-2 cursor-pointer hover:bg-orange-300 border-none hover:border-none"
            onClick={() => {
              router.push("/change-password");
            }}
          >
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-2 cursor-pointer hover:bg-orange-300 border-none hover:border-none"
            onClick={() => {}}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileComponent;
