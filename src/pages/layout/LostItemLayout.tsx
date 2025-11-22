import LostItemCard from "@/components/lost-item-card";
import type { LostItemWithProfile } from "@/components/types/lostItem";
import { supabase } from "@/supabase-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Loading from "@/components/loading";
const fetchLostItems = async (): Promise<LostItemWithProfile[]> => {
  const { data, error } = await supabase
    .from("lost-items")
    .select(
      "*, user_profiles(id, full_name, avatar_url, phone_number, whatsapp, email, preferred_contact_method, contact_visibility)"
    )
    .eq("is_claimed", !true)
    .order("date_lost", { ascending: false });

  if (error) throw new Error(error.message);

  return data as LostItemWithProfile[];
};

const LostItemLayout = ({ searchQuery }: { searchQuery: string }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-found-items")
      .on(
        "postgres_changes",
        {
          event: "*", // could be "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "lost-items",
        },
        () => {
          console.log("🔄 Found item changed – refetching...");
          queryClient.invalidateQueries({ queryKey: ["lost-items"] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe(); // Clean up on unmount
    };
  }, [queryClient]);

  const {
    data: lostItems,
    isError,
    isLoading,
    error,
  } = useQuery<LostItemWithProfile[], Error>({
    queryKey: ["lost-items"],
    queryFn: fetchLostItems,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  const filteredItems = lostItems?.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredItems?.map((item, index) => (
        <LostItemCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
};
export default LostItemLayout;
