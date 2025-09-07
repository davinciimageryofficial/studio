
"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { UploadCloud, X, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MediaUploaderProps {
  onUpload: (url: string) => void;
  className?: string;
}

export function MediaUploader({ onUpload, className }: MediaUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB.");
        return;
      }
      
      setError(null);
      setIsLoading(true);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        onUpload(dataUrl); // In a real app, this would be the URL from the storage service
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileChange({ target: { files: [file] } } as any);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUpload(""); // Clear the URL
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
        {preview ? (
            <div className="relative w-full aspect-video rounded-md overflow-hidden group">
                <Image src={preview} alt="Image Preview" layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleRemoveImage}
                        className="rounded-full"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Remove Image</span>
                    </Button>
                </div>
            </div>
        ) : (
             <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full p-6 border-2 border-dashed rounded-md text-center cursor-pointer hover:border-primary transition-colors"
                onClick={handleButtonClick}
            >
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    {isLoading ? (
                        <>
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-sm">Uploading...</p>
                        </>
                    ) : (
                         <>
                            <UploadCloud className="h-8 w-8" />
                            <p className="text-sm">Drag & drop or <span className="text-primary font-semibold">browse</span></p>
                            <p className="text-xs">Supports JPG, PNG. Max 5MB.</p>
                         </>
                    )}
                </div>
            </div>
        )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
        disabled={isLoading}
      />
      {error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

