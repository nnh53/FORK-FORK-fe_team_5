import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CinemaRoomList from "./CinemaRoomList";

export default function CinemaRoomManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleAddCinemaRoom = () => {
    navigate("/admin/cinema-room/add");
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Cinema Room Management</CardTitle>
          </div>
          <Button onClick={handleAddCinemaRoom}>
            <Plus className="mr-2 h-4 w-4" />
            Add Cinema Room
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex w-full max-w-md">
            <Input
              type="text"
              placeholder="Search cinema rooms..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={28}
              className="mr-2"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <CinemaRoomList searchQuery={searchQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
