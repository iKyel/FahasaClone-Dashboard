import React, { createContext, Dispatch, SetStateAction } from "react";

interface SearchContextType {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  searchType: string;
  setSearchType: Dispatch<SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextType>({
  search: "",
  setSearch: () => {},
  searchType: "",
  setSearchType: () => {},
});

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [search, setSearch] = React.useState<string>("");
  const [searchType, setSearchType] = React.useState<string>("");
  return (
    <SearchContext.Provider
      value={{ search, setSearch, searchType, setSearchType }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
