import { Button } from "@/components/Shadcn/ui/button";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload"; // Import hook
import { ImageIcon, ImageOffIcon, LinkIcon, Trash2Icon, UploadIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ImageUploadProps {
  currentImage: string; // URL hoặc ID hình ảnh hiện tại
  onImageChange: (imageIdOrUrl: string) => void; // Callback trả về ID hoặc URL
  onImageClear: () => void; // Callback khi xóa hình ảnh
  label?: string;
  aspectRatio?: string;
  className?: string;
  error?: string;
  previewSize?: "sm" | "md" | "lg" | "auto";
  layout?: "horizontal" | "vertical";
  preserveAspectRatio?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  onImageClear,
  label = "Hình ảnh",
  aspectRatio = "1:1",
  className = "",
  error: externalError,
  previewSize = "md",
  layout = "horizontal",
  preserveAspectRatio = true,
}) => {
  const { uploadImage, isLoading, error: uploadError } = useImageUpload(); // Sử dụng hook
  const [dragActive, setDragActive] = useState(false);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(""); // URL tạm thời để preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load image dimensions when currentImage changes
  useEffect(() => {
    if (currentImage && preserveAspectRatio) {
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          width: img.width,
          height: img.height,
        });
      };
      img.src = currentImage;
    } else {
      setImageInfo(null);
    }
  }, [currentImage, preserveAspectRatio]);

  // Giải phóng objectURL khi component unmount hoặc previewUrl thay đổi
  useEffect(() => {
    // Khi previewUrl thay đổi và là blob URL
    if (previewUrl.startsWith("blob:")) {
      // Lưu lại objectURL hiện tại để giải phóng
      const currentUrl = previewUrl;

      // Chỉ giải phóng URL khi component unmount hoặc sau khi tải lên xong
      return () => {
        URL.revokeObjectURL(currentUrl);
      };
    }

    return () => {};
  }, [previewUrl]);

  // Xử lý file được chọn
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Tạo URL tạm để preview
      setPreviewUrl(fileUrl);
      try {
        const result = await uploadImage(file); // Tải lên server
        onImageChange(result.result); // Trả về ID hình ảnh
        setPreviewUrl(""); // Xóa previewUrl sau khi tải lên
        // Reset file input để có thể chọn lại cùng một file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err) {
        console.error("Upload failed:", err);
        // Cũng reset khi có lỗi
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // Xử lý kéo thả
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      const fileUrl = URL.createObjectURL(file); // Tạo URL tạm để preview
      setPreviewUrl(fileUrl);
      try {
        const result = await uploadImage(file); // Tải lên server
        onImageChange(result.result); // Trả về ID hình ảnh
        setPreviewUrl(""); // Xóa previewUrl sau khi tải lên
        // Reset file input để có thể chọn lại cùng một file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err) {
        console.error("Upload failed:", err);
        // Cũng reset khi có lỗi
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // Trigger file input click
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý sự kiện bàn phím cho accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageClick();
    }
  };

  // Tính toán style cho container preview
  const getPreviewContainerStyle = () => {
    const sizeMap = {
      sm: "h-32 w-32 min-h-[120px] min-w-[120px]",
      md: "h-48 w-48 min-h-[180px] min-w-[180px]",
      lg: "h-64 w-64 min-h-[240px] min-w-[240px]",
      auto: "h-auto w-64 min-h-[200px] max-w-md",
    };

    // Sử dụng baseClass với các thuộc tính bổ sung để tránh tràn ảnh
    const baseClass = `relative overflow-hidden rounded-xl ${sizeMap[previewSize]} flex items-center justify-center p-2`;

    if (!imageInfo || !preserveAspectRatio) {
      return baseClass;
    }

    // Kiểm tra tỉ lệ ảnh nhưng đảm bảo giới hạn kích thước
    const ratio = imageInfo.width / imageInfo.height;
    if (ratio > 1.3) {
      return `${baseClass} aspect-video`;
    } else if (ratio < 0.8) {
      return `${baseClass} aspect-[3/4]`;
    }

    return `${baseClass} aspect-square`;
  };

  // Render nội dung preview hình ảnh
  const renderImageContent = () => {
    const displayImage = previewUrl || currentImage; // Ưu tiên previewUrl nếu có
    if (displayImage) {
      return (
        <div className="group relative h-full w-full overflow-hidden">
          <img
            ref={imageRef}
            src={displayImage}
            alt="Preview"
            className="h-full max-h-[400px] min-h-[120px] w-full min-w-[120px] max-w-[100%] object-contain transition-all duration-300 group-hover:scale-105"
            style={{ objectFit: "contain", objectPosition: "center" }}
            onError={() => {
              onImageClear();
              setPreviewUrl("");
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-white">Đang tải lên...</p>
            </div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <p className="mb-2 text-sm font-medium text-white">Thay đổi hình ảnh</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="border-white bg-white/20 text-white hover:bg-white/30"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleImageClick();
                }}
                disabled={isLoading}
              >
                <UploadIcon className="mr-1 h-3 w-3" />
                Tải lên
              </Button>
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="border-white bg-white/20 text-white hover:bg-white/30"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onImageClear();
                  setPreviewUrl("");
                }}
                disabled={isLoading}
              >
                <ImageOffIcon className="mr-1 h-3 w-3" />
                Xóa
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <div className="bg-muted mb-3 rounded-full p-3">
          <ImageIcon className="text-muted-foreground h-8 w-8" />
        </div>
        <p className="text-sm font-medium">Kéo thả ảnh vào đây</p>
        <p className="text-muted-foreground mt-1 text-xs">hoặc nhấn để tải lên</p>
        <p className="text-muted-foreground mt-4 text-xs">JPEG, PNG, WebP</p>
      </div>
    );
  };

  // Xác định layout class
  const getLayoutClass = () => {
    return layout === "horizontal" ? "flex-col items-center gap-4 sm:flex-row sm:items-start" : "flex-col items-center gap-4";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="flex items-center gap-1 font-medium">
          <ImageIcon className="h-4 w-4" />
          {label}
          {aspectRatio && <span className="text-muted-foreground ml-1 text-xs">(tỷ lệ tốt nhất: {aspectRatio})</span>}
        </div>
      )}

      <div className={`flex ${getLayoutClass()}`}>
        <button
          type="button"
          onClick={handleImageClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          className={` ${getPreviewContainerStyle()} bg-background focus:ring-ring dark:bg-background border-2 border-dashed transition-all duration-200 focus:outline-none focus:ring-2 ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary"} ${uploadError || externalError ? "border-destructive" : ""} `}
          aria-label="Upload image"
          disabled={isLoading}
        >
          {renderImageContent()}
        </button>

        <div className="flex flex-col justify-center gap-3">
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} aria-label="Upload image file" />

          <div className="space-y-3">
            {!currentImage && !previewUrl ? (
              <div className="space-y-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageClick();
                  }}
                  type="button"
                  className="w-full"
                  disabled={isLoading}
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Tải ảnh lên
                </Button>

                <div className="relative">
                  <Label htmlFor="image-url" className="mb-1 block text-xs">
                    Hoặc nhập URL của ảnh
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      id="image-url"
                      placeholder="https://example.com/image.jpg"
                      className="w-full text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget as HTMLInputElement;
                          if (input.value) {
                            onImageChange(input.value);
                            input.value = "";
                            setPreviewUrl(input.value);
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        const input = document.getElementById("image-url") as HTMLInputElement;
                        if (input.value) {
                          onImageChange(input.value);
                          input.value = "";
                          setPreviewUrl(input.value);
                        }
                      }}
                      disabled={isLoading}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onImageClear();
                  setPreviewUrl("");
                }}
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                <Trash2Icon className="text-destructive mr-2 h-4 w-4" />
                Xóa ảnh
              </Button>
            )}

            <p className="text-muted-foreground text-xs">
              {imageInfo ? `Kích thước ảnh: ${imageInfo.width}×${imageInfo.height}px` : "Hỗ trợ: JPEG, PNG, WebP. Kéo thả hoặc nhấn để tải lên."}
            </p>

            {(uploadError || externalError) && <p className="text-destructive text-sm font-medium">{uploadError ?? externalError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
