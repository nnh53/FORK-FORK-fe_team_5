// import { Badge } from "@/components/Shadcn/ui/badge";
// import { Button } from "@/components/Shadcn/ui/button";
// import { Card, CardContent } from "@/components/Shadcn/ui/card";
// import type { Food } from "@/interfaces/snacks.interface";
// import { cn } from "@/utils/utils";
// import { Edit, Eye, ImageIcon, Trash } from "lucide-react";
// import React from "react";

// interface ComboCardProps {
//   combo: Food;
//   onEdit?: (combo: Food) => void;
//   onDelete?: (id: number) => void;
//   onViewDetails?: (id: number) => void;
//   viewMode?: "grid" | "list";
// }

// const ComboCard: React.FC<ComboCardProps> = ({ combo, onEdit, onDelete, onViewDetails, viewMode = "grid" }) => {
//   const isLowStock = combo.quantity < 10 && combo.quantity > 0;
//   const isOutOfStock = combo.quantity === 0 || combo.status !== "available";

//   // Helper functions
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const getQuantityTextColor = () => {
//     if (isOutOfStock) return "text-destructive";
//     if (isLowStock) return "text-orange-600";
//     return "text-green-600";
//   };

//   const getProgressBarColor = () => {
//     if (isOutOfStock) return "bg-destructive";
//     if (isLowStock) return "bg-orange-400";
//     return "bg-green-500";
//   };

//   // Unified Stock Badge for both views
//   const StockBadge = () => {
//     if (isOutOfStock) {
//       return (
//         <Badge variant="destructive" className="text-xs">
//           Hết hàng
//         </Badge>
//       );
//     }

//     if (isLowStock) {
//       return (
//         <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
//           Sắp hết
//         </Badge>
//       );
//     }

//     return (
//       <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
//         Có sẵn
//       </Badge>
//     );
//   };

//   const StockProgress = () => (
//     <div className="space-y-1">
//       <div className="flex justify-between text-xs text-muted-foreground">
//         <span>Tồn kho</span>
//         <span className={getQuantityTextColor()}>{combo.quantity}</span>
//       </div>
//       <div className="w-full bg-muted rounded-full h-1.5">
//         <div
//           className={cn("h-1.5 rounded-full transition-all", getProgressBarColor())}
//           style={{
//             width: `${Math.min((combo.quantity / 50) * 100, 100)}%`,
//           }}
//         />
//       </div>
//     </div>
//   );

//   const ActionButtons = ({ isFullWidth = false }: { isFullWidth?: boolean }) => (
//     <>
//       <Button
//         size="sm"
//         variant="outline"
//         onClick={() => (onViewDetails ? onViewDetails(combo.id) : null)}
//         className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}
//         disabled={!onViewDetails}
//       >
//         <Eye className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
//         {isFullWidth && "Chi tiết"}
//       </Button>
//       {onEdit && (
//         <Button size="sm" variant="outline" onClick={() => onEdit(combo)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
//           <Edit className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
//           {isFullWidth && "Chỉnh sửa"}
//         </Button>
//       )}
//       {onDelete && (
//         <Button
//           size="sm"
//           variant="destructive"
//           onClick={() => onDelete(combo.id)}
//           className={isFullWidth ? "flex-1" : "h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"}
//         >
//           <Trash className={isFullWidth ? "h-3 w-3" : "h-4 w-4"} />
//         </Button>
//       )}
//     </>
//   );

//   // Image Component for Grid View (5:4 aspect ratio)
//   const GridImageComponent = () => (
//     <div className="flex-shrink-0">
//       {combo.img ? (
//         <img
//           src={combo.img}
//           alt={combo.name}
//           className="w-full h-32 object-cover rounded-lg border"
//           style={{ aspectRatio: "5/4" }}
//           onError={(e) => {
//             const target = e.target as HTMLImageElement;
//             target.src = "/placeholder-combo.jpg";
//           }}
//         />
//       ) : (
//         <div
//           className="w-full h-32 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center"
//           style={{ aspectRatio: "5/4" }}
//         >
//           <ImageIcon className="h-8 w-8 text-gray-400 mb-1" />
//           <span className="text-xs text-gray-400">Không có ảnh</span>
//         </div>
//       )}
//     </div>
//   );

//   // Image Component for List View (5:4 aspect ratio)
//   const ListImageComponent = () => (
//     <div className="w-16 rounded-lg overflow-hidden flex-shrink-0" style={{ aspectRatio: "5/4" }}>
//       {combo.img ? (
//         <img
//           src={combo.img}
//           alt={combo.name}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             const target = e.target as HTMLImageElement;
//             target.src = "/placeholder-combo.jpg";
//           }}
//         />
//       ) : (
//         <div className="w-full h-full bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
//           <ImageIcon className="h-4 w-4 text-gray-400 mb-1" />
//           <span className="text-xs text-gray-400">N/A</span>
//         </div>
//       )}
//     </div>
//   );

//   // Grid View
//   if (viewMode === "grid") {
//     return (
//       <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
//         <CardContent className="p-4 space-y-3">
//           <GridImageComponent />

//           {/* Info section */}
//           <div className="space-y-2">
//             <div className="flex items-start justify-between">
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-sm truncate" title={combo.name}>
//                   {combo.name}
//                 </h3>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="flex items-center justify-between">
//               <span className="font-bold text-primary">{formatPrice(combo.price)}</span>
//               <div className="flex items-center justify-between">
//                 <StockBadge />
//               </div>
//             </div>

//             {/* Stock and Status */}
//             <div className="space-y-2">
//               <StockProgress />
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex gap-2 pt-2 border-t">
//             <ActionButtons isFullWidth />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   // List View
//   return (
//     <Card className="hover:shadow-md transition-shadow duration-200">
//       <CardContent className="p-4">
//         <div className="flex items-center gap-4">
//           <ListImageComponent />

//           <div className="flex-1 min-w-0 space-y-1">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="font-semibold truncate">{combo.name}</h3>
//               </div>
//               <div className="flex items-center gap-2 ml-4">
//                 <StockBadge />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <span className="font-bold text-primary">{formatPrice(combo.price)}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className={cn("text-sm font-medium", getQuantityTextColor())}>SL: {combo.quantity}</span>
//                 <ActionButtons />
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ComboCard;
