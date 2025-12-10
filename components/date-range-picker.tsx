"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { enGB } from "date-fns/locale";
import { isSameDay } from "date-fns";

type RangeCalendarProps = {
    value: DateRange | undefined;
    onChange: (value: DateRange | undefined) => void;
    disabledDates?: Date[];
    className?: string;
};

export function DateRangePicker({
                                  value,
                                  onChange,
                                  disabledDates = [],
                                  className,
                              }: RangeCalendarProps) {

    const today = new Date();

    return (
        <div className={cn("rounded-2xl border border-b p-4", className)}>
            <Calendar
                mode="range"
                selected={value}
                onSelect={onChange}
                numberOfMonths={1}
                locale={enGB}
                disabled={[
                    { before: today },
                    (day) => disabledDates.some((d) => isSameDay(d, day)),
                ]}
                excludeDisabled
                fromMonth={today}
                className={cn(
                    "mx-auto w-full text-sm",
                    "[&_.rdp-day_selected]:bg-[#5b6bff] [&_.rdp-day_selected]:text-white",
                    "[&_.rdp-day_range_start]:rounded-l-full [&_.rdp-day_range_end]:rounded-r-full",
                    "[&_.rdp-day_range_middle]:bg-[#e0e4ff] [&_.rdp-day_range_middle]:text-slate-900",
                    "[&_.rdp-day]:h-8 [&_.rdp-day]:w-8"
                )}
            />
        </div>
    );
}
