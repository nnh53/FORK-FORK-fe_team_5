export interface Promotion {
  id: number;
  image: string;
  title: string;
  type: string;
  minPurchase: number;
  discountValue: number;
  startTime: string;
  endTime: string;
  description: string;
  status: string;
}

export let promotions = [
  {
    id: 1,
    image: "https://img.pikbest.com/templates/20240813/hello-summer-banner-2c-3d-product-podium-2c-supermarket-sale-promotion_10720426.jpg!w700wp",
    title: "Summer Sale",
    type: "percentage",
    minPurchase: 100000,
    discountValue: 20,
    startTime: "2025-06-01T00:00:00Z",
    endTime: "2025-06-30T23:59:59Z",
    description: "Get 20% off for orders over 100,000đ during June.",
    status: "active",
  },
  {
    id: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTykrfTcTnpvwsg6q5FtFAQ_PWtekYJ8HIhRg&s",
    title: "New Year Deal",
    type: "fixed",
    minPurchase: 200000,
    discountValue: 50000,
    startTime: "2025-12-25T00:00:00Z",
    endTime: "2026-01-05T23:59:59Z",
    description: "Flat 50,000đ off for purchases above 200,000đ.",
    status: "inactive",
  },
];

export const promotionsAPI = {
  getAll: () => promotions,

  getById: (id: string) => promotions.find((production) => production.id.toString() === id),

  create: (promotionData: Omit<Promotion, "id">) => {
    const newMovie: Promotion = {
      ...promotionData,
      id: promotions.length + 1,
    };
    promotions.push(newMovie);
    return newMovie;
  },

  update: (id: string, promotionData: Partial<Omit<Promotion, "id">>) => {
    const index = promotions.findIndex((movie) => movie.id.toString() === id);
    if (index !== -1) {
      promotions[index] = {
        ...promotions[index],
        ...promotionData,
      };
      return promotions[index];
    }
    return null;
  },

  delete: (id: string) => {
    const index = promotions.findIndex((promotion) => promotion.id.toString() === id);
    if (index !== -1) {
      const deletedpromotion = promotions.splice(index, 1)[0];
      return deletedpromotion;
    }
    return null;
  },
};
