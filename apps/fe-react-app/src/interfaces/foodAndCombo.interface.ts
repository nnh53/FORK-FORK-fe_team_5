export interface Food {
  id: number;
  comboId: number;
  img: string;
  category: "drink" | "food" | "combo";
  name: string;
  size: "S" | "M" | "L" | "XL";
  flavor: string;
  price: number;
  status: "sold" | "available";
  quantity: number;
}

export interface ComboDetail {
  id: number;
  foodId: string;
  quantity: string;
}
