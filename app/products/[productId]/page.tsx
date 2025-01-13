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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { ProductDTO } from "@/types/product.type";
import app from "@/utils/firebase.config";
import { productFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ProductDetail = () => {
  const router = useRouter();
  const productService: ProductService = useMemo(
    () => ProductService.getInstance(),
    []
  );
  const categoryService: CategoryService = useMemo(
    () => CategoryService.getInstance(),
    []
  );

  const [product, setProduct] = useState<ProductDTO>();
  const [categoryName, setCategoryName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const params = useParams();
  const productId = params.productId as string;

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      tenSP: product?.tenSP ?? "",
      giaBan: product?.giaBan ?? 1,
      giaNhap: product?.giaNhap ?? 1,
      soLuong: product?.soLuong ?? 1,
      trongLuong: product?.trongLuong ?? 1,
      kichThuoc: product?.kichThuoc ?? {
        dai: 1,
        rong: 1,
        cao: 1,
      },
      khuyenMai: product?.khuyenMai ?? 1,
      imageUrl: product?.imageUrl ?? null,
      moTa: product?.moTa ?? "",
      danhMucId: product?.danhMucId ?? "",
      features: product?.features ?? [],
    },
  });

  const { setValue } = form;

  useEffect(() => {
    const fetchProductDetail = async (id: string) => {
      try {
        const response = await productService.getProductDetail(id);
        if (response.success && response.data) {
          const productDetail = response.data.productDetail;
          setProduct(response.data.productDetail);
          setValue("tenSP", productDetail.tenSP ?? "");
          setValue("giaBan", productDetail.giaBan ?? 1);
          setValue("giaNhap", productDetail.giaNhap ?? 1);
          setValue("soLuong", productDetail.soLuong ?? 1);
          setValue("trongLuong", productDetail.trongLuong ?? 1);
          setValue(
            "kichThuoc",
            productDetail.kichThuoc ?? { dai: 1, rong: 1, cao: 1 }
          );
          setValue("khuyenMai", productDetail.khuyenMai ?? 1);
          setValue("imageUrl", productDetail.imageUrl ?? null);
          setValue("moTa", productDetail.moTa ?? "");
          setValue("danhMucId", productDetail.danhMucId ?? "");
          setValue("features", productDetail.features ?? []);
        } else {
          console.error(
            response.error?.message || "Failed to fetch product detail"
          );
        }
      } catch (error) {
        console.log("Error fetching product detail:", error);
      }
    };

    if (productId) {
      fetchProductDetail(productId);
    }
  }, [productService, productId, setValue]);

  useEffect(() => {
    const fetchCategoryName = async (id: string) => {
      try {
        const response = await categoryService.getCategoryName(id);
        if (response.success && response.data) {
          setCategoryName(response.data.category.ten);
        } else {
          console.log(
            response.error?.message || "Failed to fetch category name"
          );
        }
      } catch (error) {
        console.log("Error fetching category name:", error);
      }
    };

    if (product?.danhMucId) {
      fetchCategoryName(product.danhMucId);
    }
  }, [categoryService, product?.danhMucId]);

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    console.log(values);
    try {
      if (values.moTa === null) {
        values.moTa = "";
      }

      // if (values.imageUrl && values.imageUrl instanceof File) {
      //   // Lấy file ảnh từ form
      //   const imageFile = values.imageUrl;

      //   const storage = getStorage(app);
      //   // Tạo ref cho file ảnh trong Firebase Storage
      //   const imageRef = ref(storage, `images/${imageFile.name}`);

      //   // Tải ảnh lên Firebase Storage
      //   const uploadResult = await uploadBytes(imageRef, imageFile);

      //   // Lấy URL của ảnh đã tải lên
      //   const downloadURL = await getDownloadURL(uploadResult.ref);

      //   // Cập nhật dữ liệu với URL của ảnh
      //   values.imageUrl = downloadURL;
      // }

      // const response = await productService.updateProduct(productId, values);
      // toast.success(response.data?.message);
      // router.push("/products");
    } catch (error) {
      alert(error);
      console.error("Error during adding new product:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <div className="flex flex-row mb-5">
        <Label className="text-2xl">Product Detail</Label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-4">
            <div className="flex flex-1 flex-col gap-3">
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
            </div>
            <div className="flex flex-1 gap-3 flex-col">
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
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />

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
            </div>
          </div>

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
            name="danhMucId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-5">
            <Label className="mt-3">Features</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product?.features.map((feature, index) => (
                  <TableRow key={index}>
                    <TableCell>{feature.tenDT}</TableCell>
                    <TableCell>
                      <div key={feature._id}>
                        <input
                          type="hidden"
                          {...form.register(`features.${index}._id`)}
                          value={feature._id}
                        />

                        <input
                          type="hidden"
                          {...form.register(`features.${index}.tenDT`)} // Đảm bảo tenDT được đăng ký
                          value={feature.tenDT} // Gán giá trị ten vào tenDT
                        />

                        <FormField
                          control={form.control}
                          name={`features.${index}.giaTri`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{feature.tenDT}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`Enter value for ${feature.tenDT}`}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  } // Update `giaTri`
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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

export default ProductDetail;
