"use client";

import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { CategoryDTO } from "@/types/category.type";
import { productFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const AddProduct = () => {
  const productService = useMemo(() => ProductService.getInstance(), []);
  const categoryService = useMemo(() => CategoryService.getInstance(), []);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data?.danhMucs || []);
      } catch (error) {
        console.error("Error during fetching categories:", error);
      }
    };

    fetchCategories();
  }, [categoryService]);

  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      tenSP: "",
      giaBan: 1,
      giaNhap: 1,
      soLuong: 1,
      trongLuong: 1,
      kichThuoc: {
        dai: 1,
        rong: 1,
        cao: 1,
      },
      khuyenMai: 1,
      imageUrl: "",
      moTa: "",
      danhMucId: "",
      features: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    console.log(values);
    try {
      const response = await productService.createProduct(values);
    } catch (error) {
      console.error("Error during adding new product:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <div>page</div>
    </>
  );
};

export default AddProduct;
