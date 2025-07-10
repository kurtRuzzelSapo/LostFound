import { MapPinPlusIcon, X, UploadCloud } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

const CreateLostItem = () => {
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    datetime: "",
    description: "",
    file: null as File | null,
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Open modal handler
  const handleOpen = () => setShowModal(true);
  // Close modal handler
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => setShowModal(false), 300);
  };

  // Animate in after mount
  useEffect(() => {
    if (showModal) setTimeout(() => setAnimateIn(true), 10);
    else setAnimateIn(false);
  }, [showModal]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (
      name === "file" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      const file = e.target.files[0];
      setForm((f) => ({ ...f, file: file || null }));
      if (file) setFilePreview(URL.createObjectURL(file));
      else setFilePreview(null);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Submit logic (API call)
    handleClose();
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        className="fixed bg-green-600 bottom-6 right-6 z-50 flex items-center gap-2 p-3 rounded-full shadow-lg text-white text-base hover:scale-105 focus:ring-2 focus:ring-emerald-400 transition"
        variant="default"
        onClick={handleOpen}
        aria-label="Report a lost item"
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
              Report a Lost Item
            </h2>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-name"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Item Name
                </label>
                <input
                  id="item-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  placeholder="e.g. Wallet, Phone, Keys"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-location"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Location
                </label>
                <input
                  id="item-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  placeholder="Where did you lose it?"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-datetime"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Date & Time Lost
                </label>
                <input
                  id="item-datetime"
                  type="datetime-local"
                  name="datetime"
                  value={form.datetime}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-description"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Description
                </label>
                <textarea
                  id="item-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm transition placeholder:text-zinc-400"
                  placeholder="Describe the item in detail..."
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1 block">
                  Upload Photo
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 rounded-xl bg-emerald-50 dark:bg-zinc-800 h-24 sm:h-32 cursor-pointer hover:bg-emerald-100 dark:hover:bg-zinc-700 transition group relative">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="object-contain h-16 sm:h-24 max-w-full rounded-md"
                    />
                  ) : (
                    <span className="flex flex-col items-center text-emerald-500 group-hover:text-emerald-700 transition">
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span className="text-xs">Click or drag to upload</span>
                    </span>
                  )}
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    tabIndex={-1}
                  />
                </label>
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
                  className="flex-1 py-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-md text-sm transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateLostItem;
