"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supplierFormSchema } from "@/utils/schema";
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
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SupplierService } from "@/services/supplier.service";
import { CategoryDTO } from "@/types/category.type";
import { CategoryService } from "@/services/category.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddSupplier = () => {
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  const categoryService = useMemo(() => CategoryService.getInstance(), []);
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const form = useForm<z.infer<typeof supplierFormSchema>>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      ten: "",
      danhMucId: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error("Error during fetching categories:", error);
      }
    };

    fetchCategories();
  }, [categoryService]);

  const onSubmit = async (values: z.infer<typeof supplierFormSchema>) => {
    console.log(values);
    try {
      const response = await supplierService.addSupplier(values);
      console.log(response);
      if (response.success && response.data) {
        toast.success(response.data.message, {
          onClose: () => router.push("/suppliers"),
        });
      } else {
        toast.error(response.data?.message || "Thêm nhà cung cấp thất bại");
        console.log(response.data?.message);
      }
    } catch (error) {
      console.error("Error during adding new supplier:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <h2 className="text-orange-500 text-2xl mb-5">Add new Supplier</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="ten"
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
            name="danhMucId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""} // Đảm bảo rằng value của Select luôn được cập nhật
                    onValueChange={(value) => field.onChange(value)} // Sử dụng onValueChange để cập nhật giá trị
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories &&
                        categories.map((category, index) => (
                          <SelectItem key={index} value={category._id}>
                            {category.ten}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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

export default AddSupplier;
