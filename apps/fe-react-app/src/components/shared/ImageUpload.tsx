import { Button } from "@/components/Shadcn/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { clearUploadedImageId, useImageUpload } from "@/hooks/useImageUpload";
import { ImageIcon, ImageOffIcon, Trash2Icon, UploadIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImage: string; // URL hoặc ID hình ảnh hiện tại
  onImageChange: (imageId: string) => void; // Callback trả về ID
  onImageClear: () => void; // Callback khi xóa hình ảnh
  label?: string;
  aspectRatio?: string;
  className?: string;
  error?: string;
  previewSize?: "sm" | "md" | "lg" | "auto";
  layout?: "horizontal" | "vertical";
  preserveAspectRatio?: boolean;
  maxPreviewHeight?: number; // Giới hạn chiều cao tối đa của ảnh preview
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
  maxPreviewHeight = 400,
}) => {
  const { uploadImage, isLoading, error: uploadError } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(""); // URL tạm thời từ file cục bộ
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Responsive state using media query
  const isMobile = useMediaQuery("(max-width: 640px)");

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

  // Giải phóng objectURL khi previewUrl thay đổi hoặc component unmount
  useEffect(() => {
    if (previewUrl.startsWith("blob:")) {
      const currentUrl = previewUrl;
      return () => {
        URL.revokeObjectURL(currentUrl);
      };
    }
  }, [previewUrl]);

  // Xử lý file được chọn hoặc kéo thả
  const processFile = useCallback(
    async (file: File) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Vui lòng chọn file ảnh (JPEG, PNG, WebP)");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      try {
        const result = await uploadImage(file);
        onImageChange(result.result);
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Ảnh đã được tải lên thành công!");
      } catch (err) {
        console.error("Upload failed:", err);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.error("Tải ảnh thất bại, vui lòng thử lại.");
      }
    },
    [onImageChange, uploadImage],
  );

  // Xử lý chọn file
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  // Xử lý kéo thả
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile],
  );

  // Trigger file input click
  const handleImageClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Xử lý sự kiện bàn phím cho accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleImageClick();
      }
    },
    [handleImageClick],
  );

  // Xử lý xóa hình ảnh
  const handleClearImage = useCallback(() => {
    onImageClear();
    setPreviewUrl("");
    clearUploadedImageId();
    toast.success("Ảnh đã được xóa!");
  }, [onImageClear]);

  // Tính toán style cho container preview
  const getPreviewContainerStyle = useCallback(() => {
    // Adjust size based on screen size
    let responsiveSize = previewSize;
    if (isMobile && previewSize === "lg") {
      responsiveSize = "md";
    }

    const sizeMap = {
      sm: isMobile ? "h-28 w-28 min-h-[100px] min-w-[100px]" : "h-32 w-32 min-h-[120px] min-w-[120px]",
      md: isMobile ? "h-36 w-36 min-h-[140px] min-w-[140px]" : "h-48 w-48 min-h-[180px] min-w-[180px]",
      lg: isMobile ? "h-48 w-48 min-h-[180px] min-w-[180px]" : "h-64 w-64 min-h-[240px] min-w-[240px]",
      auto: isMobile ? "h-auto w-full min-h-[180px] max-w-full" : "h-auto w-64 min-h-[200px] max-w-md",
    };

    const baseClass = `relative overflow-hidden rounded-xl ${sizeMap[responsiveSize]} flex items-center justify-center p-2`;

    if (!imageInfo || !preserveAspectRatio) {
      return `${baseClass} aspect-[${aspectRatio.replace(":", "/")}]`;
    }

    const ratio = imageInfo.width / imageInfo.height;
    if (ratio > 1.3) {
      return `${baseClass} aspect-video`;
    } else if (ratio < 0.8) {
      return `${baseClass} aspect-[3/4]`;
    }

    return `${baseClass} aspect-square`;
  }, [imageInfo, preserveAspectRatio, previewSize, aspectRatio, isMobile]);

  // Render nội dung preview hình ảnh
  const renderImageContent = () => {
    const displayImage = previewUrl || currentImage;
    if (displayImage) {
      return (
        <div className="group relative h-full w-full overflow-hidden">
          <img
            ref={imageRef}
            src={displayImage}
            alt="Ảnh xem trước"
            className={`h-full max-h-[${maxPreviewHeight}px] min-h-[120px] w-full max-w-[100%] min-w-[120px] object-contain transition-all duration-300 group-hover:scale-105`}
            style={{ objectFit: "contain", objectPosition: "center" }}
            onError={() => {
              handleClearImage();
              toast.error("Không thể tải ảnh, đã xóa.");
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <svg className="h-8 w-8 animate-spin text-white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M4 12a8 8 0 018-8" fill="currentColor" />
              </svg>
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
                aria-label="Tải lên hình ảnh mới"
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
                  handleClearImage();
                }}
                disabled={isLoading}
                aria-label="Xóa hình ảnh"
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

  // Xác định layout class dựa trên responsive
  const getLayoutClass = useCallback(() => {
    if (isMobile) {
      return "flex-col items-center gap-4";
    }

    // Dùng media query để quyết định layout
    return layout === "horizontal" ? "flex-col items-center gap-4 sm:flex-row sm:items-start" : "flex-col items-center gap-4";
  }, [isMobile, layout]);

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
          aria-label="Khu vực tải lên hình ảnh"
          aria-describedby={uploadError || externalError ? "image-upload-error" : undefined}
          onClick={handleImageClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          className={` ${getPreviewContainerStyle()} bg-background focus:ring-ring dark:bg-background border-2 border-dashed transition-all duration-200 focus:ring-2 focus:outline-none ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary"} ${uploadError || externalError ? "border-destructive" : ""} `}
          disabled={isLoading}
        >
          {renderImageContent()}
        </button>

        <div className="flex flex-col justify-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleFileChange}
            aria-label="Chọn file ảnh để tải lên"
          />

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
                  aria-label="Mở trình chọn file ảnh"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Tải ảnh lên
                </Button>
              </div>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleClearImage();
                }}
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isLoading}
                aria-label="Xóa ảnh hiện tại"
              >
                <Trash2Icon className="text-destructive mr-2 h-4 w-4" />
                Xóa ảnh
              </Button>
            )}

            <p className="text-muted-foreground text-xs">
              {imageInfo ? `Kích thước ảnh: ${imageInfo.width}×${imageInfo.height}px` : "Hỗ trợ: JPEG, PNG, WebP. Kéo thả hoặc nhấn để tải lên."}
            </p>

            {(uploadError || externalError) && (
              <p id="image-upload-error" className="text-destructive text-sm font-medium">
                {uploadError ?? externalError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
