"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Product = () => {
  const productService: ProductService = useMemo(
    () => ProductService.getInstance(),
    []
  );

  const { search } = useContext(SearchContext);

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (search === "") response = await productService.getProducts({
          pageNum: pageNum
        });
        else
          response = await productService.searchProducts({
            searchName: search,
            pageNum: pageNum,
          });

        console.log(response.data);
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

          if (response.data?.totalPage) setTotalPage(response.data?.totalPage);
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
  }, [productService, search, pageNum]);

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
      <div className="bottom-1 flex justify-center items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  setPageNum((num) => num - 1);
                }}
                tabIndex={pageNum <= 1 ? -1 : undefined}
                aria-disabled={pageNum === 1}
                className={
                  pageNum <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPage }, (_, index) => index + 1).map(
              (page) => (
                <PaginationItem
                  key={page}
                  className={page === pageNum ? `bg-yellow` : ``}
                >
                  <PaginationLink onClick={() => setPageNum(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                tabIndex={pageNum >= totalPage ? -1 : undefined}
                aria-disabled={pageNum === totalPage}
                className={
                  pageNum >= totalPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={() => {
                  setPageNum((num) => num + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Product;
