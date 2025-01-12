"use client";
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
import { ProductService } from "@/services/product.service";
import { ProductDTO } from "@/types/product.type";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const ProductDetail = () => {
  const productService: ProductService = useMemo(
    () => ProductService.getInstance(),
    []
  );

  const [product, setProduct] = useState<ProductDTO>();

  const params = useParams();
  const productId = params.productId as string;

  useEffect(() => {
    const fetchProductDetail = async (id: string) => {
      try {
        const response = await productService.getProductDetail(id);
        if (response.success && response.data) {
          setProduct(response.data.productDetail);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (productId) {
      fetchProductDetail(productId);
    }
  }, [productService, productId]);

  return (
    <>
      <div className="flex flex-row mb-5">
        <Label className="text-2xl">Product Detail</Label>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col gap-3">
          <Label>Name</Label>
          <Input className="w-3/4" value={product?.tenSP} />
          <Label>Sell Price</Label>
          <Input className="w-3/4" value={product?.giaBan} />
          <Label>Cost</Label>
          <Input className="w-3/4" value={product?.giaNhap} />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Label>Quantity</Label>
          <Input className="w-3/4" value={product?.soLuong} />
          <Label>Weight</Label>
          <Input className="w-3/4" value={product?.trongLuong} />
          <Label>Category</Label>
          <Input className="w-3/4" value={product?.danhMucId} />
        </div>
      </div>
      <div className="mt-5">
        <Label>Features</Label>
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
                <TableCell>{feature.giaTri}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProductDetail;
