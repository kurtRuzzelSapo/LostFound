import type { LostItem } from "./types/lostItem";

const LostItemCard = ({item} : {item: LostItem}) => {
  return (
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">  
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          )}
          <h2 className="text-lg font-bold">{item.title}</h2>
          <p className="text-gray-600">{item.description}</p>
          <span className="text-xs text-gray-400">Lost: {item.dateLost}</span>
    </div>   
  )
}

export default LostItemCard;
