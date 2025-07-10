import type { FoundItem } from "./types/foundItem";

const FoundItemCard = ({ item }: { item: FoundItem }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}
      <h2 className="text-lg font-bold">{item.title}</h2>
      <p className="text-gray-600">{item.description}</p>
      <span className="text-xs text-gray-400">Found: {item.date_found}</span>
    </div>
  );
};

export default FoundItemCard;
