import { Container, Home, ShieldCheckIcon, Star, User } from "lucide-react";
import {
  FaBook,
  FaComment,
  FaFileInvoice,
  FaShoppingCart,
} from "react-icons/fa";
import { TbCategory } from "react-icons/tb";

export const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Customer",
    url: "/customers",
    icon: User,
  },
  {
    title: "Product",
    url: "/products",
    icon: FaBook,
  },
  {
    title: "Invoice",
    url: "/invoices",
    icon: FaShoppingCart,
  },
  {
    title: "Staff",
    url: "/staffs",
    icon: ShieldCheckIcon,
  },
  {
    title: "Supplier",
    url: "/suppliers",
    icon: Container,
  },
  {
    title: "Goods received note",
    url: "/grn",
    icon: FaFileInvoice,
  },
  {
    title: "Category",
    url: "/categories",
    icon: TbCategory,
  },
  {
    title: "Comment",
    url: "/comments",
    icon: FaComment,
  },
  {
    title: "Feature",
    url: "/features",
    icon: Star,
  },
];
