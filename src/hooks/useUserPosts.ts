import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import type {
  FoundItemWithProfile,
  LostItemWithProfile,
} from "@/components/types/foundItem";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

// Fetch user's found items
const fetchUserFoundItems = async (
  userId: string
): Promise<FoundItemWithProfile[]> => {
  const { data, error } = await supabase
    .from("found-item")
    .select("*, user_profiles(full_name, avatar_url)")
    .eq("user_id", userId)
    .order("date_found", { ascending: false });

  if (error) throw new Error(error.message);

  return data as FoundItemWithProfile[];
};

// Fetch user's lost items
const fetchUserLostItems = async (
  userId: string
): Promise<LostItemWithProfile[]> => {
  const { data, error } = await supabase
    .from("lost-items")
    .select("*, user_profiles(full_name, avatar_url)")
    .eq("user_id", userId)
    .order("date_lost", { ascending: false });

  if (error) throw new Error(error.message);

  return data as LostItemWithProfile[];
};

// Delete found item
const deleteFoundItemFromDB = async (itemId: string): Promise<void> => {
  const { error } = await supabase.from("found-item").delete().eq("id", itemId);

  if (error) throw new Error(error.message);
};

// Delete lost item
const deleteLostItemFromDB = async (itemId: string): Promise<void> => {
  const { error } = await supabase.from("lost-items").delete().eq("id", itemId);

  if (error) throw new Error(error.message);
};

// Helper to sanitize file names for storage
function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9-_.]/g, "_");
}

export const useUserPosts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Update found item
  const updateFoundItemInDB = async ({
    item,
    imageFile,
  }: {
    item: FoundItemWithProfile;
    imageFile?: File | null;
  }) => {
    let imageUrl = item.image_url;
    if (imageFile && user?.id) {
      // Delete old image if it exists and is in found-images bucket
      if (item.image_url) {
        const oldPath = item.image_url.split(
          "/storage/v1/object/public/found-images/"
        )[1];
        if (oldPath) {
          await supabase.storage.from("found-images").remove([oldPath]);
        }
      }
      const safeTitle = sanitizeFileName(item.title);
      const filePath = `${user.id}/${safeTitle}-${Date.now()}-${
        imageFile.name
      }`;
      console.log("Uploading to:", filePath, "File:", imageFile);
      const { error: uploadError } = await supabase.storage
        .from("found-images")
        .upload(filePath, imageFile);
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicURLData } = supabase.storage
        .from("found-images")
        .getPublicUrl(filePath);
      imageUrl = publicURLData.publicUrl;
    }
    const { error } = await supabase
      .from("found-item")
      .update({
        title: item.title,
        location: item.location,
        description: item.description,
        date_found: item.date_found,
        image_url: imageUrl,
        is_claimed: item.is_claimed,
      })
      .eq("id", item.id);
    if (error) throw new Error(error.message);
  };

  // Update lost item
  const updateLostItemInDB = async ({
    item,
    imageFile,
  }: {
    item: LostItemWithProfile;
    imageFile?: File | null;
  }) => {
    let imageUrl = item.image_url;
    if (imageFile && user?.id) {
      // Delete old image if it exists and is in lost-images bucket
      if (item.image_url) {
        const oldPath = item.image_url.split(
          "/storage/v1/object/public/lost-images/"
        )[1];
        if (oldPath) {
          await supabase.storage.from("lost-images").remove([oldPath]);
        }
      }
      const safeTitle = sanitizeFileName(item.title);
      const filePath = `${user.id}/${safeTitle}-${Date.now()}-${
        imageFile.name
      }`;
      console.log("Uploading to:", filePath, "File:", imageFile);
      const { error: uploadError } = await supabase.storage
        .from("lost-images")
        .upload(filePath, imageFile);
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicURLData } = supabase.storage
        .from("lost-images")
        .getPublicUrl(filePath);
      imageUrl = publicURLData.publicUrl;
    }
    const { error } = await supabase
      .from("lost-items")
      .update({
        title: item.title,
        location: item.location,
        description: item.description,
        date_lost: item.date_lost,
        image_url: imageUrl,
        is_claimed: item.is_claimed,
        claimed_by: item.claimed_by,
      })
      .eq("id", item.id);
    if (error) throw new Error(error.message);
  };

  // Found items query
  const {
    data: foundItems,
    isLoading: isLoadingFound,
    error: foundError,
  } = useQuery({
    queryKey: ["user-found-items", user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error("User not authenticated");
      return fetchUserFoundItems(user.id);
    },
    enabled: !!user?.id,
  });

  // Lost items query
  const {
    data: lostItems,
    isLoading: isLoadingLost,
    error: lostError,
  } = useQuery({
    queryKey: ["user-lost-items", user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error("User not authenticated");
      return fetchUserLostItems(user.id);
    },
    enabled: !!user?.id,
  });

  // Delete found item mutation
  const deleteFoundMutation = useMutation({
    mutationFn: deleteFoundItemFromDB,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-found-items", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["found-items"] });
      toast.success("Found item deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete found item: ${error.message}`);
    },
  });

  // Delete lost item mutation
  const deleteLostMutation = useMutation({
    mutationFn: deleteLostItemFromDB,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-lost-items", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["lost-items"] });
      toast.success("Lost item deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete lost item: ${error.message}`);
    },
  });

  // Update found item mutation
  const updateFoundMutation = useMutation({
    mutationFn: updateFoundItemInDB,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-found-items", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["found-items"] });
      toast.success("Found item updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update found item: ${error.message}`);
    },
  });

  // Update lost item mutation
  const updateLostMutation = useMutation({
    mutationFn: updateLostItemInDB,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-lost-items", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["lost-items"] });
      toast.success("Lost item updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update lost item: ${error.message}`);
    },
  });

  const deleteFoundItem = (itemId: string) => {
    deleteFoundMutation.mutate(itemId);
  };

  const deleteLostItem = (itemId: string) => {
    deleteLostMutation.mutate(itemId);
  };

  const updateFoundItem = (
    item: FoundItemWithProfile,
    imageFile?: File | null
  ) => {
    updateFoundMutation.mutate({ item, imageFile });
  };

  const updateLostItem = (
    item: LostItemWithProfile,
    imageFile?: File | null
  ) => {
    updateLostMutation.mutate({ item, imageFile });
  };

  return {
    foundItems: foundItems || [],
    lostItems: lostItems || [],
    isLoading: isLoadingFound || isLoadingLost,
    error: foundError || lostError,
    deleteFoundItem,
    deleteLostItem,
    updateFoundItem,
    updateLostItem,
    isDeletingFound: deleteFoundMutation.isPending,
    isDeletingLost: deleteLostMutation.isPending,
    isUpdatingFound: updateFoundMutation.isPending,
    isUpdatingLost: updateLostMutation.isPending,
  };
};
