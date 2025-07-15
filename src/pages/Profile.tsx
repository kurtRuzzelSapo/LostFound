import { Mail, Calendar, Edit, Award, Search, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPosts } from "@/hooks/useUserPosts";
import EditProfileModal from "@/components/EditProfileModal";
import EditItemModal from "@/components/EditItemModal";
import UserPostCard from "@/components/UserPostCard";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type {
  FoundItemWithProfile,
  LostItemWithProfile,
} from "@/components/types/foundItem";
import ConfirmModal from "@/components/ConfirmModal";

const Profile = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const {
    foundItems,
    lostItems,
    isLoading: postsLoading,
    deleteFoundItem,
    deleteLostItem,
    isDeletingFound,
    isDeletingLost,
    updateFoundItem,
    updateLostItem,
  } = useUserPosts();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<
    FoundItemWithProfile | LostItemWithProfile | null
  >(null);
  const [editType, setEditType] = useState<"found" | "lost">("found");
  const [activeTab, setActiveTab] = useState<"found" | "lost">("found");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "found" | "lost";
  } | null>(null);

  if (profileLoading) return <Loading />;

  if (!user || !profile) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  const handleEdit = (item: FoundItemWithProfile | LostItemWithProfile) => {
    setEditItem(item);
    setEditType("date_found" in item ? "found" : "lost");
    setShowEditModal(true);
  };

  const handleDelete = (itemId: string, type: "found" | "lost") => {
    setDeleteTarget({ id: itemId, type });
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "found") {
        deleteFoundItem(deleteTarget.id);
      } else {
        deleteLostItem(deleteTarget.id);
      }
    }
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  // Add onSave handler for edit modal
  const handleSaveEdit = (
    updatedItem: FoundItemWithProfile | LostItemWithProfile,
    imageFile?: File | null
  ) => {
    if (editType === "found") {
      updateFoundItem(updatedItem as FoundItemWithProfile, imageFile);
    } else {
      updateLostItem(updatedItem as LostItemWithProfile, imageFile);
    }
    setShowEditModal(false);
    setEditItem(null);
  };

  const stats = {
    found: foundItems.length,
    lost: lostItems.length,
    claimed: 0, // TODO: Implement claimed items tracking
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {/* Avatar and Edit Button */}
          <div className="relative inline-block">
            <img
              src={profile.avatar_url || "https://via.placeholder.com/150"}
              alt={profile.full_name || "User"}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-green-400 object-cover shadow-lg transition-all"
            />
            <button
              className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-lg transition group"
              onClick={() => setShowEditModal(true)}
              aria-label="Edit profile"
            >
              <Edit className="w-5 h-5" />
              <span className="absolute left-1/2 -translate-x-1/2 top-[-2.2rem] opacity-0 group-hover:opacity-100 bg-zinc-800 text-white text-xs rounded px-2 py-1 pointer-events-none transition-all whitespace-nowrap">
                Edit Profile
              </span>
            </button>
          </div>

          {/* Name, Email, Joined */}
          <div className="flex flex-col items-center gap-2 mt-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {profile.full_name || "Anonymous User"}
            </h2>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-300">
              <Mail className="w-5 h-5" />
              <span className="text-base md:text-lg">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm md:text-base">
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl mx-auto mt-8">
            <div className="flex items-center gap-2 bg-green-100 dark:bg-zinc-800 rounded-full px-6 py-3">
              <Award className="w-6 h-6 text-green-500" />
              <span className="text-xl font-bold text-green-700 dark:text-green-400">
                {stats.found}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-300 ml-1">
                Found
              </span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-zinc-800 rounded-full px-6 py-3">
              <Search className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                {stats.lost}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-300 ml-1">
                Lost
              </span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-100 dark:bg-zinc-800 rounded-full px-6 py-3">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats.claimed}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-300 ml-1">
                Claimed
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto my-8 border-t border-dashed border-zinc-300 dark:border-zinc-700" />

        {/* Posts Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
              My Posts
            </h3>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "found" ? "default" : "outline"}
                onClick={() => setActiveTab("found")}
                className="bg-green-600 hover:bg-green-700"
              >
                Found Items ({foundItems.length})
              </Button>
              <Button
                variant={activeTab === "lost" ? "default" : "outline"}
                onClick={() => setActiveTab("lost")}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Lost Items ({lostItems.length})
              </Button>
            </div>
          </div>

          {/* Posts Grid */}
          {postsLoading ? (
            <Loading />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {activeTab === "found" ? (
                  foundItems.length > 0 ? (
                    foundItems.map((item) => (
                      <UserPostCard
                        key={item.id}
                        item={item}
                        type="found"
                        onEdit={handleEdit}
                        onDelete={(itemId) => handleDelete(itemId, "found")}
                        isDeleting={isDeletingFound}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Search className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                        No found items yet
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-500">
                        Start helping others by reporting found items!
                      </p>
                    </div>
                  )
                ) : lostItems.length > 0 ? (
                  lostItems.map((item) => (
                    <UserPostCard
                      key={item.id}
                      item={item}
                      type="lost"
                      onEdit={handleEdit}
                      onDelete={(itemId) => handleDelete(itemId, "lost")}
                      isDeleting={isDeletingLost}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Search className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                      No lost items yet
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-500">
                      Report your lost items to get help finding them!
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal && !editItem}
        onClose={() => setShowEditModal(false)}
      />
      {/* Edit Item Modal */}
      <EditItemModal
        item={editItem}
        type={editType}
        isOpen={!!editItem}
        onClose={() => {
          setShowEditModal(false);
          setEditItem(null);
        }}
        onSave={handleSaveEdit}
      />
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete this item?"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Profile;
