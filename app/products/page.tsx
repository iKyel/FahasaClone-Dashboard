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
import { ArrowUpDown } from "lucide-react";

type Sorting = "ID" | "NAME" | "PRICE" | "COST" | "QUANTITY" | "";
type SortingOrder = "asc" | "desc";

const Product = () => {
  const productService: ProductService = useMemo(
    () => ProductService.getInstance(),
    []
  );

  const { search } = useContext(SearchContext);

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [sorting, setSorting] = useState<Sorting>("");
  const [sortingOrder, setSortingOrder] = useState<SortingOrder>("asc");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (search === "")
          response = await productService.getProducts({
            pageNum: pageNum,
          });
        else {
          response = await productService.searchProducts({
            searchName: search,
            pageNum: pageNum,
          });
        }

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

          if (sorting === "ID") {
            setProducts((prev) =>
              prev.sort((a, b) => {
                const compareResult = a._id?.localeCompare(b?._id || "");
                // Nếu sortingOrder là "asc", sắp xếp tăng dần
                if (sortingOrder === "asc") {
                  return compareResult || 0;
                }
                // Nếu sortingOrder là "desc", sắp xếp giảm dần
                return -1 * (compareResult || 0);
              })
            );
          } else if (sorting === "NAME") {
            setProducts((prev) =>
              prev.sort((a, b) => {
                const compareResult = a.tenSP?.localeCompare(b?.tenSP || "");
                // Nếu sortingOrder là "asc", sắp xếp tăng dần
                if (sortingOrder === "asc") {
                  return compareResult || 0;
                }
                // Nếu sortingOrder là "desc", sắp xếp giảm dần
                return -1 * (compareResult || 0);
              })
            );
          } else if (sorting === "PRICE") {
            setProducts((prev) =>
              prev.sort((a, b) => {
                const compareResult = (a.giaBan || 0) - (b.giaBan || 0); // Sử dụng phép trừ để so sánh giá trị
                // Nếu sortingOrder là "asc", sắp xếp tăng dần
                if (sortingOrder === "asc") {
                  return compareResult;
                }
                // Nếu sortingOrder là "desc", sắp xếp giảm dần
                return -compareResult;
              })
            );
          } else if (sorting === "COST") {
            setProducts((prev) =>
              prev.sort((a, b) => {
                const compareResult = (a.giaNhap || 0) - (b.giaNhap || 0); // Sử dụng phép trừ để so sánh giá trị
                // Nếu sortingOrder là "asc", sắp xếp tăng dần
                if (sortingOrder === "asc") {
                  return compareResult;
                }
                // Nếu sortingOrder là "desc", sắp xếp giảm dần
                return -compareResult;
              })
            );
          } else if (sorting === "QUANTITY") {
            setProducts((prev) =>
              prev.sort((a, b) => {
                const compareResult = (a.soLuong || 0) - (b.soLuong || 0); // Sử dụng phép trừ để so sánh giá trị
                // Nếu sortingOrder là "asc", sắp xếp tăng dần
                if (sortingOrder === "asc") {
                  return compareResult;
                }
                // Nếu sortingOrder là "desc", sắp xếp giảm dần
                return -compareResult;
              })
            );
          }

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
  }, [productService, search, pageNum, sorting, sortingOrder]);

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
            {/* <TableHead>
              Cost{" "}
              <ArrowUpDown
                onClick={() => {
                  setSorting("COST");
                  setSortingOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
                className="inline w-3"
              />
            </TableHead> */}
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
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </TableBody>
      </Table>
      <div className="bottom-1 flex justify-center items-center">
        <Pagination>
          <PaginationContent>
            {/* Nút Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPageNum((num) => num - 1)}
                tabIndex={pageNum <= 1 ? -1 : undefined}
                aria-disabled={pageNum === 1}
                className={
                  pageNum <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {/* Hiển thị các trang */}
            {Array.from({ length: totalPage }, (_, index) => index + 1)
              .filter((page) => {
                // Hiển thị trang đầu tiên, trang cuối cùng và 3 trang gần nhất xung quanh trang hiện tại
                return (
                  page === 1 ||
                  page === totalPage ||
                  (page >= pageNum - 1 && page <= pageNum + 1)
                );
              })
              .map((page, idx, visiblePages) => (
                <React.Fragment key={page}>
                  {/* Hiển thị dấu 3 chấm nếu có khoảng cách giữa các trang */}
                  {idx > 0 && page > visiblePages[idx - 1] + 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Hiển thị trang */}
                  <PaginationItem
                    style={
                      page === pageNum
                        ? {
                            backgroundColor: "orange",
                            borderRadius: "5px",
                            border: "none",
                          }
                        : {}
                    }
                  >
                    <PaginationLink onClick={() => setPageNum(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              ))}

            {/* Nút Next */}
            <PaginationItem>
              <PaginationNext
                tabIndex={pageNum >= totalPage ? -1 : undefined}
                aria-disabled={pageNum === totalPage}
                className={
                  pageNum >= totalPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={() => setPageNum((num) => num + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Product;
