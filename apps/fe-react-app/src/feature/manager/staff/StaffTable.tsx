// import { Button } from "@/components/Shadcn/ui/button";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/Shadcn/ui/pagination";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
// import { SortButton } from "@/components/shared/SortButton";
// import { getPageInfo, usePagination } from "@/hooks/usePagination";
// import { useSortable } from "@/hooks/useSortable";
// import type { Staff } from "@/interfaces/staff.interface";
// import { StaffStatus } from "@/interfaces/staff.interface";
// import { Edit, Trash } from "lucide-react";
// import { useMemo } from "react";

// interface StaffTableProps {
//   staffs: Staff[];
//   onEdit: (staff: Staff) => void;
//   onDelete: (staff: Staff) => void;
// }

// const getStatusDisplay = (status: StaffStatus) => {
//   switch (status) {
//     case StaffStatus.VERIFY:
//       return { label: "Đã xác minh", className: "bg-green-100 text-green-800" };
//     case StaffStatus.BAN:
//       return { label: "Bị cấm", className: "bg-red-100 text-red-800" };
//     case StaffStatus.UNVERIFY:
//       return { label: "Chưa xác minh", className: "bg-gray-100 text-gray-800" };
//     default:
//       return { label: "Không xác định", className: "bg-yellow-100 text-yellow-800" };
//   }
// };

// const StaffTable = ({ staffs, onEdit, onDelete }: StaffTableProps) => {
//   const { sortedData, getSortProps } = useSortable<Staff>(staffs);

//   // Pagination configuration
//   const pagination = usePagination({
//     totalCount: sortedData.length,
//     pageSize: 10,
//     maxVisiblePages: 5,
//     initialPage: 1,
//   });

//   // Get current page data
//   const currentPageData = useMemo(() => {
//     return sortedData.slice(pagination.startIndex, pagination.endIndex + 1);
//   }, [sortedData, pagination.startIndex, pagination.endIndex]);

//   // Render pagination numbers
//   const renderPaginationItems = () => {
//     return pagination.visiblePages.map((page, index) => {
//       if (page === "ellipsis") {
//         return (
//           <PaginationItem key={`ellipsis-${index}`}>
//             <PaginationEllipsis />
//           </PaginationItem>
//         );
//       }

//       return (
//         <PaginationItem key={page}>
//           <PaginationLink
//             href="#"
//             isActive={page === pagination.currentPage}
//             onClick={(e) => {
//               e.preventDefault();
//               pagination.setPage(page);
//             }}
//           >
//             {page}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     });
//   };

//   return (
//     <div className="space-y-4">
//       {/* Table */}
//       <div className="w-full overflow-hidden rounded-md border">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-red-50 hover:bg-red-100">
//                 <TableHead>ID</TableHead>
//                 <TableHead>
//                   <div className="flex items-center gap-1">
//                     Tên
//                     <SortButton {...getSortProps("name")} />
//                   </div>
//                 </TableHead>
//                 <TableHead>
//                   <div className="flex items-center gap-1">
//                     Email
//                     <SortButton {...getSortProps("email")} />
//                   </div>
//                 </TableHead>
//                 <TableHead>
//                   <div className="flex items-center gap-1">
//                     Ngày sinh
//                     <SortButton {...getSortProps("date_of_birth")} />
//                   </div>
//                 </TableHead>
//                 <TableHead>Số điện thoại</TableHead>
//                 <TableHead>Địa chỉ</TableHead>
//                 <TableHead>Trạng thái</TableHead>
//                 <TableHead className="text-center">Hành động</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {currentPageData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center py-8 text-gray-500">
//                     {sortedData.length === 0 ? "Không tìm thấy nhân viên" : "Không có dữ liệu trang này"}
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 currentPageData.map((staff) => {
//                   const { label, className } = getStatusDisplay(staff.status);
//                   return (
//                     <TableRow key={staff.staff_id}>
//                       <TableCell>{staff.staff_id}</TableCell>
//                       <TableCell>{staff.name}</TableCell>
//                       <TableCell>{staff.email}</TableCell>
//                       <TableCell>{staff.date_of_birth || "Chưa cập nhật"}</TableCell>
//                       <TableCell>{staff.phone || "Chưa cập nhật"}</TableCell>
//                       <TableCell>{staff.address || "Chưa cập nhật"}</TableCell>
//                       <TableCell>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <div className="flex justify-center space-x-2">
//                           <Button variant="ghost" size="icon" onClick={() => onEdit(staff)}>
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="icon" onClick={() => onDelete(staff)}>
//                             <Trash className="h-4 w-4 text-red-600" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Pagination Info and Controls */}
//       {sortedData.length > 0 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           {/* Pagination Info */}
//           <div className="text-sm text-gray-600 w-1/10">{getPageInfo(pagination)}</div>

//           {/* Pagination Controls */}
//           {pagination.totalPages > 1 && (
//             <Pagination>
//               <PaginationContent>
//                 {/* Previous Button */}
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       pagination.prevPage();
//                     }}
//                     className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                   />
//                 </PaginationItem>

//                 {/* Page Numbers */}
//                 {renderPaginationItems()}

//                 {/* Next Button */}
//                 <PaginationItem>
//                   <PaginationNext
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       pagination.nextPage();
//                     }}
//                     className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffTable;
