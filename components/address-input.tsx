"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Suggestion = {
    id: string | number;
    formatted: string;
    lat?: number;
    lon?: number;
};

export function AddressInput({
                                 value,
                                 onChange,
                                 onValidAddressChange,
                             }: {
    value: string;
    onChange: (v: string) => void;
    onValidAddressChange?: (s: Suggestion | null) => void;
}) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Suggestion | null>(null);
    const [touched, setTouched] = useState(false); // пользователь что‑то вводил
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selected && value === selected.formatted) {
            setSuggestions([]);
            return;
        }

        if (selected && value !== selected.formatted) {
            setSelected(null);
            onValidAddressChange?.(null);
        }

        if (value.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/address-autocomplete?q=${encodeURIComponent(value)}`,
                    { signal: controller.signal }
                );
                const data: Suggestion[] = await res.json();
                setSuggestions(data);
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, [value, selected, onValidAddressChange]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) {
                setSuggestions([]);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (val: string) => {
        if (!touched) setTouched(true);
        onChange(val);
    };

    const handleSelect = (s: Suggestion) => {
        setTouched(true);
        onChange(s.formatted);
        setSelected(s);
        onValidAddressChange?.(s);
        setSuggestions([]);
    };

    const isValid = !!selected && value === selected.formatted;
    const showInvalidMessage = touched && value.trim().length >= 3 && !isValid;

    return (
        <div className="relative" ref={wrapperRef}>
            <Input
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter address in Estonia..."
                autoComplete="off"
            />
            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    …
                </div>
            )}
            {suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-muted text-popover-foreground shadow-md">
                    {suggestions.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSelect(s)}
                            className={cn(
                                "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            {s.formatted}
                        </button>
                    ))}
                </div>
            )}

            {/* сообщение о валидности */}
            {isValid && (
                <p className="mt-1 text-xs text-emerald-600">
                    Address on valid.
                </p>
            )}
            {showInvalidMessage && (
                <p className="mt-1 text-xs text-red-600">
                    Address not found. Please select from suggested addresses.
                </p>
            )}
        </div>
    );
}
