export type LostItem = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    dateLost: string;
    location: string;  
    category: string;
    isClaimed: boolean;
}