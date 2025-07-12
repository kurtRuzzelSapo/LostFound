export type LostItem = {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    date_lost: string;
    location: string;  
    category: string;
    is_claimed: boolean;
}