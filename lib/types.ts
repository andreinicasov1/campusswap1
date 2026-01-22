export type Category = "Books" | "Tech" | "Furniture" | "Clothes" | "Other";
export type Condition = "New" | "Like new" | "Used";

export type Listing = {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: Category;
  condition: Condition;
  description: string;
  image_url: string | null;

  seller_id: string;
  seller_name: string;
  seller_username: string | null;

  created_at: string;
};

export type Report = {
  id: string;
  listing_id: string;
  reason: string;
  reporter_id: string;
  created_at: string;
};
