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
    // allowedRoles: ["NV", "QTV"],
  },
  {
    title: "Customer",
    url: "/customers",
    icon: User,
    // allowedRoles: ["NV", "QTV"],
  },
  {
    title: "Product",
    url: "/products",
    icon: FaBook,
    // allowedRoles: ["NV", "QTV"],
  },
  {
    title: "Invoice",
    url: "/invoices",
    icon: FaShoppingCart,
    // allowedRoles: ["NV", "QTV"],
  },
  {
    title: "Staff",
    url: "/staffs",
    icon: ShieldCheckIcon,
    // allowedRoles: ["QTV"],
  },
  {
    title: "Supplier",
    url: "/suppliers",
    icon: Container,
    // allowedRoles: ["QTV", "NV"],
  },
  {
    title: "Goods received note",
    url: "/grn",
    icon: FaFileInvoice,
    // allowedRoles: ["QTV", "NV"],
  },
  {
    title: "Category",
    url: "/categories",
    icon: TbCategory,
    // allowedRoles: ["NV", "QTV"],
  },
  {
    title: "Comment",
    url: "/comments",
    icon: FaComment,
    // allowedRoles: ["QTV", "NV"],
  },
  {
    title: "Feature",
    url: "/features",
    icon: Star,
    // allowedRoles: ["QTV", "NV"],
  },
];
