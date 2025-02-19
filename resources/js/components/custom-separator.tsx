import { cn } from "@/lib/utils"

interface CustomSeparatorProps {
    orientation?: "horizontal" | "vertical"
    text?: string
    className?: string
    lineClassName?: string
    textClassName?: string
}

export function CustomSeparator({
                              orientation = "horizontal",
                              text,
                              className,
                              lineClassName,
                              textClassName,
                          }: CustomSeparatorProps) {
    const isHorizontal = orientation === "horizontal"

    return (
        <div className={cn("flex items-center", isHorizontal ? "w-full" : "h-full flex-col", className)}>
            <div className={cn("flex-grow", isHorizontal ? "h-px w-full" : "w-px h-full", "bg-gray-300", lineClassName)} />
            {text && (
                <span
                    className={cn("px-3", isHorizontal ? "text-sm" : "py-3 writing-vertical-rl", "text-gray-500", textClassName)}
                >
          {text}
        </span>
            )}
            <div className={cn("flex-grow", isHorizontal ? "h-px w-full" : "w-px h-full", "bg-gray-300", lineClassName)} />
        </div>
    )
}

