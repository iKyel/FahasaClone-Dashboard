"use client";

import { Label } from "@/components/ui/label";
import React, { useEffect, useMemo, useState } from "react";
import { GoodReceiveNotesService } from "@/services/grn.service";
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

const GrnDetails = () => {
  const router = useRouter();
  const params = useParams();

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
  }>();

  const grnId = params.grnId as string;

  useEffect(() => {
    const fetchDetail = async (id: string) => {
      try {
        const response = await grnService.getGrnDetails(id);
        if (response.success) {
          setGrnDetail({
            purchaseInvoice: response.data?.purchaseInvoice || {
              _id: "",
              nhanVienId: "",
              trangThaiDon: "",
              ghiChu: "",
              tongTien: 0,
              createdAt: "",
              supplierId: "",
              ten: "",
            },
            detailPurchaseInvoices: response.data?.detailPurchaseInvoices || [],
          });
        }
      } catch (error) {
        console.error("Error fetching GRN details:", error);
      }
    };

    fetchDetail(grnId);
  }, [grnService, grnId]);

  if (!grnDetail) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="border flex flex-col justify-between items-center rounded-lg pb-5">
        <div className="flex flex-row justify-between mb-5 p-5 w-[95%]">
          <Image
            src={`/assets/logo.png`}
            width={300}
            height={300}
            alt="Logo"
            className="h-8 w-40"
          />
          <div className="flex flex-col justify-end gap-3">
            <Label className="text-2xl font-bold text-end">
              Good Receive Notes
            </Label>
            <Label className="text-xl font-semibold text-end">
              Fahasa Book Store
            </Label>
            <Label className="text-end text-md text-gray-400">
              338 Xa Dan Street, Dong Da District, Hanoi, Vietnam
            </Label>
          </div>
        </div>

        {/* Purchase Invoice Information */}
        <div className="mb-5 p-5 border-y flex justify-between w-[95%]">
          <div className="text-lg font-semibold text-gray-500">
            Invoice Information
            <p className="font-bold text-black mt-3 text-xl">
              {grnDetail.purchaseInvoice.ten}
            </p>
          </div>
          <div className="mt-3 space-y-2 text-gray-500">
            <p>
              <strong>ID: </strong> {grnDetail.purchaseInvoice._id}
            </p>

            <div className="flex gap-3 items-center">
              <strong>Status:</strong>{" "}
              {grnDetail.purchaseInvoice.trangThaiDon === "Chờ xác nhận" ? (
                <>
                  <p className="bg-blue-200 text-blue-700 font-semibold rounded-l-2xl rounded-r-2xl p-1 flex items-center justify-center gap-1">
                    Processing <TbReload />
                  </p>
                  2
                </>
              ) : grnDetail.purchaseInvoice.trangThaiDon === "Hoàn thành" ? (
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
            <p>
              <strong>Notes:</strong> {grnDetail.purchaseInvoice.ghiChu}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(grnDetail.purchaseInvoice.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Detail Purchase Invoices */}
        <div className="p-5 border rounded-lg shadow w-[95%]">
          <Label className="text-lg font-bold">Products</Label>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Sum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grnDetail.detailPurchaseInvoices.map((detail) => (
                <TableRow key={detail._id}>
                  <TableCell>{detail.tenSP}</TableCell>
                  <TableCell>
                    {Number(detail.giaNhap).toLocaleString()}Đ
                  </TableCell>
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
                  <TableCell>{detail.thanhTien.toLocaleString()}Đ</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong className="text-lg">Total:</strong>{" "}
                </TableCell>
                <TableCell className="text-lg font-bold">
                  {grnDetail.purchaseInvoice.tongTien.toLocaleString()}Đ
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => router.push("/grn")}
        >
          Back to List
        </Button>
      </div>
    </>
  );
};

export default GrnDetails;
