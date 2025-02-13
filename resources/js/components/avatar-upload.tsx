"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Loader2, Pencil, User2, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Cropper, { Area } from 'react-easy-crop'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface AvatarUploadProps {
    avatarSrc?: string;
    onUpload: (file: File) => void;
}

export function AvatarUpload({ avatarSrc, onUpload }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [isCropping, setIsCropping] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Gagal mengunggah gambar",
                    description: "Ukuran gambar melebihi 5MB!",
                    variant: "destructive",
                });
                return;
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string)
                setIsCropping(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous')
            image.src = url
        })

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob | null> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            return null
        }

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, 'image/jpeg')
        })
    }

    const handleCropSubmit = async () => {
        setIsSubmitting(true)
        try {
            if (imageSrc && croppedAreaPixels) {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
                if (croppedImageBlob) {
                    const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' })
                    onUpload(file);
                }
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Gagal mengunggah",
                description: "Oops.. terjadi error. Kode Kesalahan: AVATAR-UPLOAD-FE, cek console browser dan laporkan ke tim pengembang ya",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
            setIsCropping(false)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-3">
            <div className="relative group">
                <Avatar className="h-32 w-32 cursor-pointer border-2 border-muted-foreground/40 hover:border-blue-400/80 transition-colors" onClick={isSubmitting ? undefined : handleAvatarClick}>
                    <AvatarImage src={avatarSrc} alt="User Avatar" />
                    <AvatarFallback><User2 size={50} strokeWidth={1.5} /></AvatarFallback>
                </Avatar>
                {(isUploading || isSubmitting) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                )}
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full border-2 border-muted-foreground/40 group-hover:border-blue-400/90 group-hover:bg-blue-400/90 group-hover:text-zinc-100"
                    onClick={isSubmitting ? undefined : handleAvatarClick}
                    disabled={isUploading || isSubmitting}
                >
                    <Pencil />
                </Button>
            </div>
            <div className="text-xs font-medium text-center text-muted-foreground [&_span]:text-red-600 [&_span]:font-bold">
                <p><span>*</span>File gambar format jpg,jpeg,png</p>
                <p>Ukuran tidak lebih dari 5MB</p>
            </div>
            <Input
                type="file"
                accept="image/,.jpg,.jpeg,.png,.webp,"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                aria-label="Upload avatar"
            />
            <AlertDialog open={isCropping} onOpenChange={setIsCropping}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Crop your avatar</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="relative w-full h-64">
                        <Cropper
                            image={imageSrc || ''}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCropping(false)}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button onClick={handleCropSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Camera className="mr-2 h-4 w-4" />
                            )}
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

