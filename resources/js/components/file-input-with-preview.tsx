'use client';

import { useCallback, useRef, ChangeEvent, useState, useEffect, DragEvent, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileScan, Upload, ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface FileInputWithPreviewProps {
    id: string;
    value: File | null;
    onChange: (value: File | null) => void;
    allowedTypes: string[];
    placeholder?: string;
    errorMessage?: string;
    maxSize?: number;
    maxSizeMessage?: string;
}

export function FileInputWithPreview({ id, value, onChange, allowedTypes, placeholder, errorMessage, maxSize, maxSizeMessage }: FileInputWithPreviewProps) {
    const { toast } = useToast();
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptString = useMemo(() => allowedTypes.join(','), [allowedTypes]);

    useEffect(() => {
        if (value) {
            if (value.type === "application/pdf") {
                const url = URL.createObjectURL(value);
                setPreview(url);
            } else {
                const reader = new FileReader();
                reader.onload = (e) => setPreview(e.target?.result as string);
                reader.readAsDataURL(value);
            }
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = useCallback((file: File | null) => {
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Periksa kembali input Anda!",
                description: errorMessage ?? `Hanya file dengan tipe ${allowedTypes.join(', ')} yang diperbolehkan.`,
            });
            onChange(null);
            return;
        }

        if (maxSize && file.size > maxSize * 1024) {
            toast({
                variant: "destructive",
                title: "Ukuran file terlalu besar!",
                description: maxSizeMessage ?? `Maksimum ukuran file adalah ${maxSize / 1024} MB.`,
            });
            onChange(null);
            return;
        }

        onChange(file);
    }, [onChange, toast, allowedTypes, maxSize, maxSizeMessage]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        handleFileChange(selectedFile);
    }, [handleFileChange]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    }, [handleFileChange]);

    const handleCancel = useCallback(() => {
        onChange(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [onChange]);

    const renderPreview = useCallback(() => {
        if (!value || !preview) return null;
        return value.type.startsWith('image/')
            ? <img src={preview || "/placeholder.svg"} alt="File preview" className="object-contain" />
            : <iframe src={preview} className="w-full h-full min-h-[500px]" title="File Preview" />;
    }, [value, preview]);

    return (
        <div className="w-full max-w-md mx-auto">
            {value ? (
                <Card className="mt-2 px-5 py-4 rounded-sm !shadow-none mx-auto border-none">
                    <div className="flex items-center justify-between gap-1 mb-2">
                        {value.type.startsWith('image/') ? <ImageIcon /> : <FileScan />}
                        <span className="font-medium truncate">{value.name}</span>
                    </div>
                    <div className="bg-gray-100 rounded-sm p-0 flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
                        {renderPreview()}
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button size="icon" className="bg-red-600/80 hover:bg-red-600" onClick={handleCancel}>
                            <Trash2 />
                        </Button>
                    </div>
                </Card>
            ) : (
                <>
                    <div
                        className={`relative w-full aspect-[3/4] rounded my-2.5 flex items-center justify-center cursor-pointer ${
                            isDragging ? 'border-2 border-dashed border-blue-500' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Skeleton className="absolute inset-0 w-full h-full !animate-none">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Upload className="mb-2 text-gray-400" />
                                <p className="mt-2 text-sm text-center text-gray-500">
                                    {placeholder ?? 'Drag & drop file here or click to select'}
                                </p>
                            </div>
                        </Skeleton>
                    </div>
                    <input
                        type="file"
                        accept={acceptString}
                        onChange={handleInputChange}
                        className="hidden"
                        ref={fileInputRef}
                        id={`file-input-${id}`}
                    />
                </>
            )}
        </div>
    );
}
