import React, { useCallback, useMemo } from 'react';
import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

type AnswerOption = {
    value: string;
    label: string;
};

interface AnswersRenderProps {
    options: AnswerOption[];
    selectedAnswer: string;
    onSelect: (value: string) => void;
}

const LetterRadio = React.memo(React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn("grid gap-2", className)}
            {...props}
            ref={ref}
        />
    )
}));
LetterRadio.displayName = "LetterRadio";

const LetterRadioItem = React.memo(React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border-2 border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
        </RadioGroupPrimitive.Item>
    )
}));
LetterRadioItem.displayName = "LetterRadioItem";

const AnswerOption = React.memo(({ option, isSelected, onSelect }: {
    option: AnswerOption;
    isSelected: boolean;
    onSelect: () => void;
}) => (
    <label
        htmlFor={ `option-${ option.value }` }
        className={ cn(
            "flex items-start space-x-3 p-2 rounded-sm border-2 transition-all cursor-pointer overflow-hidden",
            isSelected
                ? "bg-blue-100 border-blue-300"
                : "bg-white border-gray-200 hover:bg-gray-50"
        ) }
    >
        <div className="flex-shrink-0">
            <LetterRadioItem
                value={ option.value }
                id={ `option-${ option.value }` }
                className="sr-only"
            />
            <div className={ cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-base font-semibold",
                isSelected
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
            ) }>
                { option.value }
            </div>
        </div>
        <p className="my-auto text-sm">{ option.label }</p>
    </label>
));
AnswerOption.displayName = "AnswerOption";

export const AnswersRender = React.memo(function AnswersRender({ options, selectedAnswer, onSelect }: AnswersRenderProps) {
    const handleSelectAnswer = useCallback((value: string) => {
        onSelect(value);
    }, [onSelect]);

    const memoizedOptions = useMemo(() => options, [options]);

    return (
        <div className="space-y-2">
            <LetterRadio value={selectedAnswer} onValueChange={handleSelectAnswer}>
                {memoizedOptions.map((option) => (
                    <AnswerOption
                        key={option.value}
                        option={option}
                        isSelected={selectedAnswer === option.value}
                        onSelect={() => handleSelectAnswer(option.value)}
                    />
                ))}
            </LetterRadio>
        </div>
    );
});
