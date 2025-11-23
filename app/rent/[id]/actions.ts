"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createRentDate(formData: FormData) {
    const supabase = await createClient();

    const offerId = formData.get("offerId") as string;
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;

    const { error } = await supabase
        .from("RentDate")
        .insert({
            rent_offer: offerId,
            from,
            to,
        });

    if (error) {
        console.error("Error creating rent date:", error);
    }

    revalidatePath(`/rent/${offerId}`);
}