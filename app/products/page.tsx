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
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Sorting = "ID" | "NAME" | "PRICE" | "COST" | "QUANTITY" | "";
type SortingOrder = "asc" | "desc";

const Product = () => {
  const { search } = useContext(SearchContext);
  const [pageNum, setPageNum] = useState<number>(1);
  const [sorting, setSorting] = useState<Sorting>("");
  const [sortingOrder, setSortingOrder] = useState<SortingOrder>("asc");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      const productService = ProductService.getInstance();
      const response =
        search === ""
          ? await productService.getProducts({ pageNum })
          : await productService.searchProducts({
              searchName: search,
              pageNum: 1,
            });
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch products");
      }
      return response.data;
    },
  });

  useEffect(() => {
    refetch();
  }, [pageNum, search, refetch]);

  const sortedProducts = useMemo(() => {
    if (!data?.products) return [];
    const sorted = [...data.products];
    // Apply sorting logic
    if (sorting) {
      sorted.sort((a, b) => {
        let compareResult = 0;
        switch (sorting) {
          case "ID":
            compareResult = a._id?.localeCompare(b?._id || "") || 0;
            break;
          case "NAME":
            compareResult = a.tenSP?.localeCompare(b?.tenSP || "") || 0;
            break;
          case "PRICE":
            compareResult = (a.giaBan || 0) - (b.giaBan || 0);
            break;
          case "QUANTITY":
            compareResult = (a.soLuong || 0) - (b.soLuong || 0);
            break;
        }
        return sortingOrder === "asc" ? compareResult : -compareResult;
      });
    }
    return sorted;
  }, [data?.products, sorting, sortingOrder]);

  const visiblePages = useMemo(() => {
    return Array.from(
      { length: data?.totalPage || 1 },
      (_, index) => index + 1
    ).filter(
      (page) =>
        page === 1 ||
        page === data?.totalPage ||
        (page >= pageNum - 1 && page <= pageNum + 1)
    );
  }, [data?.totalPage, pageNum]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products.</div>;

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
        <TableCaption>A list of your recent products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="flex items-center gap-2">
              ID{" "}
              <ArrowUpDown
                onClick={() => {
                  setSorting("ID");
                  setSortingOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
                className="inline w-3"
              />
            </TableHead>
            <TableHead className="w-1/3">
              Name{" "}
              <ArrowUpDown
                onClick={() => {
                  setSorting("NAME");
                  setSortingOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
                className="inline w-3"
              />
            </TableHead>
            <TableHead>
              Selling Price{" "}
              <ArrowUpDown
                onClick={() => {
                  setSorting("PRICE");
                  setSortingOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
                className="inline w-3"
              />
            </TableHead>
            <TableHead>
              Quantity{" "}
              <ArrowUpDown
                onClick={() => {
                  setSorting("QUANTITY");
                  setSortingOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
                className="inline w-3"
              />
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </TableBody>
      </Table>
      <div className="bottom-1 flex justify-center items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPageNum((num) => Math.max(num - 1, 1))}
                aria-disabled={pageNum === 1}
              />
            </PaginationItem>
            {visiblePages.map((page, idx, arr) => (
              <React.Fragment key={page}>
                {idx > 0 && page > arr[idx - 1] + 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setPageNum(page)}
                    className={page === pageNum ? `bg-orange-400` : ""}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  setPageNum((num) => Math.min(num + 1, data?.totalPage || 1));
                }}
                aria-disabled={pageNum === data?.totalPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Product;
