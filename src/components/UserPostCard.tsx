import { useState } from "react";
import { Edit, Trash2, MapPin, Calendar, User, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import type {
  FoundItemWithProfile,
  LostItemWithProfile,
} from "./types/foundItem";
import { motion } from "framer-motion";

interface UserPostCardProps {
  item: FoundItemWithProfile | LostItemWithProfile;
  type: "found" | "lost";
  onEdit: (item: FoundItemWithProfile | LostItemWithProfile) => void;
  onDelete: (itemId: string) => void;
  onClaim: (item: FoundItemWithProfile | LostItemWithProfile) => void;
  isDeleting: boolean;
}

const UserPostCard = ({
  item,
  type,
  onEdit,
  onDelete,
  onClaim,
  isDeleting,
}: UserPostCardProps) => {
  const [showActions, setShowActions] = useState(false);

  const isFoundItem = type === "found";
  const dateLabel = isFoundItem ? "Found" : "Lost";

  // Type guard for date
  const getDateValue = () => {
    if (isFoundItem) {
      return (item as FoundItemWithProfile).date_found;
    } else {
      return (item as LostItemWithProfile).date_lost;
    }
  };

  // Check if item is already claimed
  const isClaimed = item.is_claimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Claimed Badge */}
      {isClaimed && (
        <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Claimed
        </div>
      )}

      {/* Image */}
      {item.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay with actions */}
          {showActions && !isClaimed && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(item)}
                className="bg-white/90 hover:bg-white text-zinc-900"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => onClaim(item)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Claim
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(item.id)}
                disabled={isDeleting}
                className="bg-red-500/90 hover:bg-red-600 text-white"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
          {/* Show message if claimed */}
          {showActions && isClaimed && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Item has been claimed</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {item.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              type === "found"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}
          >
            {type === "found" ? "Found" : "Lost"}
          </span>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
          {item.description}
        </p>

        {/* Claimed Info */}
        {isClaimed && item.claimed_by && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Claimed by: {item.claimed_by}</span>
            </div>
          
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <MapPin className="w-4 h-4" />
          <span>{item.location}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Calendar className="w-4 h-4" />
          <span>
            {dateLabel}: {new Date(getDateValue()).toLocaleDateString()}
          </span>
        </div>

        {/* Posted by */}
        {item.user_profiles?.full_name && (
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <User className="w-4 h-4" />
            <span>Posted by: {item.user_profiles.full_name}</span>
          </div>
        )}
      </div>

      {/* Action buttons for cards without images */}
      {!item.image_url && showActions && !isClaimed && (
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(item)}
            className="bg-white/90 hover:bg-white text-zinc-900"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onClaim(item)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(item.id)}
            disabled={isDeleting}
            className="bg-red-500/90 hover:bg-red-600 text-white"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Show claimed message for cards without images */}
      {!item.image_url && showActions && isClaimed && (
        <div className="absolute top-2 right-2">
          <div className="bg-emerald-500 text-white px-2 py-1 rounded text-xs">
            Claimed
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserPostCard;