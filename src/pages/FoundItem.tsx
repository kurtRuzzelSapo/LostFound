import FoundItemCard from "@/components/found-item-card";
import { SearchBar } from "@/components/search-bar"
import { foundItems } from "@/utils/foundItemsData";

const FoundItem = () => {
  return (
    <div className="w-full h-full p-6">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar onSearch={() => {}} />
      </div>
      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foundItems.map((item) => (
          <FoundItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FoundItem;
