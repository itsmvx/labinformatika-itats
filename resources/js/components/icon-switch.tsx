import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IconSwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
}

const IconSwitch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    IconSwitchProps
>(({ className, checkedIcon, uncheckedIcon, ...props }, ref) => {
    return (
        <SwitchPrimitives.Root
            className={cn(
                "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
                className
            )}
            {...props}
            ref={ref}
        >
            <SwitchPrimitives.Thumb
                className={cn(
                    "pointer-events-none flex items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 h-7 w-7"
                )}
            >
                {props.checked ? (
                    checkedIcon ? checkedIcon : null
                ) : (
                    uncheckedIcon ? uncheckedIcon : null
                )}
            </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
    );
});

IconSwitch.displayName = SwitchPrimitives.Root.displayName;

export { IconSwitch };
