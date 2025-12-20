"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
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
import { Trash2, Upload, X, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface NewAppImageProps {
  onImageDataChange: (imageData: ImageData | null) => void;
  initialImageData?: ImageData | null;
  totalImages?: 1;
}

export function ImageUploader({
  onImageDataChange,
  initialImageData = null,
}: NewAppImageProps) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageData, setImageData] = useState<ImageData | null>(
    initialImageData,
  );
  const [showFullScreen, setShowFullScreen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    setImageData(initialImageData ?? null);
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
    if (isUploading || isProcessingRef.current) return;
    fileInputRef.current?.click();
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current && isUploading) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsUploading(false);
      setProgress(0);
      toast.info("Upload cancelled");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    // Prevent race conditions
    if (isProcessingRef.current || isUploading) {
      toast.error("Please wait for the current operation to complete");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please select a valid image");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      event.target.value = "";
      return;
    }

    isProcessingRef.current = true;
    setIsUploading(true);
    setProgress(0);

    // Create new abort controller for this upload
    abortControllerRef.current = new AbortController();

    try {
      const authParams = await authenticator();

      if (!authParams) {
        toast.error("Failed to authenticate upload server");
        return;
      }

      const toastId = toast.loading("Uploading image...");

      const uploadResponse = await upload({
        ...authParams,
        file,
        folder: "/compyle/apps",
        fileName: file.name,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
        abortSignal: abortControllerRef.current.signal,
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
        toast.info("Upload cancelled");
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
      abortControllerRef.current = null;
      isProcessingRef.current = false;
      event.target.value = "";
    }
  };

  const handleRemoveImage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!imageData || isProcessingRef.current || isUploading) {
      if (isUploading) {
        toast.error("Please wait for upload to complete");
      } else {
        toast.error("Image does not exist");
      }
      return;
    }

    isProcessingRef.current = true;
    const toastId = toast.loading("Deleting image...");

    try {
      await deleteFile({ fileId: imageData.fileId });
      toast.dismiss(toastId);
      toast.success("Image deleted successfully");
      updateImageData(null);
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to delete image");
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleFullScreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFullScreen(true);
  };

  // State 1: No image uploaded
  if (!imageData?.url && !isUploading) {
    return (
      <div className="w-full">
        <div className="mt-2 space-y-8">
          <Field>
            <FieldLabel>Image or Screenshot</FieldLabel>
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
          </Field>
        </div>
      </div>
    );
  }

  // State 2: Upload in progress
  if (isUploading) {
    return (
      <div className="w-full">
        <div className="mt-2 space-y-8">
          <Field>
            <FieldLabel>Image or Screenshot</FieldLabel>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium">Uploading image...</p>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleCancelUpload}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={progress} className="flex-1" />
                  <span className="text-sm font-medium min-w-[3rem] text-right">
                    {progress}%
                  </span>
                </div>
              </CardContent>
            </Card>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </Field>
        </div>
      </div>
    );
  }

  // State 3: Image uploaded
  return (
    <>
      <div className="w-full">
        <div className="mt-2 space-y-8">
          <Field>
            <FieldLabel>Image or Screenshot</FieldLabel>
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-row gap-4 justify-between">
                  <div className="flex-shrink-0">
                    <Image
                      src={imageData!.url}
                      width={120}
                      height={120}
                      alt="App image"
                      className="w-[120px] h-[120px] rounded-lg border object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={handleFullScreen}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handleFullScreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={handleRemoveImage}
                      disabled={isProcessingRef.current}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </Field>
        </div>
      </div>

      <Dialog open={showFullScreen} onOpenChange={setShowFullScreen}>
        <DialogContent className="p-2 max-w-[95vw]! w-[95vw]! h-[95vh]">
          <DialogTitle className="sr-only">Full Screen Image</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={imageData!.url}
              width={1200}
              height={1200}
              alt="App image fullscreen"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
