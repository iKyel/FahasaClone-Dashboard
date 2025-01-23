"use client";

import React, { useMemo, useState } from "react";
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

const AddSupplier = () => {
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  // const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const form = useForm<z.infer<typeof supplierFormSchema>>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      ten: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof supplierFormSchema>) => {
    console.log(values);
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
          <Button
            asChild
            className="bg-green-500 text-white hover:bg-white hover:text-green-500 border-2 border-green-500"
          >
            <button type="submit">
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddSupplier;
