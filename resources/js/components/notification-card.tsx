import { ReactNode, useState } from 'react'
import { X } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

interface NotificationCardProps {
    children: ReactNode;
    className?: string;
    onClose?: () => void;
}

export function NotificationCard({ children, className, onClose }: NotificationCardProps) {
    const [isVisible, setIsVisible] = useState(true);
    const handleSetInvisible = (): void => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <Card className={ cn("w-full max-w-md mx-auto", className) }>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1.5">
                    { children }
                </div>
                <Button
                    variant="ghost"
                    onClick={handleSetInvisible}
                    aria-label="Close notification"
                    className="self-start"
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    )
}

