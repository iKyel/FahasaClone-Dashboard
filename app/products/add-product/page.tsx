"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { CategoryDTO } from "@/types/category.type";
import { productFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../../utils/firebase.config";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const router = useRouter();
  const productService = useMemo(() => ProductService.getInstance(), []);
  const categoryService = useMemo(() => CategoryService.getInstance(), []);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [features, setFeatures] = useState<
    {
      _id: string;
      ten: string;
      dsGiaTri: string[];
      tenTruyVan: string;
    }[]
  >([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof productFormSchema>>({
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
      imageUrl: null,
      moTa: "",
      danhMucId: "",
      features: [],
    },
  });

  const danhMucId = form.watch("danhMucId");

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

  useEffect(() => {
    const fetchFeaturesFromCategory = async (id: string) => {
      try {
        const response = await categoryService.getFeaturesByCategory(id);
        if (response.success && response.data) {
          setFeatures(response.data.features);
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (danhMucId) {
      fetchFeaturesFromCategory(danhMucId);
    }
  }, [danhMucId, categoryService]);

  useEffect(() => {
    features.forEach((feature, index) => {
      // Gán giá trị ten vào tenDT
      form.setValue(`features.${index}.tenDT`, feature.ten);
    });
  }, [features, form]);

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    console.log(values);
    try {
      if (values.moTa === null) {
        values.moTa = "";
      }

      if (values.imageUrl && values.imageUrl instanceof File) {
        // Lấy file ảnh từ form
        const imageFile = values.imageUrl;

        const storage = getStorage(app);
        // Tạo ref cho file ảnh trong Firebase Storage
        const imageRef = ref(storage, `images/${imageFile.name}`);

        // Tải ảnh lên Firebase Storage
        const uploadResult = await uploadBytes(imageRef, imageFile);

        // Lấy URL của ảnh đã tải lên
        const downloadURL = await getDownloadURL(uploadResult.ref);

        // Cập nhật dữ liệu với URL của ảnh
        values.imageUrl = downloadURL;
      }

      const response = await productService.createProduct(values);
      toast.success(response.data?.message);
      router.push("/products");
    } catch (error) {
      alert(error);
      console.error("Error during adding new product:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <div className="flex flex-row mb-5">
        <Label className="text-2xl">Add new Product</Label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tenSP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="giaBan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sell Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="giaNhap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="soLuong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trongLuong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kichThuoc.dai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kichThuoc.rong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kichThuoc.cao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="khuyenMai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  {...field}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="moTa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    {...field} // Spread field properties
                    value={field.value ?? ""} // Ensure value is a string
                    onChange={(e) => field.onChange(e.target.value)} // Directly use the string value
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        field.onChange(e.target.files[0]); // Store the first selected file
                        const previewUrl = URL.createObjectURL(
                          e.target.files[0]
                        ); // Create a preview URL
                        setImagePreview(previewUrl); // Set the preview URL
                      } else {
                        field.onChange(null); // Clear the field if no file is selected
                        setImagePreview(null); // Clear the preview
                      }
                    }}
                  />
                </FormControl>
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Selected Image"
                      width={100} // Specify width
                      height={100} // Specify height
                      style={{ objectFit: "cover" }} // Adjust styling
                    />
                  </div>
                )}
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

          {features.map((feature, index) => (
            <div key={feature._id}>
              {/* Hidden input để giữ `_id` */}
              <input
                type="hidden"
                {...form.register(`features.${index}._id`)}
                value={feature._id}
              />

              {/* Hidden input để giữ `tenDT` */}
              <input
                type="hidden"
                {...form.register(`features.${index}.tenDT`)} // Đảm bảo tenDT được đăng ký
                value={feature.ten} // Gán giá trị ten vào tenDT
              />

              {/* Input cho `giaTri` */}
              <FormField
                control={form.control}
                name={`features.${index}.giaTri`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{feature.ten}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter value for ${feature.ten}`}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)} // Update `giaTri`
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

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

export default AddProduct;