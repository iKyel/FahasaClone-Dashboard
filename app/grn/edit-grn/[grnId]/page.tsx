"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { updateGrnFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { GoodReceiveNotesService } from "@/services/grn.service";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupplierService } from "@/services/supplier.service";
import { SupplierDTO } from "@/types/supplier.type";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductService } from "@/services/product.service";

const EditGrn = () => {
  const router = useRouter();

  const grnService = useMemo(() => GoodReceiveNotesService.getInstance(), []);
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  const productService = useMemo(() => ProductService.getInstance(), []);

  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);

  const [products, setProducts] = useState<{ _id: string; tenSP: string }[]>(
    []
  );

  const [grnDetail, setGrnDetail] = useState<{
    purchaseInvoice: {
      _id: string;
      nhanVienId: string;
      trangThaiDon: string;
      ghiChu: string;
      tongTien: number;
      createdAt: string;
      supplierId: string;
      ten: string;
    };
    detailPurchaseInvoices: Array<{
      _id: string;
      soLuong: number;
      thanhTien: number;
      sanPhamId: string;
      tenSP: string;
      giaNhap: number;
      imageUrl: string;
    }>;
  }>();

  const params = useParams();
  const grnId = params.grnId as string;

  const form = useForm<z.infer<typeof updateGrnFormSchema>>({
    resolver: zodResolver(updateGrnFormSchema),
    defaultValues: {
      supplierId: grnDetail?.purchaseInvoice.supplierId || "",
      ghiChu: grnDetail?.purchaseInvoice.ghiChu || "",
      tongTien: grnDetail?.purchaseInvoice.tongTien || 0,
      detailPurchaseInvoices: grnDetail?.detailPurchaseInvoices || [],
    },
  });

  useEffect(() => {
    if (grnDetail) {
      form.reset({
        supplierId: grnDetail.purchaseInvoice.supplierId || "",
        ghiChu: grnDetail.purchaseInvoice.ghiChu || "",
        tongTien: grnDetail.purchaseInvoice.tongTien || 0,
        detailPurchaseInvoices: grnDetail.detailPurchaseInvoices.map(
          (detail) => ({
            productId: detail.sanPhamId || "",
            giaNhap: detail.giaNhap || 0,
            soLuong: detail.soLuong || 0,
            thanhTien: detail.thanhTien || 0,
          })
        ),
      });
    }
  }, [grnDetail, form]);

  useEffect(() => {
    const fetchGrnDetail = async (id: string) => {
      try {
        const response = await grnService.getGrnDetails(id);
        if (response.success && response.data) {
          setGrnDetail({
            purchaseInvoice: response.data?.purchaseInvoice,
            detailPurchaseInvoices: response.data?.detailPurchaseInvoices,
          });
          form.reset({
            supplierId: response.data?.purchaseInvoice.supplierId || "",
            ghiChu: response.data?.purchaseInvoice.ghiChu || "",
            tongTien: response.data?.purchaseInvoice.tongTien || 0,
            detailPurchaseInvoices: response.data?.detailPurchaseInvoices.map(
              (detail) => ({
                productId: detail.sanPhamId || "",
                giaNhap: detail.giaNhap || 0,
                soLuong: detail.soLuong || 0,
                thanhTien: detail.thanhTien || 0,
              })
            ),
          });
        } else {
          console.log(response.error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (grnId) {
      fetchGrnDetail(grnId);
    }
  }, [grnService, grnId, setGrnDetail, form]);

  useEffect(() => {
    const fetchProductsList = async () => {
      try {
        const response = await productService.getAllProducts();
        if (response.success) {
          setProducts(
            response.data?.products.sort((a, b) =>
              a.tenSP.localeCompare(b.tenSP)
            ) || []
          );
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchProductsList();
  }, [productService]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await supplierService.getSuppliers();
        if (response.success) {
          setSuppliers(response.data?.suppliers || []);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, [supplierService]);

  const details = form.watch("detailPurchaseInvoices");

  useEffect(() => {
    const total = details.reduce(
      (sum, detail) => sum + (detail.thanhTien || 0),
      0
    );
    form.setValue("tongTien", total);
  }, [details, form]);

  const onSubmit = async (
    id: string,
    values: z.infer<typeof updateGrnFormSchema>
  ) => {
    console.log(values);
    try {
      const response = await grnService.update(id, values);
      if (response.success && response.data) {
        toast.success("Sửa hóa đơn nhập kho thành công");
        router.push("/grn");
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error("Error creating GRN:", error);
      toast.error("Error while creating new good receive note");
    }
  };

  const handleSubmitWithId = (values: z.infer<typeof updateGrnFormSchema>) =>
    onSubmit(grnId, values);

  return (
    <>
      <div className="flex flex-row mb-5">
        <Label className="text-2xl">Add Goods Receive Note</Label>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitWithId)}>
          {/* Supplier Selection */}
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier._id} value={supplier._id}>
                          {supplier.ten}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="ghiChu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter notes"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Details */}
          <FormField
            control={form.control}
            name="detailPurchaseInvoices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Sum</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {field.value.map((detail, index) => (
                      <TableRow key={index}>
                        {/* Product Id */}
                        <TableCell>
                          <Select
                            value={detail.productId}
                            onValueChange={(value) => {
                              const updatedDetails = [...field.value];
                              updatedDetails[index] = {
                                ...updatedDetails[index],
                                productId: value,
                              };
                              field.onChange(updatedDetails);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem
                                  key={product._id}
                                  value={product._id}
                                >
                                  {product.tenSP}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={detail.giaNhap || 0}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const giaNhap = Number(e.target.value);

                              if (/^0\d+$/.test(inputValue)) {
                                e.target.value = inputValue.replace(/^0+/, ""); // Loại bỏ số 0 đứng đầu
                              }
                              const updatedDetails = field.value.map(
                                (item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        giaNhap,
                                        thanhTien:
                                          giaNhap * (item.soLuong || 0),
                                      }
                                    : item
                              );
                              field.onChange(updatedDetails);
                            }}
                          />
                        </TableCell>

                        {/* Quantity */}
                        <TableCell>
                          <Input
                            type="number"
                            value={detail.soLuong || 0}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const soLuong = Number(inputValue);

                              // Kiểm tra và chuẩn hóa giá trị input để tránh "01"
                              if (/^0\d+$/.test(inputValue)) {
                                e.target.value = inputValue.replace(/^0+/, ""); // Loại bỏ số 0 đứng đầu
                              }
                              const updatedDetails = field.value.map(
                                (item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        soLuong,
                                        thanhTien:
                                          soLuong * (item.giaNhap || 0),
                                      }
                                    : item
                              );
                              field.onChange(updatedDetails);
                            }}
                          />
                        </TableCell>

                        {/* Sum */}
                        <TableCell>
                          <Input readOnly value={detail.thanhTien || 0} />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            className="text-white bg-red-500 hover:bg-white border-2 border-red-500 hover:text-red-500"
                            onClick={() => {
                              const updatedDetails = [
                                ...form.getValues("detailPurchaseInvoices"),
                              ];
                              updatedDetails.splice(index, 1);
                              form.setValue(
                                "detailPurchaseInvoices",
                                updatedDetails
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Add Feature Button */}
                <Button
                  type="button"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => {
                    const updatedDetails = [
                      ...form.getValues("detailPurchaseInvoices"),
                      { productId: "", giaNhap: 0, soLuong: 0, thanhTien: 0 },
                    ];
                    form.setValue("detailPurchaseInvoices", updatedDetails);
                  }}
                >
                  Add Detail
                </Button>

                <div className="flex flex-row-reverse mt-5 border-t-2 border-b-2 py-5">
                  <div className="w-1/3 flex flex-col gap-4">
                    <div className="flex justify-between font-bold text-gray-500">
                      <div>Tax:</div>
                      <div>-</div>
                    </div>
                    <div className="flex justify-between font-bold text-gray-500">
                      <div>Total:</div>
                      <div>{form.watch("tongTien").toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600 mt-5"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditGrn;
