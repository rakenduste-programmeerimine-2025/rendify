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
    const [maxPrice, setMaxPrice] = useState(60);
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

            let query = supabase
                .from("rent_offers_with_owner")
                .select(`
                        *,
                        rent_dates (
                        *
                        )
                    `)
                .lte("price_cents", maxPrice * 100)
                .or(`title.like.%${name}%,description.like.%${name}%`)


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
    }, [name, maxPrice, category]);

    return (
        <div className="flex min-h-svh w-full p-6 md:p-10 gap-6 max-w-6xl">
            <ProductFilters
                name={name}
                setName={setName}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
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
                    <Card key={product.id} className={"h-full flex flex-col"}>
                        <CardHeader>
                            <CardTitle className="text-base">{product.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {product.description}
                            </CardDescription>
                            {product.location &&
                                <CardDescription className={"flex gap-2 items-center"}>
                                    <MapPin size="26" strokeWidth={2} />{product.location}
                                </CardDescription>
                            }
                        </CardHeader>
                        <CardContent className={"flex flex-row justify-between align-items-bottom items-center mt-auto"}>
                            <Label className={"text-muted-foreground"}>{product.price_cents / 100}€ per day</Label>
                            <Link href={`item/${product.id}`}>
                                <Button>View</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
