"use client";

import React, { useContext, useEffect, useMemo } from "react";
import { updateFormSchema } from "@/utils/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/user.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import StaffContext from "@/contexts/StaffContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";

const EditStaff = () => {
  const userService = useMemo(() => UserService.getInstance(), []);
  const router = useRouter();
  const { staff } = useContext(StaffContext);
  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      hoDem: staff?.hoDem || "",
      ten: staff?.ten || "",
      email: staff?.email || "",
      gioiTinh: staff?.gioiTinh || "Nam",
      ngaySinh: staff?.ngaySinh || new Date().toDateString(),
      sdt: staff?.sdt || "",
    },
  });

  // Update form values when staff changes
  useEffect(() => {
    if (staff) {
      form.reset({
        hoDem: staff.hoDem,
        ten: staff.ten,
        email: staff.email,
        gioiTinh: staff.gioiTinh,
        ngaySinh: staff.ngaySinh,
        sdt: staff?.sdt,
      });
    }
  }, [staff, form]);

  const onSubmit = async (values: z.infer<typeof updateFormSchema>) => {
    try {
      const response = await userService.updateProfile(values);
      console.log(response);
      if (response.success && response.data) {
        toast.success(response.data.message, {
          onClose: () => router.push("/edit-profile"),
        });
      } else {
        toast.error(response.data?.message || "Thêm nhân viên thất bại");
        console.log(response.data?.message);
      }
    } catch (error) {
      console.error("Error during adding new staff:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <div className="flex w-full">
        <div className="w-1/4 flex justify-center items-center">
          <Image
            src="/assets/profile.jpg"
            alt="Profile"
            width={400}
            height={400}
            className="w-48 h-48 rounded-full border-2 cursor-pointer"
          />
        </div>
        <div className="w-3/4 pl-10">
          <h2 className="text-slate-800 font-semibold text-4xl mb-5">
            {staff?.hoDem} {staff?.ten}
          </h2>
          <Link href="/" className="text-xl text-blue-500">
            {staff?.email} -{" "}
            <span className="text-gray-600">
              {staff?.loaiTK === "QTV" ? `Administrator` : `Staff`}
            </span>
          </Link>
        </div>
      </div>

      <div className="border-b-2 p-5 mb-5"></div>

      {/* <h2 className="text-orange-500 text-2xl mb-5">Update Staff</h2> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pl-5">
          <FormField
            control={form.control}
            name="hoDem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ten"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gioiTinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""} // Đảm bảo rằng value của Select luôn được cập nhật
                    onValueChange={(value) => field.onChange(value)} // Sử dụng onValueChange để cập nhật giá trị
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nam">Male</SelectItem>
                      <SelectItem value="Nữ">Female</SelectItem>
                      <SelectItem value="Khác">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ngaySinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2" />
                          {field.value ? (
                            format(new Date(field.value), "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined // Chuyển string sang Date
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          } // Lưu ISO string
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sdt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    type="phone"
                    placeholder="Enter your phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            asChild
            className="bg-green-500 text-white hover:bg-white hover:text-green-500 border-2 border-green-500"
          >
            <button type="submit">SAVE</button>
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditStaff;
