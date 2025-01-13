"use client";

import React, { useContext, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductDTO } from "@/types/product.type";
import ProductItem from "@/components/ui/ProductItem/ProductItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductService } from "@/services/product.service";
import SearchContext from "@/contexts/SearchContext";

const Product = () => {
  const productService: ProductService = useMemo(
    () => ProductService.getInstance(),
    []
  );

  const { search } = useContext(SearchContext);

  // alert(productService);
  const [products, setProducts] = React.useState<ProductDTO[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (search === "") response = await productService.getProducts();
        else
          response = await productService.searchProducts({
            searchName: search,
            pageNum: 1,
          });

        console.log(response);
        if (response.success) {
          setProducts(
            response.data?.products.map((product) => ({
              ...product,
              createdAt:
                product.createdAt &&
                new Date(product.createdAt).toLocaleDateString(),
              updatedAt:
                product.updatedAt &&
                new Date(product.updatedAt).toLocaleDateString(),
            })) || []
          );
        } else {
          console.log(response.error?.message || "Failed to fetch products");
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred while fetching products:",
          error
        );
      }
    };

    fetchProducts();
  }, [productService, search]);

  return (
    <>
      <div className="flex flex-row-reverse mb-5">
        <Button
          className="bg-green-500 hover:bg-white hover:text-green-500 border-2 border-green-500"
          asChild
        >
          <Link href="/products/add-product">Add</Link>
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="w-1/3">Name</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Product;
