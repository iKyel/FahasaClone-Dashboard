"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { items } from "@/components/layout/Sidebar/SidebarItems";

interface AppContextType {
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  activeItem: string;
  setActiveItem: Dispatch<SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType>({
  language: "",
  setLanguage: () => {},
  activeItem: "",
  setActiveItem: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>("English");
  const [activeItem, setActiveItem] = useState<string>("Home");
  // const router = useRouter();

  // useEffect(() => {
  //   // Cập nhật `activeItem` dựa trên `pathName`
  //   const currentPath = router.pathname;
  //   const matchedItem = items.find((item) => item.url === currentPath)?.title;
  //   if (matchedItem) {
  //     setActiveItem(matchedItem);
  //   }
  // }, [router.pathname]); // Chạy lại khi `pathName` thay đổi

  return (
    <AppContext.Provider
      value={{ language, setLanguage, activeItem, setActiveItem }}
    >
      {children}
    </AppContext.Provider>
  );
};
