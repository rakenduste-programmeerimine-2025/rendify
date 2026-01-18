import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface Item {
    id: string;
    title: string;
    description: string;
    category: string;
    price_cents: number;
    images: string[];
    preview_image: string;
}

export function useEditItem() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const editItem = async (itemId: string, updates: Partial<Item>) => {
        setLoading(true);
        setError("");

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from("rent_offers")
                .update(updates)
                .eq("id", itemId);

            if (error) throw error;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { editItem, loading, error };
}
