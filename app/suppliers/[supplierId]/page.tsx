"use client";

import React, { useEffect, useMemo, useState } from "react";
import { updateSupplierFormSchema } from "@/utils/schema";
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
import { useParams, useRouter } from "next/navigation";
import { SupplierService } from "@/services/supplier.service";

import { SupplierDTO } from "@/types/supplier.type";

const EditSupplier = () => {
  const [supplier, setSupplier] = useState<SupplierDTO>();
  const [isLoading, setIsLoading] = useState(false);
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  const router = useRouter();
  const form = useForm<z.infer<typeof updateSupplierFormSchema>>({
    resolver: zodResolver(updateSupplierFormSchema),
    defaultValues: {
      ten: "",
    },
  });

  const params = useParams();
  const supplierId = params.supplierId as string;

  useEffect(() => {
    const fetchSupplierDetail = async (id: string) => {
      try {
        const response = await supplierService.getSupplierById(id);
        if (response.success) {
          setSupplier(response.data?.supplier);
        } else {
          console.log(response.error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (supplierId) {
      fetchSupplierDetail(supplierId);
    }
  }, [supplierService, supplierId]);

  useEffect(() => {
    if (supplier) {
      form.reset({
        ten: supplier.ten || "",
      });
    }
  }, [supplier, form]);

  const onSubmit = async (
    id: string,
    values: z.infer<typeof updateSupplierFormSchema>
  ) => {
    console.log(values);
    setIsLoading(true);
    try {
      const response = await supplierService.updateSupplier(id, values);
      if (response.success && response.data) {
        toast.success(response.data.message, {
          onClose: () => router.push("/suppliers"),
        });
      } else {
        toast.error(response.data?.message || "Cập nhật nhà cung cấp thất bại");
      }
    } catch (error) {
      console.error("Error during update supplier:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitWithId = (
    values: z.infer<typeof updateSupplierFormSchema>
  ) => onSubmit(supplierId, values);

  return (
    <>
      <h2 className="text-orange-500 text-2xl mb-5">Update Supplier</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitWithId)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="ten"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your supplier name" {...field} />
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

export default EditSupplier;
