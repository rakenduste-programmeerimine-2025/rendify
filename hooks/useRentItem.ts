"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export interface RentDates {
    startDate: string;  // ISO string от DateRangePicker
    endDate: string;
}

interface UseRentItemReturn {
    rentItem: (itemId: string, dates: RentDates) => Promise<{
        success: boolean;
        error?: string;
    }>;
    loading: boolean;
    error: string;
}

export function useRentItem(itemPricePerDayCents: number): UseRentItemReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const rentItem = async (itemId: string, dates: RentDates) => {
        setLoading(true);
        setError("");

        try {
            const supabase = createClient();

            // Твоя точная логика insert
            const { data, error } = await supabase
                .from("rent_dates")
                .insert({
                    from: dates.startDate,     // range.from.toISOString()
                    to: dates.endDate,         // range.to.toISOString()
                    rent_offer: parseInt(itemId),
                    price_cents: itemPricePerDayCents  // из пропсов
                })
                .select("id");

            if (error) {
                console.error("Rent error:", error);
                setError(error.message);
                return { success: false, error: error.message };
            }

            console.log("Rental created:", data);
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { rentItem, loading, error };
}
