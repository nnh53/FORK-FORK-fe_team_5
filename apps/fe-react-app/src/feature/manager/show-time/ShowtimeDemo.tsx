import { ShowtimeManagementNew } from "@/feature/manager/show-time";

/**
 * Demo page để sử dụng các component showtime mới
 *
 * Cách sử dụng:
 * 1. Import ShowtimeManagementNew từ feature/manager/show-time
 * 2. Sử dụng component này trong page hoặc layout của bạn
 *
 * Features:
 * - Danh sách showtime với khả năng edit/delete
 * - Form tạo showtime mới với tự động tính endTime
 * - Form chỉnh sửa showtime
 * - Validation và error handling
 */
export default function ShowtimeDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Demo: Quản lý lịch chiếu</h1>
        <p className="text-muted-foreground">Component mới để quản lý lịch chiếu với UI/UX được cải thiện</p>
      </div>

      <ShowtimeManagementNew />
    </div>
  );
}

/**
 * Hoặc bạn có thể sử dụng từng component riêng lẻ:
 *
 * import { ShowtimeList, ShowtimeForm } from "@/feature/manager/show-time"
 *
 * export function MyShowtimePage() {
 *   const [mode, setMode] = useState<"list" | "create" | "edit">("list")
 *   const [selectedShowtime, setSelectedShowtime] = useState<Showtime>()
 *
 *   return (
 *     <div>
 *       {mode === "list" && (
 *         <ShowtimeList
 *           onEditShowtime={(showtime) => {
 *             setSelectedShowtime(showtime)
 *             setMode("edit")
 *           }}
 *           onCreateNew={() => setMode("create")}
 *         />
 *       )}
 *
 *       {mode === "create" && (
 *         <ShowtimeForm
 *           onSuccess={() => setMode("list")}
 *           onCancel={() => setMode("list")}
 *         />
 *       )}
 *
 *       {mode === "edit" && selectedShowtime && (
 *         <ShowtimeForm
 *           initialData={selectedShowtime}
 *           onSuccess={() => setMode("list")}
 *           onCancel={() => setMode("list")}
 *         />
 *       )}
 *     </div>
 *   )
 * }
 */
