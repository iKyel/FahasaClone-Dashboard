"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserService } from "@/services/user.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const userService = new UserService();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userName: "",
      password: "",
      loaiTK: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await userService.login(values);
      console.log(response);
      if (response.success && response.data) {
        toast.success(response.data.message, {
          onClose: () => router.push("/edit-profile"), // Chỉ redirect sau khi toast đóng
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
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-orange-600">
          Login
        </CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <FormField
              control={form.control}
              name="loaiTK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access By</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""} // Đảm bảo rằng value của Select luôn được cập nhật
                      onValueChange={(value) => field.onChange(value)} // Sử dụng onValueChange để cập nhật giá trị
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QTV">Admin</SelectItem>
                        <SelectItem value="NV">Staff</SelectItem>
                      </SelectContent>
                    </Select>
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
}
