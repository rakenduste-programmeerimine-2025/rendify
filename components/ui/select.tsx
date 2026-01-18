"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type Option = {
    value: string;
    label: string;
};

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    options: Option[];
};

export function AppSelect({
                              value,
                              onChange,
                              placeholder = "Select…",
                              options,
                          }: Props) {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
                aria-label={placeholder}
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon className="ml-2">
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content className="z-50 overflow-hidden rounded-md border bg-muted text-popover-foreground shadow-md">
                    <Select.ScrollUpButton className="flex items-center justify-center py-1 text-xs text-muted-foreground">
                        <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-1">
                        {options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center py-1 text-xs text-muted-foreground">
                        <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

const SelectItem = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, className, ...props }, ref) => (
    <Select.Item
        ref={ref}
        className={cn(
            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
            "focus:bg-accent focus:text-accent-foreground",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="ml-auto flex h-4 w-4 items-center justify-center">
            <CheckIcon className="h-3 w-3" />
        </Select.ItemIndicator>
    </Select.Item>
));
SelectItem.displayName = "SelectItem";
