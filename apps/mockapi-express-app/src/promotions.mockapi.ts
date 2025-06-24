import { Promotion } from "./interfaces/promotion.interface.ts";

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
  {
    id: 3,
    image: "https://cdn.pixabay.com/photo/2017/01/20/00/30/podium-1993896_1280.png",
    title: "Spring Special",
    type: "buy_one_get_one",
    minPurchase: 150000,
    discountValue: 0,
    startTime: "2025-03-01T00:00:00Z",
    endTime: "2025-03-31T23:59:59Z",
    description: "Buy one get one free for all tickets in March.",
    status: "active",
  },
  {
    id: 4,
    image: "https://img.freepik.com/free-vector/flat-design-autumn-sale-background_23-2148620262.jpg",
    title: "Autumn Bonanza",
    type: "fixed",
    minPurchase: 120000,
    discountValue: 30000,
    startTime: "2025-09-10T00:00:00Z",
    endTime: "2025-09-20T23:59:59Z",
    description: "Get 30,000đ off for orders over 120,000đ during Autumn.",
    status: "inactive",
  },
  {
    id: 5,
    image: "https://img.freepik.com/free-vector/gradient-winter-sale-background_23-2149722982.jpg",
    title: "Winter Warmers",
    type: "percentage",
    minPurchase: 90000,
    discountValue: 10,
    startTime: "2025-12-01T00:00:00Z",
    endTime: "2025-12-31T23:59:59Z",
    description: "10% off for all orders above 90,000đ in December.",
    status: "active",
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

  filter: (criteria: Partial<Promotion>) => {
    return promotions.filter((promotion) => {
      return Object.entries(criteria).every(([key, value]) => {
        const typedKey = key as keyof Promotion;
        if (typeof value === "string" && value !== "" && promotion[typedKey]) {
          return promotion[typedKey]?.toString().toLowerCase().includes(value.toString().toLowerCase());
        }
        if (typeof value === "number" && !isNaN(value)) {
          return promotion[typedKey] === value;
        }
        if (Array.isArray(value)) {
          return value.includes(promotion[typedKey]);
        }
        return true;
      });
    });
  },

  /**
   * Filter promotions by title (case-insensitive, partial match),
   * and/or by startTime and/or endTime (inclusive, ISO string compare).
   * Any field can be provided, others are optional.
   */
  filterByFields: (criteria: { title?: string; startTime?: string; endTime?: string }) => {
    return promotions.filter((promotion) => {
      let match = true;
      if (criteria.title) {
        match = match && promotion.title.toLowerCase().includes(criteria.title.toLowerCase());
      }
      if (criteria.startTime) {
        match = match && promotion.startTime >= criteria.startTime;
      }
      if (criteria.endTime) {
        match = match && promotion.endTime <= criteria.endTime;
      }
      return match;
    });
  },
};
