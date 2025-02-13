"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/time-picker-input";
import { id as localeId } from "date-fns/locale";

interface DateTimePickerProps {
    initialDate?: Date;
    onChange?: (date: Date | undefined) => void;
}
export function DateTimePicker({ initialDate, onChange }: DateTimePickerProps) {
    const [date, setDate] = React.useState<Date>();

    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);
    const handleSelect = (newDay: Date | undefined) => {
        if (!newDay) return;
        if (!date) {
            setDate(newDay);
            return;
        }
        const diff = newDay.getTime() - date.getTime();
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        const newDateFull = add(date, { days: Math.ceil(diffInDays) });
        setDate(newDateFull);
        if (onChange) {
            onChange(newDateFull);
        }
    };

    React.useEffect(() => {
        if (initialDate && initialDate !== date) {
            setDate(initialDate);
        }
    }, [initialDate, date]);

    React.useEffect(() => {
        if (onChange && date) {
            onChange(date);
        }
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full min-w-72 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP - HH:mm", { locale: localeId }) : <span>Pilih Tanggal dan waktu</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => handleSelect(d)}
                    locale={localeId}
                    initialFocus
                />
                <div className="p-3 border-t border-border">
                    <div className="flex items-end gap-2">
                        <div className="grid gap-1 text-center">
                            <Label htmlFor="hours" className="text-xs">
                                Jam
                            </Label>
                            <TimePickerInput
                                picker="hours"
                                date={ date }
                                setDate={ setDate }
                                ref={ hourRef }
                                onRightFocus={ () => minuteRef.current?.focus() }
                            />
                        </div>
                        <p className="mb-1 font-bold">
                            :
                        </p>
                        <div className="grid gap-1 text-center">
                            <Label htmlFor="minutes" className="text-xs">
                                Menit
                            </Label>
                            <TimePickerInput
                                picker="minutes"
                                date={ date }
                                setDate={ setDate }
                                ref={ minuteRef }
                                onLeftFocus={ () => hourRef.current?.focus() }
                                onRightFocus={ () => secondRef.current?.focus() }
                            />
                        </div>
                        <div className="flex h-10 items-center">
                            <Clock className="ml-2 h-4 w-4"/>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
