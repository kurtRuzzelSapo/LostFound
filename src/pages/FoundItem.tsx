// import FoundItemCard from "@/components/found-item-card";
import { SearchBar } from "@/components/search-bar"
// import { foundItems } from "@/utils/foundItemsData";
import FoundItemLayout from "./layout/FoundItemLayout";
import { useState } from "react";

const FoundItem = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="w-full h-full p-6">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      {/* Grid of items */}
      <FoundItemLayout searchQuery={searchQuery} />
    </div>
  );
};

export default FoundItem;
