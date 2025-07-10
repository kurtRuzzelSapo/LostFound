import FoundItemCard from "@/components/found-item-card";
import { supabase } from "@/supabase-client";
import type { FoundItem } from "@/components/types/foundItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/loading";
import { useEffect } from "react";

const fetchFoundItems = async (): Promise<FoundItem[]> => {
  const { data, error } = await supabase
    .from("found-item")
    .select("*")
    .order("date_found", { ascending: false });

  if (error) throw new Error(error.message);

  return data as FoundItem[];
};

const FoundItemLayout = ({ searchQuery }: {searchQuery:string}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-found-items")
      .on(
        "postgres_changes",
        {
          event: "*", // could be "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "found-item",
        },
        () => {
          console.log("🔄 Found item changed – refetching...");
            queryClient.invalidateQueries({ queryKey: ["found-items"] });
        }
      )
      .subscribe();

    return () => { 
      channel.unsubscribe(); // Clean up on unmount
    };
  }, [queryClient]);

  const {
    data: foundItems,
    isError,
    isLoading,
    error,
  } = useQuery<FoundItem[], Error>({
    queryKey: ["found-items"],
    queryFn: fetchFoundItems,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  const filteredItems = foundItems?.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems?.map((item) => (
          <FoundItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default FoundItemLayout;
