import { ProductDTO } from "@/types/product.type";
import React, { useState } from "react";
import { TableCell, TableRow } from "../table";
import { Checkbox } from "../checkbox";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { Button } from "../button";
import { useRouter } from "next/navigation";

const ProductItem = ({ product }: { product: ProductDTO }) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <TableRow className={isOpen ? "border-2 border-gray-500" : ""}>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>
          <Image
            src="/assets/profile.jpg"
            alt=""
            width={400}
            height={400}
            className="w-7 h-7 rounded "
          />
        </TableCell>
        <TableCell>{product._id}</TableCell>
        <TableCell>{product.tenSP}</TableCell>
        <TableCell>{product.giaBan}000</TableCell>
        <TableCell>{product.giaNhap}000</TableCell>
        <TableCell>{product.soLuong}</TableCell>
        <TableCell className="flex justify-end items-center">
          <button className="mt-2" onClick={toggleAccordion}>
            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow className="border-2 border-gray-500">
          <TableCell colSpan={8}>
            <div className="flex justify-center items-center gap-3">
              <div className="flex-1 flex justify-center items-center">
                <Image
                  src="/assets/profile.jpg"
                  alt=""
                  width={400}
                  height={400}
                  className="w-48 h-48 rounded-lg"
                />
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <Label className="text-gray-500">Name</Label>
                <input
                  value={product.tenSP}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
                <Label className="text-gray-500">Sell Price</Label>
                <input
                  value={product.giaBan}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
                <Label className="text-gray-500">Cost</Label>
                <input
                  value={product.giaNhap}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <Label className="text-gray-500">Quantity</Label>
                <input
                  value={product.soLuong}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
                <Label className="text-gray-500">Size(L-W-H)</Label>
                <input
                  value={`${product.kichThuoc.dai}-${product.kichThuoc.rong}-${product.kichThuoc.cao}`}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
                <Label className="text-gray-500">Weight</Label>
                <input
                  value={product.trongLuong}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <Label className="text-gray-500">Created At</Label>
                <input
                  value={product.createdAt}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
                <Label className="text-gray-500">Updated At</Label>
                <input
                  value={product.updatedAt}
                  className="text-lg bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:outline-none"
                  disabled
                />
              </div>
            </div>
            <div className="flex justify-end mt-5 gap-3">
              <Button
                className="bg-yellow-300 hover:bg-white hover:text-yellow-400 border-2 border-yellow-300"
                onClick={() => {
                  router.push(`/products/${product._id}`);
                }}
              >
                Edit
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ProductItem;
