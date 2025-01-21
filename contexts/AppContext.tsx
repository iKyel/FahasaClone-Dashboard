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
import { usePathname } from "next/navigation";

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
  const path = usePathname();

  useEffect(() => {
    const currentPath = path;
    const matchedItem = items.find((item) => item.url === currentPath)?.title;
    if (matchedItem) {
      // alert(matchedItem)
      setActiveItem(matchedItem);
    }
  }, [path]);

  return (
    <AppContext.Provider
      value={{ language, setLanguage, activeItem, setActiveItem }}
    >
      {children}
    </AppContext.Provider>
  );
};
