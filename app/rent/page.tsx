import { createClient } from "@/lib/supabase/server";
import { createOffer } from "./actions";
import Link from "next/link";

export default async function Page() {
    // 1. Create the Supabase client (must be awaited)
    const supabase = await createClient();

    // 2. Fetch data
    const { data: offers, error } = await supabase
        .from("rent_offers_with_owner")
        .select(`
                *,
                RentDate (
                *
                )
            `);

    if (error) {
        console.error("Error fetching offers:", error);
    }

    // 3. Render directly
    return (
        <>
            <form action={createOffer}>
                <input name="title" placeholder="Title" required />
                <input name="price" type="number" placeholder="Price ($)" required />
                <input type="file" name="images" accept="image/*" required multiple />
                <button type="submit">
                    Create Offer
                </button>
            </form>
            <ul>
                {offers?.map((offer) => (
                    <li key={offer.id}><Link href={`/rent/${offer.id}`}>Title: {offer.title} Price: {offer.price_cents / 100} Images: {offer.image_urls?.length}</Link></li>
                ))}
            </ul>
        </>
    );
}