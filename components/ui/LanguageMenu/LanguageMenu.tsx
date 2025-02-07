"use client";
import React, { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbWorld } from "react-icons/tb";
import { AppContext } from "@/contexts/AppContext";
import { FaCheck } from "react-icons/fa";

const LanguageMenu = () => {
  const { language, setLanguage } = useContext(AppContext);
  const languages: string[] = ["English", "Vietnamese"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TbWorld className="h-6 w-6 text-gray-700 hover:text-orange-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang, index) => (
          <DropdownMenuItem key={index} onClick={() => setLanguage(lang)}>
            {lang} {lang === language && <FaCheck className="text-sm" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageMenu;
