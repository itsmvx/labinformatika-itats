"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface FreezeTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    freezeText: string
    spacing?: number // New prop for customizable spacing
}

const FreezeTextInput = React.forwardRef<HTMLInputElement, FreezeTextInputProps>(
    ({ className, freezeText, spacing = 2, ...props }, ref) => {
        const inputRef = React.useRef<HTMLInputElement>(null)
        const [freezeTextWidth, setFreezeTextWidth] = React.useState(0)

        React.useEffect(() => {
            if (inputRef.current) {
                const styles = window.getComputedStyle(inputRef.current)
                const font = styles.font
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                if (context) {
                    context.font = font
                    const width = context.measureText(freezeText).width
                    setFreezeTextWidth(Math.ceil(width))
                }
            }
        }, [freezeText])

        return (
            <div className="relative">
                <div
                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-0.5 text-sm text-muted-foreground"
                    aria-hidden="true"
                >
                    {freezeText}
                </div>
                <Input
                    className={cn("pl-[calc(0.75rem+var(--freeze-text-width)+var(--spacing))]", className)}
                    style={
                        {
                            "--freeze-text-width": `${freezeTextWidth}px`,
                            "--spacing": `${spacing}px`,
                        } as React.CSSProperties
                    }
                    ref={(node) => {
                        // @ts-ignore
                        inputRef.current = node
                        if (typeof ref === "function") {
                            ref(node)
                        } else if (ref) {
                            ref.current = node
                        }
                    }}
                    {...props}
                />
            </div>
        )
    },
)
FreezeTextInput.displayName = "FreezeTextInput"

export { FreezeTextInput }

