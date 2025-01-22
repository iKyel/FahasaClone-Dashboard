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
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CategoryService } from "@/services/category.service";
import { FeatureService } from "@/services/feature.service";
import { ProductService } from "@/services/product.service";
import { CategoryDTO } from "@/types/category.type";
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
  const featureService = useMemo(() => FeatureService.getInstance(), []);

  const [product, setProduct] = useState<{
    _id: string;
    tenSP: string;
    giaBan: number;
    giaNhap: number;
    soLuong: number;
    moTa?: string;
    trongLuong: number;
    danhMucId: string;
    khuyenMai?: number;
    kichThuoc: {
      dai: number;
      rong: number;
      cao: number;
    };
    imageUrl: File | string | null;
  }>();

  const [features, setFeatures] = useState<
    Array<{
      _id: string;
      dacTrungId: string;
      ten: string;
      giaTri: string;
    }>
  >([]);

  const [featuresSelect, setFeaturesSelect] = useState<
    {
      _id: string;
      ten: string;
      tenTruyVan: string;
      truongLoc: boolean;
    }[]
  >([]);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
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
      features:
        features.map((feature) => ({
          _id: feature.dacTrungId,
          ten: feature.ten,
          giaTri: feature.giaTri,
        })) ?? [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { setValue } = form;

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
    const fetchFeatures = async () => {
      try {
        const response = await featureService.getAllFeatures();
        if (response.success && response.data) {
          setFeaturesSelect(response.data.features);
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFeatures();
  }, [featureService]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.imageUrl instanceof File) {
        setImagePreview(URL.createObjectURL(value.imageUrl));
      } else if (typeof value.imageUrl === "string") {
        setImagePreview(value.imageUrl);
      } else {
        setImagePreview(null); // Hoặc thiết lập một URL khác nếu cần
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const fetchProductDetail = async (id: string) => {
      try {
        const response = await productService.getProductDetail(id);
        if (response.success && response.data) {
          const productDetail = response.data.productDetail;
          setProduct(response.data.productDetail);
          setFeatures(response.data.features);
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

          const featuresInProductDetail = response.data.features;
          // console.log(featuresInProductDetail);
          setValue(
            "features",
            featuresInProductDetail.map((feature) => ({
              _id: feature.dacTrungId,
              tenDT: feature.ten,
              giaTri: feature.giaTri,
            })) ?? []
          );
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

      const response = await productService.updateProduct(productId, values);
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
                          priority
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

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <div className="space-y-4">
                  {field.value.map((feature, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center border-b border-gray-300 pb-2"
                    >
                      {/* Feature Select */}
                      <FormField
                        control={form.control}
                        name={`features.${index}._id`}
                        render={({ field: fieldId }) => (
                          <div className="w-1/2">
                            <FormLabel>Feature</FormLabel>
                            <Select
                              value={feature._id || ""} // Hiển thị giá trị _id hiện tại của feature
                              onValueChange={(value) => {
                                const selectedFeature = featuresSelect.find(
                                  (f) => f._id === value
                                );
                                if (selectedFeature) {
                                  const updatedFeatures = [...field.value];
                                  updatedFeatures[index] = {
                                    ...updatedFeatures[index],
                                    _id: selectedFeature._id,
                                    tenDT: selectedFeature.ten,
                                    giaTri:
                                      updatedFeatures[index]?.giaTri || "", // Giữ giá trị giaTri nếu có
                                  };
                                  field.onChange(updatedFeatures);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select feature" />
                              </SelectTrigger>
                              <SelectContent>
                                {featuresSelect.map((f) => (
                                  <SelectItem key={f._id} value={f._id}>
                                    {f.ten}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      />

                      {/* Feature Value Input */}
                      <FormField
                        control={form.control}
                        name={`features.${index}.giaTri`}
                        render={({ field: fieldGiaTri }) => (
                          <div className="w-1/2">
                            <FormLabel>Value</FormLabel>
                            <Input
                              placeholder="Enter value"
                              value={feature.giaTri || ""} // Hiển thị giá trị giaTri hiện tại của feature
                              onChange={(e) => {
                                const updatedFeatures = [...field.value];
                                updatedFeatures[index] = {
                                  ...updatedFeatures[index],
                                  giaTri: e.target.value, // Cập nhật giaTri khi input thay đổi
                                };
                                field.onChange(updatedFeatures); // Cập nhật lại toàn bộ mảng features
                              }}
                            />
                          </div>
                        )}
                      />

                      {/* Remove Button */}
                      <Button
                        type="button"
                        className="text-red-500 hover:text-white bg-white hover:bg-red-500 border border-red-500 rounded mt-5"
                        onClick={() => {
                          const updatedFeatures = [...field.value];
                          updatedFeatures.splice(index, 1); // Xóa feature tại index hiện tại
                          field.onChange(updatedFeatures);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  {/* Add Feature Button */}
                  <Button
                    type="button"
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => {
                      const updatedFeatures = [
                        ...field.value,
                        { _id: "", tenDT: "", giaTri: "" }, // Thêm một feature mới với giá trị mặc định
                      ];
                      field.onChange(updatedFeatures);
                    }}
                  >
                    Add Feature
                  </Button>
                </div>
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

export default ProductDetail;
