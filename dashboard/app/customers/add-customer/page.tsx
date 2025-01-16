"use client";

import React, { useMemo } from "react";
import { userFormSchema } from "@/utils/schema";
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

const AddStaff = () => {
  const userService = useMemo(() => UserService.getInstance(), []);
  const router = useRouter();
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      hoDem: "",
      ten: "",
      userName: "",
      password: "",
      loaiTK: "KH",
    },
  });

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    console.log(values);
    try {
      const response = await userService.register(values);
      console.log(response);
      if (response.success && response.data) {
        toast.success(response.data.message, {
          onClose: () => router.push("/staffs"),
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
      <h2 className="text-orange-500 text-2xl mb-5">Add new Customer</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="hoDem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
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
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
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
            <button type="submit">Submit</button>
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddStaff;
