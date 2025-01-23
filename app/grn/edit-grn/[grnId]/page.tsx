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

const EditGrn = () => {
  const router = useRouter();

  const grnService = useMemo(() => GoodReceiveNotesService.getInstance(), []);

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
    message: string;
  }>();

  const params = useParams();
  const grnId = params.grnId as string;

  const form = useForm<z.infer<typeof updateGrnFormSchema>>({
    resolver: zodResolver(updateGrnFormSchema),
    defaultValues: {
      ghiChu: grnDetail?.purchaseInvoice.ghiChu || "",
      tongTien: grnDetail?.purchaseInvoice.tongTien || 0,
      detailPurchaseInvoices: grnDetail?.detailPurchaseInvoices || [],
    },
  });

  const { setValue } = form;

  useEffect(() => {
    const fetchGrnDetal = async (id: string) => {
      try {
        const response = await grnService.getGrnDetails(id);
        if (response.success && response.data) {
          const purchaseInvoice = response.data.purchaseInvoice;
          setGrnDetail(response.data);
          setValue("ghiChu", purchaseInvoice.ghiChu);
          setValue("tongTien", purchaseInvoice.tongTien);
          const detailPurchaseInvoices = response.data.detailPurchaseInvoices;
          setValue(
            "detailPurchaseInvoices",
            detailPurchaseInvoices.map((detail) => ({
              _id: detail._id,
              giaNhap: detail.giaNhap,
              soLuong: detail.soLuong,
              thanhTien: detail.thanhTien,
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

    if (grnId) {
      fetchGrnDetal(grnId);
    }
  }, [grnService, grnId, setValue]);

  //   useEffect(() => {
  //     const fetchProductsList = async () => {
  //       try {
  //         const response = await productService.getAllProducts();
  //         if (response.success) {
  //           setProducts(
  //             response.data?.products.sort((a, b) =>
  //               a.tenSP.localeCompare(b.tenSP)
  //             ) || []
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Error fetching suppliers:", error);
  //       }
  //     };

  //     fetchProductsList();
  //   }, [productService]);

  const details = form.watch("detailPurchaseInvoices");

  useEffect(() => {
    const total = details.reduce(
      (sum, detail) => sum + (detail.thanhTien || 0),
      0
    );
    form.setValue("tongTien", total);
  }, [details, form]);

  const onSubmit = async (values: z.infer<typeof updateGrnFormSchema>) => {
    console.log(values);
    try {
      const response = await grnService.update(grnId, values);
      if (response.success && response.data) {
        toast.success("Sửa hóa đơn nhập kho thành công");
        router.push("/grn");
      } else {
        toast.error("Lỗi sửa hóa đơn");
        console.log(response.error);
      }
    } catch (error) {
      console.error("Error creating GRN:", error);
      toast.error("Error while creating new good receive note");
    }
  };

  return (
    <>
      <div className="flex flex-row mb-5">
        <Label className="text-2xl">Add Goods Receive Note</Label>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Supplier Selection */}
          {/* <FormField
            control={form.control}
            name="purchaseInvoice.supplierId"
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
          /> */}

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
                          <Input
                            readOnly
                            value={
                              grnDetail?.detailPurchaseInvoices[index].tenSP
                            }
                          />
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
                {/* <Button
                  type="button"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => {
                    const updatedDetails = [
                      ...form.getValues("detailPurchaseInvoices"),
                      { _id: "", giaNhap: 0, soLuong: 0, thanhTien: 0 },
                    ];
                    form.setValue("detailPurchaseInvoices", updatedDetails);
                  }}
                >
                  Add Detail
                </Button> */}

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
