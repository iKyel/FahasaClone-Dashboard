import LanguageMenu from "@/components/ui/LanguageMenu/LanguageMenu";
import ProfileComponent from "@/components/ui/Profile/ProfileComponent";
import SearchContext from "@/contexts/SearchContext";
import { Bell, Search } from "lucide-react";
import React, { useContext, useState } from "react";

export default function NavbarComponent() {
  const [localSearch, setLocalSearch] = useState<string>("");
  const { setSearch } = useContext(SearchContext);
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center flex-grow">
        <button
          className="bg-transparent text-gray-700 rounded-l-md p-2"
          onClick={() => {
            setSearch(localSearch);
          }}
        >
          <Search />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="border-none rounded-r-md p-2 focus:outline-none focus:border-orange-400 w-1/2"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-700 hover:text-orange-400" />
        <LanguageMenu />
        <div className="flex items-center justify-center">
          {/* <Image
            src="/assets/profile.jpg" // Đường dẫn tới ảnh đại diện
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full border border-gray-300 object-cover"
          /> */}
          <ProfileComponent />
        </div>
      </div>
    </nav>
  );
}
