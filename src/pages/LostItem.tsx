import { SearchBar } from "@/components/search-bar";
import LostItemLayout from "./layout/LostItemLayout";
import { useState } from "react";


export default function LostItem() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="w-full h-full p-6">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      {/* Grid of items */}
      <LostItemLayout searchQuery={searchQuery} />
    </div>
  );
}
