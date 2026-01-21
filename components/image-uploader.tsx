"use client";

import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type ImageFile = {
    file?: File;
    previewUrl: string;
    isPreview: boolean;
    isExisting?: boolean;
};

interface ImageUploaderProps {
    onImagesChange: (images: ImageFile[]) => void;
    maxImages?: number;
    initialImages?: string[];
    previewImageUrl?: string;
}

export function ImageUploader({
                                  onImagesChange,
                                  maxImages = 10,
                                  initialImages = [],
                                  previewImageUrl = null
                              }: ImageUploaderProps) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [dragging, setDragging] = useState(false);
    const isFull = images.length >= maxImages;

    // Loading existing images
    useEffect(() => {
        if (initialImages.length > 0 && images.length === 0) {
            const existingImages: ImageFile[] = initialImages.map((url, idx) => ({
                previewUrl: url,
                isPreview: previewImageUrl ? url === previewImageUrl : idx === 0,
                isExisting: true,
            }));
            setImages(existingImages);
        }
    }, [initialImages, previewImageUrl]);

    useEffect(() => {
        onImagesChange(images);
    }, [images, onImagesChange]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages: ImageFile[] = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            isPreview: false,
            isExisting: false,
        }));

        setImages((prev) => {
            const hasPreview = prev.some((img) => img.isPreview);
            const firstNewPreview = !hasPreview ? newImages[0] : null;

            const updatedNewImages = firstNewPreview
                ? newImages.map((img, idx) => ({
                    ...img,
                    isPreview: idx === 0,
                }))
                : newImages;

            return [...prev, ...updatedNewImages].slice(0, maxImages);
        });

        e.target.value = "";
    };

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>, isDrag: boolean) => {
        if (isFull) return;
        e.preventDefault();
        e.stopPropagation();
        setDragging(isDrag);
    }, [isFull]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        if (isFull) return;
        handleDrag(e, false);
        const files = Array.from(e.dataTransfer.files || []);
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));
        const input = document.getElementById("image-upload") as HTMLInputElement;
        input!.files = imageFiles as FileList;
        handleImageUpload({ target: input! } as any);
    }, [handleDrag, isFull]);

    const setPreviewImage = useCallback((index: number) => {
        setImages((prev) =>
            prev.map((img, idx) => ({
                ...img,
                isPreview: idx === index,
            }))
        );
    }, []);

    const removeImage = useCallback((index: number) => {
        setImages((prev) => {
            const newImages = prev.filter((_, idx) => idx !== index);
            if (prev[index].isPreview && newImages.length > 0) {
                newImages[0].isPreview = true;
            }
            return newImages;
        });
    }, []);

    useEffect(() => {
        return () => {
            images.forEach((img) => {
                // Clear for only new images
                if (!img.isExisting && img.previewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(img.previewUrl);
                }
            });
        };
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                Images* (max {maxImages}, select 1 preview)
            </label>

            {/* Drag & Drop input */}
            {!isFull && (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragging
                        ? "border-accent bg-accent/10"
                        : "border-muted-foreground/30 hover:border-accent"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isFull}
                        max={maxImages}
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <ImagePlus className="h-12 w-12 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Drag images or click to select</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                        </div>
                    </label>
                </div>
            )}

            {/* if full then hide input */}
            {isFull && (
                <div className="border-2 border-accent rounded-lg p-8 text-center bg-accent/5">
                    <ImagePlus className="h-12 w-12 mx-auto mb-2 text-accent-foreground/70" />
                    <p className="text-sm font-medium text-accent-foreground">
                        Maximum {maxImages} images reached
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Delete some images to add new ones
                    </p>
                </div>
            )}

            {/* Images grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${image.isPreview
                                ? "border-accent ring-2 ring-accent ring-offset-2"
                                : "border-muted-foreground/50 hover:border-accent"
                            }`}
                            onClick={() => setPreviewImage(index)}
                        >
                            <img
                                src={image.isExisting ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${image.previewUrl}` : image.previewUrl}
                                alt={`Image ${index + 1}`}
                                className="w-full h-24 object-cover"
                            />
                            {image.isPreview && (
                                <div className="absolute top-1 left-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded shadow-sm">
                                    Preview
                                </div>
                            )}
                            {/* Togle for existing iamge */}
                            {image.isExisting && (
                                <div className="absolute bottom-1 right-1 bg-green-500 text-white text-[10px] px-1 py-0.5 rounded shadow-sm">
                                    Existing
                                </div>
                            )}
                            {/* delete button visible on hover */}
                            <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 w-7 p-0 shadow-lg hover:shadow-xl bg-background/95 backdrop-blur-sm border-2 border-background/80 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-muted-foreground mt-2">
                {images.length}/{maxImages} images •{" "}
                {images.find((img) => img.isPreview) ? "Preview selected" : "Select preview"}
            </p>
        </div>
    );
}
