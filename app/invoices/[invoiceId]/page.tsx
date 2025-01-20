"use client";

import { Label } from "@/components/ui/label";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TbCheck, TbLockCancel, TbReload } from "react-icons/tb";
import { InvoiceService } from "@/services/invoice.service";

const InvoiceDetails = () => {
  const router = useRouter();
  const params = useParams();

  const invoiceService = useMemo(() => InvoiceService.getInstance(), []);

  const [invoiceDetail, setInvoiceDetail] = useState<{
    saleInvoice: {
      _id: string;
      khachHangId: string;
      trangThaiDon: string;
      ptVanChuyen: string;
      ptThanhToan: string;
      ghiChu: string;
      tongTien: number;
      diaChiDatHang: string;
      createdAt: string;
    };
    detailPurchaseInvoices: Array<{
      _id: string;
      soLuong: number;
      thanhTien: number;
      sanPhamId: string;
      tenSP: string;
      giaBan: number;
      imageUrl: string;
    }>;
  }>();

  const [total, setTotal] = useState<number>(0);

  const invoiceId = params.invoiceId as string;

  useEffect(() => {
    const fetchDetail = async (id: string) => {
      try {
        const response = await invoiceService.getInvoiceDetailById(id);
        if (response.success) {
          setInvoiceDetail({
            saleInvoice: response.data?.saleInvoice || {
              _id: "678d4023977c159f823abe8a",
              khachHangId: "677a34f4cb1f5350a58da9a7",
              trangThaiDon: "Chờ xác nhận",
              ptVanChuyen: "Giao hàng tiêu chuẩn",
              ptThanhToan: "Tiền mặt khi nhận hàng",
              ghiChu: "",
              tongTien: 67200,
              diaChiDatHang:
                "SN 123, ngõ 14,, Phường Phú Diễn, Quận Bắc Từ Liêm, Thành phố Hà Nội",
              createdAt: "2025-01-19T18:10:43.159Z",
            },
            detailPurchaseInvoices: response.data?.detailSaleInvoices || [],
          });

          setTotal(
            response.data?.detailSaleInvoices.reduce(
              (sum, item) => sum + item.giaBan * item.soLuong,
              0
            ) || 0
          );
        }
      } catch (error) {
        console.error("Error fetching GRN details:", error);
      }
    };

    fetchDetail(invoiceId);
  }, [invoiceService, invoiceId]);

  if (!invoiceDetail) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="border flex flex-col justify-between items-center rounded-lg pb-5">
        <div className="flex flex-row justify-between items-start mb-5 p-5 w-[95%]">
          <div className="flex flex-col justify-between gap-5">
            <Image
              src={`/assets/logo.png`}
              width={300}
              height={300}
              alt="Logo"
              className="h-8 w-40"
            />
            <p className="font-bold text-black mt-3 text-xl">
              #{invoiceDetail.saleInvoice._id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(invoiceDetail.saleInvoice.createdAt).toLocaleString()}
            </p>
            <div className="flex gap-3 items-center">
              <strong>Status:</strong>{" "}
              {invoiceDetail.saleInvoice.trangThaiDon === "Chờ xác nhận" ? (
                <>
                  <p className="bg-blue-200 text-blue-700 font-semibold rounded-l-2xl rounded-r-2xl p-1 flex items-center justify-center gap-1">
                    Processing <TbReload />
                  </p>
                </>
              ) : invoiceDetail.saleInvoice.trangThaiDon === "Hoàn thành" ? (
                <>
                  <p className="bg-green-200 text-green-700 font-semibold rounded-l-2xl rounded-r-2xl p-1 flex items-center justify-center gap-1">
                    Completed <TbCheck />
                  </p>
                </>
              ) : (
                <>
                  <p className="bg-red-200 text-red-700 font-semibold rounded-l-2xl rounded-r-2xl p-1 flex items-center justify-center gap-1">
                    Canceled <TbLockCancel />
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-3">
            <Label className="text-2xl font-bold text-end">Invoice</Label>
            <Label className="text-xl font-semibold text-end">
              Fahasa Book Store
            </Label>
            <Label className="text-end text-md text-gray-400">
              338 Xa Dan Street, Dong Da District, Hanoi, Vietnam
            </Label>
          </div>
        </div>

        {/* Purchase Invoice Information */}
        <div className="mb-5 p-5 border-y flex justify-between flex-col w-[95%]">
          <div className="text-xl font-semibold text-gray-700">
            Invoice Information
          </div>
          <div className="mt-3 text-gray-500 flex gap-3">
            <div className="w-1/3 flex flex-col gap-2">
              <p className="text-lg font-semibold">Billing Address</p>
              <p>{invoiceDetail.saleInvoice.khachHangId}</p>
              <p>{invoiceDetail.saleInvoice.diaChiDatHang}</p>
              <p className="text-blue-600">
                <strong className="text-gray-500">Phone:</strong> {`0123456789`}
              </p>
            </div>
            <div className="w-1/3 flex flex-col gap-2">
              <p className="text-lg font-semibold">Shipping Address</p>
              <p>{invoiceDetail.saleInvoice.diaChiDatHang}</p>
              <p>(20000.00 Shipping)</p>
            </div>
            <div className="w-1/3 flex flex-col gap-2">
              <p className="text-lg font-semibold">Payment Method</p>
              <p>{invoiceDetail.saleInvoice.ptThanhToan}</p>
            </div>
          </div>
        </div>

        {/* Detail Purchase Invoices */}
        <div className="p-5 border rounded-lg shadow w-[95%]">
          <Label className="text-lg font-bold">Products</Label>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Sum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceDetail.detailPurchaseInvoices.map((detail) => (
                <TableRow key={detail._id}>
                  <TableCell>{detail.tenSP}</TableCell>
                  <TableCell>{Number(detail.giaBan).toFixed(2)}</TableCell>
                  <TableCell>{detail.soLuong}</TableCell>
                  <TableCell>
                    {detail.imageUrl && (
                      <Image
                        width={40}
                        height={40}
                        src={detail.imageUrl}
                        alt={detail.tenSP}
                        className="w-12 h-12 object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {(detail.giaBan * detail.soLuong).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong className="text-lg">Subtotal:</strong>{" "}
                </TableCell>
                <TableCell className="text-lg font-bold">
                  {total.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong className="text-lg">Sale:</strong>{" "}
                </TableCell>
                <TableCell className="text-lg font-bold">
                  {(total - invoiceDetail.saleInvoice.tongTien).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong className="text-lg">Total:</strong>{" "}
                </TableCell>
                <TableCell className="text-lg font-bold">
                  {invoiceDetail.saleInvoice.tongTien.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => router.push("/invoices")}
        >
          Back to List
        </Button>
      </div>
    </>
  );
};

export default InvoiceDetails;
