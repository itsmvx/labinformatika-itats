import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Stepper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    steps: { title: string; description?: string }[]
    currentStep: number
    hideDescriptionInSmallBreakpoint?: boolean
}
>(({ steps, currentStep, hideDescriptionInSmallBreakpoint = false, className, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("flex w-full justify-between !text-sm md:text-base", className)} {...props}>
            {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center mx-0.5">
                    <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold",
                            currentStep >= (index + 1)
                                ? "border-primary bg-primary text-primary-foreground"
                                : currentStep === (index + 1)
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground text-muted-foreground",
                        )}
                    >
                        {currentStep > (index + 1)
                            ? <CheckIcon className="h-6 w-6" />
                            : <span>{index + 1}</span>}
                    </div>
                    <div className="mt-2 text-center">
                        <div className="text-sm font-medium">{step.title}</div>
                        {step.description && <div className={ `${hideDescriptionInSmallBreakpoint ? 'hidden md:block' : 'block'} text-xs text-muted-foreground` }>{step.description}</div>}
                    </div>
                </div>
            ))}
        </div>
    )
})
Stepper.displayName = "Stepper"

export { Stepper }

