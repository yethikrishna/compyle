"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { authenticateFileServer, deleteFile } from "@/server/imagekit";
import { ImageData } from "@/types/image";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface NewAppImageProps {
  onImageDataChange: (imageData: ImageData | null) => void;
  initialImageData?: ImageData | null;
}

export default function NewAppImage({
  onImageDataChange,
  initialImageData = null,
}: NewAppImageProps) {
  const [imageData, setImageData] = useState<ImageData | null>(
    initialImageData,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  // Sync with initialImageData prop changes
  useEffect(() => {
    if (initialImageData) {
      setImageData(initialImageData);
    }
  }, [initialImageData]);

  // Update parent component when image data changes
  const updateImageData = (newImageData: ImageData | null) => {
    setImageData(newImageData);
    onImageDataChange(newImageData);
  };

  const authenticator = async () => {
    try {
      const data = await authenticateFileServer();
      return data;
    } catch {
      toast.error("Failed to authenticate upload server");
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const authParams = await authenticator();

      if (!authParams) {
        toast.error("Failed to authenticate upload server");
        return;
      }

      const toastId = toast.loading("Uploading files...");

      const uploadResponse = await upload({
        ...authParams,
        file,
        folder: "/compyle/apps",
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      toast.dismiss(toastId);
      if (
        !uploadResponse.url ||
        !uploadResponse.fileId ||
        !uploadResponse.thumbnailUrl
      ) {
        toast.error("Failed to upload image");
        return;
      }

      updateImageData({
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        thumbnailUrl: uploadResponse.thumbnailUrl,
      });
      toast.success("Image uploaded successfully");
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload was cancelled");
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid image upload request");
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error during upload");
      } else if (error instanceof ImageKitServerError) {
        toast.error("Upload server error");
      } else {
        toast.error("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageData) {
      toast.error("Image does not exist");
      return;
    }

    const toastId = toast.loading("Deleting existing image...");
    try {
      await deleteFile({ fileId: imageData.fileId });
      toast.dismiss(toastId);
      toast.success("Existing image deleted.");
      updateImageData(null);
      // Don't automatically open file picker - let user do it manually
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to delete existing image");
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-secondary/50 p-3 rounded-lg">
            <ImageIcon className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-semibold mb-1">
              Image or Screenshot
            </h2>
            <p className="text-muted-foreground text-sm">
              Upload an image or screenshot of your app
            </p>
          </div>
        </div>

        <div className="pl-0 lg:pl-16 mt-2 space-y-6">
          {imageData?.url ? (
            <div className="">
              <Image
                src={imageData.url}
                width={160}
                height={90}
                alt="App image"
                className="w-full max-w-md rounded-lg border object-cover"
              />
              <div className="mt-5 space-x-4">
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={handleFileSelect}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload an image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG up to 5MB
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                disabled={isUploading}
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        {isUploading && (
          <div className="pl-0 lg:pl-16 mt-2 w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
