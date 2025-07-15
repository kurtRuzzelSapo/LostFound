import {
  X,
  MapPin,
  Calendar,
  User,
  Clock,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import type {
  FoundItemWithProfile,
  LostItemWithProfile,
} from "./types/foundItem";
import { motion, AnimatePresence } from "framer-motion";

interface ModalItemProps {
  item: FoundItemWithProfile | LostItemWithProfile;
  type: "found" | "lost";
  isOpen: boolean;
  onClose: () => void;
}

const ModalItem = ({ item, type, isOpen, onClose }: ModalItemProps) => {
  // Removed: const { user } = useAuth();

  const isFoundItem = type === "found";
  const dateLabel = isFoundItem ? "Found" : "Lost";

  // Get the date value safely
  const getDateValue = () => {
    if (isFoundItem) {
      return (item as FoundItemWithProfile).date_found;
    } else {
      return (item as LostItemWithProfile).date_lost;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl mx-0 sm:mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-zinc-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-2 transition z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Section */}
          {item.image_url && (
            <div className="relative h-48 sm:h-64 w-full overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    type === "found"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {type === "found" ? "Found" : "Lost"}
                </span>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {item.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                {item.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Location
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {dateLabel} Date
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(getDateValue()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Posted by
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {item.user_profiles?.full_name || "Anonymous"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Posted
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {item.user_profiles && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
                    {item.user_profiles.full_name && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          {item.user_profiles.full_name}
                        </span>
                      </div>
                    )}
                    {item.user_profiles.email && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700 dark:text-blue-300 break-all">
                          {item.user_profiles.email}
                        </span>
                      </div>
                    )}
                    {item.user_profiles.phone_number && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 dark:text-green-300 break-all">
                          {item.user_profiles.phone_number}
                        </span>
                      </div>
                    )}
                    {item.user_profiles.whatsapp && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 dark:text-green-300 break-all">
                          {item.user_profiles.whatsapp}
                        </span>
                      </div>
                    )}
                  </div>
                  {item.user_profiles.preferred_contact_method && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-blue-500 dark:text-blue-300">
                        Preferred:{" "}
                        {item.user_profiles.preferred_contact_method
                          .charAt(0)
                          .toUpperCase() +
                          item.user_profiles.preferred_contact_method.slice(1)}
                      </span>
                    </div>
                  )}
                  {item.user_profiles.contact_visibility && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Visibility:{" "}
                        {item.user_profiles.contact_visibility.replace(
                          "_",
                          " "
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Safety Tips */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Safety Tips
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Meet in a public place</li>
                <li>• Bring a friend if possible</li>
                <li>• Verify ownership thoroughly</li>
                <li>• Trust your instincts</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalItem;
