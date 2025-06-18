import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { MovieHistory } from "../../interfaces/movies.interface";
import { CustomTable, type TableColumns } from "../../utils/Table";
import { formatDateTime } from "../../utils/validation.utils";

export const MyMovieHistory: React.FC = () => {
  const tableColumns: TableColumns[] = [
    {
      header: "Mã hóa đơn",
      accessorKey: "receiptId",
      width: "w-[15%]",
    },
    {
      header: "Phim",
      accessorKey: "movieName",
      width: "w-[20%]",
    },
    {
      header: "Rạp Chiếu",
      accessorKey: "room",
    },
    {
      header: "Suất chiếu",
      accessorKey: "movieSlot",
    },
    {
      header: "Ghế đã đặt",
      accessorKey: "seats",
    },
    {
      header: "Điểm",
      accessorKey: "points",
    },
  ];

  const [tableData, setTableData] = useState<MovieHistory[]>([]);
  const [errors, setError] = useState<string | null>(null);

  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      try {
        let url = "http://localhost:3000/myMovieHistory";
        if (from || to) {
          const params = [];
          if (from) params.push(`from=${from.toISOString().slice(0, 10)}`);
          if (to) params.push(`to=${to.toISOString().slice(0, 10)}`);
          url += `?${params.join("&")}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data: MovieHistory[] = await response.json();
        const formattedData = data.map((movie) => ({
          ...movie,
          movieSlot: formatDateTime(movie.movieSlot).join(" "),
        }));
        setTableData(formattedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching user profile:", err);
      }
    };
    getData();
  }, [from, to]);

  if (!tableData) {
    return <div>Loading profile...</div>;
  }
  return (
    <>
      <div className="mb-4 flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" id="from" className="w-48 justify-between font-normal">
              {from ? from.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={from}
              captionLayout="dropdown"
              onSelect={(date) => {
                setFrom(date);
              }}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" id="to" className="w-48 justify-between font-normal">
              {to ? to.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={to}
              captionLayout="dropdown"
              onSelect={(date) => {
                setTo(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {errors && <p className="text-red-500">{errors}</p>}
      <CustomTable
        tableColumns={tableColumns}
        tableData={tableData.map((row) => ({
          ...row,
          seats: Array.isArray(row.seats) ? row.seats.join(", ") : row.seats,
        }))}
      />
    </>
  );
};
