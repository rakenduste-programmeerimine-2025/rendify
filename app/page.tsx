"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ProductFilters } from "@/components/product-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

type Item = Database["public"]["Views"]["rent_offers_with_owner"]["Row"] & {
    rent_dates: Database["public"]["Tables"]["rent_dates"]["Row"][]
}

export default function Home() {
    const [name, setName] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100);
    const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
    const [distance, setDistance] = useState(15);
    const [category, setCategory] = useState<string>("");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(tomorrowISO);
    const [endDate, setEndDate] = useState(tomorrowISO);

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        (async () => {
            const supabase = await createClient();

            let min_max = await supabase
                .rpc("get_offer_price_min_max");

            if (min_max.error) {
                console.log("Error fetching min_max:", min_max.error);
                return;
            }

            setMinPrice(min_max.data[0].min_price_cents / 100);
            setMaxPrice(min_max.data[0].max_price_cents / 100);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const supabase = await createClient();

            let query = supabase
                .from("rent_offers_with_owner")
                .select(`
                        *,
                        rent_dates (
                        *
                        )
                    `)
                .or(`title.like.%${name}%,description.like.%${name}%`)

            if (maxPriceFilter !== null && maxPriceFilter !== undefined) {
                query = query.lte("price_cents", maxPriceFilter * 100);
            }

            if (category != "") {
                console.log("category", category);
                query = query.eq("category", category);
            }

            const itemResult = await query;

            if (itemResult.error) {
                console.log("Error fetching item:", itemResult.error);
                notFound();
            };

            setItems(itemResult.data);
        })();
    }, [name, maxPriceFilter, category]);

    return (
        <div className="flex min-h-svh w-full p-6 md:p-10 gap-6 max-w-6xl">
            <ProductFilters
                name={name}
                setName={setName}
                minPrice={minPrice}
                maxPrice={maxPrice}
                maxPriceFilter={maxPriceFilter || maxPrice}
                setMaxPriceFilter={setMaxPriceFilter}
                distance={distance}
                setDistance={setDistance}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                category={category}
                setCategory={setCategory}
            />

            <div className="w-full grid grid-cols-3 gap-6 h-fit">
                {items.map((product) => (
                    <Card key={product.id} className="h-full flex flex-col">
                        <CardHeader className="flex-1">
                            <CardTitle className="text-base">{product.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {product.description}
                            </CardDescription>

                            {/* Improved image - no text for missing images */}
                            {product.image_urls && product.image_urls.length > 0 && (
                                <div className="relative w-full aspect-[4/3] max-w-full rounded-xl overflow-hidden shadow-lg group mt-2">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${product.image_urls[0]}`}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-105 hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                                </div>
                            )}

                            {product.location && (
                                <CardDescription className="flex gap-2 items-center mt-2">
                                    <MapPin size="20" strokeWidth={2} />
                                    {product.location}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="flex flex-row justify-between items-end mt-auto pt-2">
                            <Label className="text-muted-foreground text-lg font-medium">
                                {product.price_cents / 100}€ / day
                            </Label>
                            <Link href={`item/${product.id}`}>
                                <Button size="sm" className="px-4">View</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
