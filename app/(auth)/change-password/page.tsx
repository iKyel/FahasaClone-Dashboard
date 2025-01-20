"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserService } from "@/services/user.service";
import { changePasswordFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ChangePassword = () => {
  const router = useRouter();
  const userService = useMemo(() => UserService.getInstance(), []);
  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof changePasswordFormSchema>) => {
    try {
      const response = await userService.changePassword(values);
      console.log(response);
      if (response.success && response.data) {
        toast.success(response.data.message, {
          onClose: () => router.push("/"), // Chỉ redirect sau khi toast đóng
        });
      } else {
        toast.error(
          response.data?.message || "Đăng nhập thất bại, vui lòng thử lại!"
        );
        console.log(response.data?.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
    //   <div className="mx-auto max-w-md space-y-6 mt-8">
    //     <div className="space-y-2 text-center">
    //       <h1 className="text-3xl font-bold">Reset Password</h1>
    //       <p className="text-muted-foreground">
    //         Enter a new password to reset your account.
    //       </p>
    //     </div>
    //     <form className="space-y-4">
    //       <div className="space-y-2">
    //         <Label htmlFor="password">New Password</Label>
    //         <Input
    //           id="password"
    //           type="password"
    //           placeholder="Enter new password"
    //           required
    //         />
    //       </div>
    //       <div className="space-y-2">
    //         <Label htmlFor="confirm-password">Confirm Password</Label>
    //         <Input
    //           id="confirm-password"
    //           type="password"
    //           placeholder="Confirm new password"
    //           required
    //         />
    //       </div>
    //       <Button type="submit" className="w-full">
    //         Reset Password
    //       </Button>
    //     </form>
    //   </div>
    // </div>
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-orange-600">
          Change password
        </CardTitle>
        <CardDescription>
          Enter your old password and new password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your old password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              asChild
              className="bg-orange-600 hover:bg-white hover:text-orange-600 hover:border-orange-600 hover:border-2"
            >
              <button type="submit">Submit</button>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
