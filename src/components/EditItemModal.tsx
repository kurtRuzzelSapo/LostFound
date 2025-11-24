import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import type {
  FoundItemWithProfile,
  LostItemWithProfile,
} from "./types/foundItem";
import { motion, AnimatePresence } from "framer-motion";

interface EditItemModalProps {
  item: FoundItemWithProfile | LostItemWithProfile | null;
  type: "found" | "lost";
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    updated: FoundItemWithProfile | LostItemWithProfile,
    imageFile?: File | null
  ) => void;
}

// Define proper form data type
interface FormData {
  title: string;
  location: string;
  description: string;
  date: string;
  is_claimed: boolean;
  claimed_by?: string;
}

const EditItemModal = ({
  item,
  type,
  isOpen,
  onClose,
  onSave,
}: EditItemModalProps) => {
  const isFound = type === "found";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: item
      ? {
          title: item.title,
          location: item.location,
          description: item.description,
          is_claimed: item.is_claimed || false, // Ensure boolean
          claimed_by: item.claimed_by,
          date: isFound
            ? (item as FoundItemWithProfile).date_found
            : (item as LostItemWithProfile).date_lost,
        }
      : {
          is_claimed: false, // Default value
        },
  });

  // Watch the is_claimed value to see it in real-time
  const isClaimedValue = watch("is_claimed");

  useEffect(() => {
    if (item) {
      reset({
        title: item.title,
        location: item.location,
        description: item.description,
        claimed_by: item.claimed_by,
        is_claimed: item.is_claimed || false, // Ensure boolean
        date: isFound
          ? (item as FoundItemWithProfile).date_found
          : (item as LostItemWithProfile).date_lost,
      });
      setPreviewUrl(item.image_url || null);
      setSelectedFile(null);
    }
  }, [item, isFound, reset]);

  if (!isOpen || !item) return null;

  const onSubmit = (data: FormData) => {
    const updated = {
      ...item,
      title: data.title,
      location: data.location,
      description: data.description,
      is_claimed: data.is_claimed, // This will now be proper boolean
      claimed_by: data.claimed_by,
      [isFound ? "date_found" : "date_lost"]: data.date,
    };
    onSave(updated, selectedFile);
  };

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
          className="relative w-full max-w-md mx-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-1 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-center mb-4 text-zinc-900 dark:text-zinc-100">
            Edit {isFound ? "Found" : "Lost"} Item
          </h2>
          

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Item Name
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                placeholder="e.g. Wallet, Phone, Keys"
                required
              />
              {errors.title && (
                <p className="text-red-500">Title is required</p>
              )}
            </div>

            {/* Fixed checkbox section */}
            {/* <div className="flex items-center gap-2"> */}
              {/* <input
                type="checkbox"
                {...register("is_claimed")}
                id="is_claimed"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              /> */}
              {/* <label 
                htmlFor="is_claimed"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Is it claimed?
              </label>
            </div>
            {isClaimedValue && (
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                  htmlFor="claimed_by"
                >
                  Claimed By who?
                </label>
                <input
                  type="text"
                  id="claimed_by"
                  {...register("claimed_by", { required: isClaimedValue })}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                  placeholder="Enter the name of the claimer"
                  required={isClaimedValue}
                />
                {errors.claimed_by && (
                  <p className="text-red-500">Claimer name is required</p>
                )}
              </div>
            )} */}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Location
              </label>
              <input
                {...register("location", { required: true })}
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                placeholder="Where was it?"
                required
              />
              {errors.location && (
                <p className="text-red-500">Location is required</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Date & Time of {isClaimedValue ? "Claimed" : isFound ? "Found" : "Lost"}
              </label>
              <input
                type="datetime-local"
                {...register("date", { required: true })}
                 min={new Date().toISOString().slice(0, 16)}
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                required
              />
              {errors.date && <p className="text-red-500">Date is required</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Description
              </label>
              <textarea
                {...register("description", { required: true })}
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                placeholder="Describe the item..."
                required
              />
              {errors.description && (
                <p className="text-red-500">Description is required</p>
              )}
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Image
              </label>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setPreviewUrl(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewUrl(item.image_url || null);
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditItemModal;