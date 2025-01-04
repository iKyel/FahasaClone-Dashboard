import LanguageMenu from "@/components/ui/LanguageMenu/LanguageMenu";
import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function NavbarComponent() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center flex-grow">
        <button className="bg-transparent text-gray-700 rounded-l-md p-2 hover:bg-orange-200 transition-colors">
          <Search />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="border-none rounded-r-md p-2 focus:outline-none focus:border-orange-400 w-1/2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button>
          <Bell className="h-6 w-6 text-gray-700 hover:text-orange-400" />
        </button>
        <LanguageMenu />
        <div className="flex items-center justify-center">
          <Image
            src="/assets/profile.jpg" // Đường dẫn tới ảnh đại diện
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full border border-gray-300 object-cover"
          />
        </div>
      </div>
    </nav>
  );
}
