"use client";
import { createContext, Dispatch, SetStateAction, useState } from "react";

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
  return (
    <AppContext.Provider
      value={{ language, setLanguage, activeItem, setActiveItem }}
    >
      {children}
    </AppContext.Provider>
  );
};
