import { Button } from "@/components/Shadcn/ui/button";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { getUploadedImageId } from "@/hooks/useImageUpload";
import { useUpdateUserWithAvatar } from "@/hooks/userProfile";
import type { UserUpdate } from "@/type-from-be";
import React, { useState } from "react";

interface UserUpdateFormProps {
  userId: string;
  currentUserData?: Partial<UserUpdate & { email?: string }>;
}

export const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ userId, currentUserData }) => {
  const { updateUser, isLoading, error } = useUpdateUserWithAvatar();
  const [formData, setFormData] = useState<Partial<UserUpdate>>({
    fullName: currentUserData?.fullName ?? "",
    phone: currentUserData?.phone ?? "",
    address: currentUserData?.address ?? "",
    avatar: currentUserData?.avatar ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(userId, formData);
  };

  const handleInputChange = (field: keyof UserUpdate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get the uploaded image ID if available
  const uploadedImageId = getUploadedImageId();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Update User Profile</h2>

      {uploadedImageId && (
        <div className="rounded bg-blue-100 p-4">
          <p>New avatar uploaded! ID: {uploadedImageId}</p>
          <p>Click "Update Profile" to save changes.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email (Read-only)</Label>
          <Input id="email" type="email" value={currentUserData?.email ?? ""} disabled placeholder="Email cannot be changed" />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="Enter phone number" />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="Enter address" />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>

        {error && (
          <div className="rounded bg-red-100 p-4">
            <p>Update failed: {String(error)}</p>
          </div>
        )}
      </form>
    </div>
  );
};
