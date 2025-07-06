import { useState } from "react";
import { MapPinPlusIcon, X } from "lucide-react";
import { Button } from "./ui/button";

const CreateFindItem = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        className="fixed bg-green-600 bottom-6 right-6 z-50 flex items-center gap-2"
        variant="default"
        onClick={() => setOpen(true)}
      >
        <MapPinPlusIcon className="w-5 h-5" />
      </Button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white rounded-2xl shadow-xl w-[95vw] max-w-lg p-8 flex flex-col gap-3 animate-fade-in-scale">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-center mb-2">
              Report a lost item
            </h2>
            <form className="flex flex-col gap-2">
              <label className="text-sm font-medium">Item Name</label>
              <input className="border rounded px-2 py-1" />

              <label className="text-sm font-medium">Location</label>
              <input className="border rounded px-2 py-1" />

              <label className="text-sm font-medium">Date & Time Lost:</label>
              <input
                type="datetime-local"
                className="border rounded px-2 py-1"
              />

              <label className="text-sm font-medium">Descriptions:</label>
              <textarea className="border rounded px-2 py-1 min-h-[60px]" />

              <label className="text-sm font-medium">Upload photo</label>
              <div className="flex items-center justify-center border rounded bg-gray-100 h-20">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 3.13a4 4 0 01.88 7.9M12 7v6m0 0l-2-2m2 2l2-2"
                  />
                </svg>
              </div>

              <div className="flex gap-4 mt-3">
                <button
                  type="button"
                  className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold"
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

export default CreateFindItem;

// Add this to your global CSS (e.g., index.css or tailwind.css):
// .animate-fade-in-scale {
//   @apply transition-all duration-300 ease-out transform scale-95 opacity-0;
//   animation: fadeInScale 0.3s forwards;
// }
// @keyframes fadeInScale {
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// }
