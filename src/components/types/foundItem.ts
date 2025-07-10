export interface FoundItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date_found: string;
  location: string;
  user_id: number;
  category: string;
  isClaimed: boolean;

};
