import { MapPinPlusIcon, X, UploadCloud } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FoundItem } from "./types/foundItem";
import { supabase } from "@/supabase-client";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

// Create your API function outside the component:
const createPost = async (post: FoundItem, imageFile: File, userId: string) => {
  const filePath = `${userId}/${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("found-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("found-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("found-item")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

const CreateFoundItem = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FoundItem>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Get current year dates
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1).toISOString().split('T')[0]; // January 1st of current year

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: FoundItem; imageFile: File; userId: string }) =>
      createPost(data.post, data.imageFile, data.userId),
    onSuccess: () => {
      toast.success("Post created!");
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      handleClose();
    },
    onError: (err: string) => {
      console.error(err);
      toast.error("Something went wrong.");
    },
  });

  const onSubmit = (formData: FoundItem) => {
    if (!selectedFile) return;
    if (!user?.id) {
      toast.error("You must be logged in to post a found item.");
      return;
    }
    mutate({
      post: {
        ...formData,
        user_id: user.id,
      },
      imageFile: selectedFile,
      userId: user.id,
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  const handleOpen = () => setShowModal(true);
  
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => setShowModal(false), 300);
  };

  // Animate in after mount
  useEffect(() => {
    if (showModal) setTimeout(() => setAnimateIn(true), 10);
    else setAnimateIn(false);
  }, [showModal]);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      {/* Modern Floating Action Button */}
      <Button
        className="fixed bg-green-600 bottom-6 right-6 z-50 flex items-center gap-2 p-3 rounded-full shadow-lg text-white text-base hover:scale-105 focus:ring-2 focus:ring-emerald-400 transition"
        variant="default"
        onClick={handleOpen}
        aria-label="Report a found item"
      >
        <MapPinPlusIcon className="w-6 h-6" />
      </Button>

      {/* Modal Overlay and Card */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div
            className={`relative w-full max-w-sm mx-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${
              animateIn ? "animate-fade-in-scale" : "opacity-0 scale-95"
            } p-4 flex flex-col gap-4`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-1 transition"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-center mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight">
              Report a Found Item
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-name"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Item Name
                </label>
                <input
                  {...register("title", { required: true })}
                  id="item-name"
                  name="title"
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  placeholder="e.g. Wallet, Phone, Keys"
                  required
                />
                {errors.title && (
                  <p className="text-red-500">Title is required</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-location"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Location
                </label>
                <input
                  {...register("location", { required: true })}
                  id="item-location"
                  name="location"
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  placeholder="Where did you find it?"
                  required
                />
                {errors.location && (
                  <p className="text-red-500">location is required</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-datetime"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Date & Time Found
                </label>
                <input
                  id="item-datetime"
                  type="datetime-local"
                  {...register("date_found", { required: true })}
                  min={`${firstDayOfYear}T00:00`} // January 1st of current year
                  max={`${today}T23:59`} // Today
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  required
                />
                {errors.date_found && (
                  <p className="text-red-500">Date is required</p>
                )}
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select a date from this year (January {currentYear} to today)
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-description"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  id="item-description"
                  name="description"
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  placeholder="Describe the item in detail..."
                  required
                />
                {errors.description && (
                  <p className="text-red-500">Description is required</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1 block">
                  Upload Photo
                </label>

                <label className="flex items-center justify-center border-2 border-dashed border-emerald-400 rounded-xl bg-emerald-50 dark:bg-zinc-800 h-32 sm:h-40 cursor-pointer hover:bg-emerald-100 dark:hover:bg-zinc-700 transition relative overflow-hidden group">
                  {/* Image Preview */}
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover w-full h-full rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-emerald-500 group-hover:text-emerald-700 transition">
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span className="text-xs text-center">
                        Click or drag to upload
                      </span>
                    </div>
                  )}

                  {/* Hidden Input */}
                  <input
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    tabIndex={-1}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>

                {/* Validation Message */}
                {!selectedFile && (
                    <p className="text-red-500 text-sm">📸 Show a similar image to your found item to make it easier to recognize</p>
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 font-semibold text-sm transition"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-md text-sm transition"
                >
                  {isPending ? "Creating.." : "Submit"}
                </button>
                {isError && (
                  <p className="text-red-500">Something went wrong.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateFoundItem;