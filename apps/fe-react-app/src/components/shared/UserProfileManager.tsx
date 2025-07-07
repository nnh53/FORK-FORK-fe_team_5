import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import type { UserFormData } from "@/constants/profile";
import React from "react";
import Test from "./Test";
import { UserUpdateForm } from "./UserUpdateForm";

interface UserProfileManagerProps {
  userId: string;
  currentUserData?: Partial<UserFormData>;
}

export const UserProfileManager: React.FC<UserProfileManagerProps> = ({ userId, currentUserData }) => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Profile Management</CardTitle>
          <CardDescription>Upload a new avatar and update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Avatar</TabsTrigger>
              <TabsTrigger value="profile">Update Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload New Avatar</h3>
                <p className="text-muted-foreground text-sm">
                  Upload an image to use as your new avatar. The image will be compressed and converted to WebP format.
                </p>
              </div>
              <Test />
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <UserUpdateForm userId={userId} currentUserData={currentUserData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
