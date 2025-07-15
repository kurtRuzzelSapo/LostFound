import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import type { UserProfile } from "@/components/types/userProfile";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

// Fetch user profile
const fetchUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No profile found
      return null;
    }
    throw new Error(error.message);
  }

  return data as UserProfile;
};

// Update user profile
const updateUserProfile = async ({
  userId,
  updates,
}: {
  userId: string;
  updates: Partial<UserProfile>;
}): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as UserProfile;
};

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error("User not authenticated");
      return fetchUserProfile(user.id);
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["user-profile", user?.id], updatedProfile);
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }
    updateProfileMutation.mutate({ userId: user.id, updates });
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch,
    isUpdating: updateProfileMutation.isPending,
  };
};
