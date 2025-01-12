"use client";

import React, { useEffect, useMemo, useState } from "react";
import { categoryFormSchema } from "@/utils/schema";
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
import { CategoryService } from "@/services/category.service";
import { CategoryDTO } from "@/types/category.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddCategory = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const categoryService = useMemo(() => CategoryService.getInstance(), []);
  const router = useRouter();
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      ten: "",
      parentId: null,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();

        if (response.success) {
          setCategories(response.data?.danhMucs || []);
        } else {
          console.error(
            response.error?.message || "Failed to fetch categories"
          );
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred while fetching categories:",
          error
        );
      }
    };

    fetchCategories();
  }, [categoryService]);

  const onSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    console.log(values);
    try {
      const response = await categoryService.createCategory(values);
      console.log(response);
      if (response.success && response.data) {
        toast.success(response.data.message, {
          onClose: () => router.push("/categories"),
        });
      } else {
        toast.error(response.data?.message || "Thêm nhân viên thất bại");
      }
    } catch (error) {
      console.error("Error during adding new staff:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <h2 className="text-orange-500 text-2xl mb-5">Add new Category</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="ten"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""} // Đảm bảo rằng value của Select luôn được cập nhật
                    onValueChange={(value) => field.onChange(value)} // Sử dụng onValueChange để cập nhật giá trị
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Parent Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.ten}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
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

export default AddCategory;
