import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { createRentDate } from "./actions";

export default async function OfferPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the specific offer
    const { data: offer, error } = await supabase
        .from("rent_offers_with_owner")
        .select("*, RentDate(*)")
        .eq("id", id)
        .single();

    if (error || !offer) {
        console.error("Error fetching offer:", error);
        notFound();
    }

    return (
        <div>
            <h1>{offer.title}</h1>
            <p>${offer.price_cents / 100}</p>
            <p>{offer.description}</p>
            <p>{offer.location}</p>
            <p>{offer.owner_username}</p>
            <div>
                {offer.image_urls?.map((url: string) => (
                    <img
                        key={url}
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${url}`}
                        alt={offer.title}
                    />
                ))}
            </div>
            <div>
                {offer.RentDate.map((date: { from: string; to: string }) => (
                    <p key={date.from}>{date.from} - {date.to}</p>
                ))}
            </div>

            <div>
                <h3>Chose dates</h3>
                <form action={createRentDate}>
                    <input type="hidden" name="offerId" value={id} />
                    <div>
                        <div>
                            <label>Start Date</label>
                            <input type="date" name="from" required />
                        </div>
                        <div>
                            <label>End Date</label>
                            <input type="date" name="to" required />
                        </div>
                    </div>
                    <button type="submit">
                        Add Date
                    </button>
                </form>
            </div>
        </div>
    );
}