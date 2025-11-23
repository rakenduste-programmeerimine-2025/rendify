"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOffer(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const files = formData.getAll("images") as File[];
    const uploadedPaths: string[] = [];

    let errors = [];

    for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
            .from("OfferImages")
            .upload(fileName, file);

        if (error) {
            console.error("Upload error for", file.name, error);
            continue; // Skip failed uploads or handle error
        }
        errors.push(error);

        uploadedPaths.push(fileName);
    }

    if (errors.length == 0) {
        console.error("Upload errors:", errors);
        return;
    }

    const { error } = await supabase
        .from("RentOffer")
        .insert({
            title,
            price_cents: price * 100,
            image_urls: uploadedPaths
        });

    if (error) {
        console.error(error);
    }

    revalidatePath("/rent");
}
