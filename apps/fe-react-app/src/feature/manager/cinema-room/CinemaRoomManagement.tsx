import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CinemaRoomList from "./CinemaRoomList";

export default function CinemaRoomManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddCinemaRoom = () => {
    navigate("/admin/cinema-room/add");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Cinema Room Management</CardTitle>
          </div>
          <Button onClick={handleAddCinemaRoom}>
            <Plus className="mr-2 h-4 w-4" />
            Add Cinema Room
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex w-full max-w-md">
            <input
              type="text"
              placeholder="Search cinema rooms..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              maxLength={28}
            />
            <Button className="ml-2">Search</Button>
          </div>
          <CinemaRoomList searchQuery={searchQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
