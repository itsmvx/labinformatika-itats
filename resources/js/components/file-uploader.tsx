import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const FileUploader = ({ className, onFileUpload, }: {
    className?: string;
    onFileUpload: (file: File) => void;
}) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            handleFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        multiple: false,
    });

    const handleFile = (file: File) => {
        setFile(file);
        onFileUpload(file);
    };

    const removeFile = () => {
        setFile(null);
    };

    return (
        <Card className={cn("w-full max-w-md mx-auto", className)}>
            <CardContent className="p-6">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        Tarik dan lepaskan file excel disini atau klik untuk memilih file
                    </p>
                </div>
                {file && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <File className="h-6 w-6 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={removeFile}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
