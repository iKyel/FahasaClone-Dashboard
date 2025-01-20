"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { grnFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { GoodReceiveNotesService } from "@/services/grn.service";
import { useRouter } from "next/navigation";
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

const AddGrn = () => {
  const router = useRouter();

  const grnService = useMemo(() => GoodReceiveNotesService.getInstance(), []);
  const supplierService = useMemo(() => SupplierService.getInstance(), []);
  const productService = useMemo(() => ProductService.getInstance(), []);

  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const [productPrices, setProductPrices] = useState<Record<string, number>>(
    {}
  );
  const [productNames, setProductNames] = useState<Record<string, string>>({});

  const form = useForm<z.infer<typeof grnFormSchema>>({
    resolver: zodResolver(grnFormSchema),
    defaultValues: {
      purchaseInvoice: {
        supplierId: "",
        ghiChu: "",
        tongTien: 0,
      },
      detailPurchaseInvoices: [],
    },
  });

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

  const getProductPriceAndName = async (productId: string) => {
    if (productPrices[productId] && productNames[productId]) {
      return {
        price: productPrices[productId],
        name: productNames[productId],
      };
    }

    try {
      const response = await productService.getProductPriceAndName(productId);
      const productDetail = response.data?.productDetail;

      const price = productDetail?.giaNhap || 0;
      const name = productDetail?.tenSP || "";

      setProductPrices((prev) => ({ ...prev, [productId]: price }));
      setProductNames((prev) => ({ ...prev, [productId]: name }));

      return { price, name };
    } catch (error) {
      console.error("Error fetching product details:", error);
      return { price: 0, name: "" };
    }
  };

  const calculateSum = async (index: number) => {
    const details = form.getValues("detailPurchaseInvoices");
    const detail = details[index];

    if (detail.productId) {
      const { price, name } = await getProductPriceAndName(detail.productId);
      const updatedDetails = [...details];
      updatedDetails[index].thanhTien = price * (detail.soLuong || 0);
      form.setValue("detailPurchaseInvoices", updatedDetails);
    }
  };

  const updateTotal = () => {
    const details = form.getValues("detailPurchaseInvoices");
    const total = details.reduce((acc, curr) => acc + (curr.thanhTien || 0), 0);
    form.setValue("purchaseInvoice.tongTien", total, { shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof grnFormSchema>) => {
    console.log(values);
    try {
      const response = await grnService.create(values);
      if (response.success && response.data) {
        toast.success("Tạo hóa đơn nhập kho thành công");
        router.push("/grn");
      } else {
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
          <FormField
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
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="purchaseInvoice.ghiChu"
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
                      <TableHead>Product ID</TableHead>
                      <TableHead>Name</TableHead>
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
                            value={detail.productId}
                            onChange={async (e) => {
                              const updatedDetails = [...field.value];
                              const productId = e.target.value;
                              updatedDetails[index] = {
                                ...updatedDetails[index],
                                productId,
                              };
                              field.onChange(updatedDetails);

                              const { price, name } =
                                await getProductPriceAndName(productId);
                              setProductPrices((prev) => ({
                                ...prev,
                                [productId]: price,
                              }));
                              setProductNames((prev) => ({
                                ...prev,
                                [productId]: name,
                              }));

                              const updatedDetail = {
                                ...updatedDetails[index],
                                thanhTien:
                                  price * (updatedDetails[index].soLuong || 0),
                              };
                              updatedDetails[index] = updatedDetail;

                              field.onChange(updatedDetails);
                              updateTotal();
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            readOnly
                            value={productNames[detail.productId] || ""}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            readOnly
                            value={productPrices[detail.productId] || ""}
                          />
                        </TableCell>

                        {/* Quantity */}
                        <TableCell>
                          <Input
                            type="number"
                            value={detail.soLuong || 0}
                            onChange={async (e) => {
                              const updatedDetails = [...field.value];
                              updatedDetails[index] = {
                                ...updatedDetails[index],
                                soLuong: Number(e.target.value),
                              };
                              field.onChange(updatedDetails);
                              await calculateSum(index);
                              updateTotal();
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
                              updateTotal();
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
                      { productId: "", soLuong: 0, thanhTien: 0 },
                    ];
                    form.setValue("detailPurchaseInvoices", updatedDetails);
                    updateTotal();
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
                      <div>
                        {form.watch("purchaseInvoice.tongTien").toFixed(2)}
                      </div>
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

export default AddGrn;
