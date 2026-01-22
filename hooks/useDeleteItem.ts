import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function useDeleteItem() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const deleteItem = async (itemId: string) => {
        setLoading(true);
        setError("");

        try {
            const supabase = createClient();

            // Delete item images
            // ADD LOGIC

            // Delete item
            const { error } = await supabase
                .from("rent_offers")
                .delete()
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

    return { deleteItem, loading, error };
}
