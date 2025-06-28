// import { Button } from "@/components/Shadcn/ui/button";
// import type { ComboDetail as ComboDetailType, Food } from "@/interfaces/snacks.interface";
// import { ArrowLeft, Edit } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import FoodTable from "./food/FoodTable";
// import { getComboDetailsByComboId, getFoodById } from "./service/foodApi";

// interface ComboDetailProps {
//   combo: Food;
//   onBack: () => void;
//   onEdit: (combo: Food) => void;
// }

// interface ComboItem {
//   food: Food;
//   quantity: number;
// }

// const ComboDetail: React.FC<ComboDetailProps> = ({ combo, onBack, onEdit }) => {
//   const [comboItems, setComboItems] = useState<ComboItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchComboDetails = async (comboId: number) => {
//     setLoading(true);
//     try {
//       const comboDetails = await getComboDetailsByComboId(comboId);
//       const itemsPromises = comboDetails.map(async (detail: ComboDetailType) => {
//         const food = await getFoodById(Number(detail.foodId));
//         return {
//           food,
//           quantity: Number(detail.quantity),
//         };
//       });
//       const items = await Promise.all(itemsPromises);
//       const foodsInCombo = items.map((item) => ({ ...item.food, quantity: item.quantity }));
//       setComboItems(foodsInCombo.map((food) => ({ food, quantity: food.quantity })));
//     } catch (error) {
//       console.error("Error fetching combo details:", error);
//       toast.error("Lỗi khi tải chi tiết combo");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (combo.id) {
//       fetchComboDetails(combo.id);
//     }
//   }, [combo.id]);

//   const foodsForTable = comboItems.map((item) => item.food);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <header className="flex items-center justify-between mb-6">
//         <Button variant="outline" onClick={onBack}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Quay lại
//         </Button>
//         <h1 className="text-3xl font-bold text-center">{combo.name}</h1>
//         <Button onClick={() => onEdit(combo)}>
//           <Edit className="h-4 w-4 mr-2" />
//           Chỉnh sửa
//         </Button>
//       </header>

//       <main>{loading ? <div className="text-center">Đang tải...</div> : <FoodTable foods={foodsForTable} />}</main>
//     </div>
//   );
// };

// export default ComboDetail;
