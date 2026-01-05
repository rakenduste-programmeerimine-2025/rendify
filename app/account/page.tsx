"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getUser } from "./server";
import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Delete, Eye, Pencil, Trash } from "lucide-react";

type Rented = Database["public"]["Tables"]["rent_dates"]["Row"] & {
    rent_offer: {
        id: Database["public"]["Tables"]["rent_offers"]["Row"]["id"]
        title: Database["public"]["Tables"]["rent_offers"]["Row"]["title"]
        location: Database["public"]["Tables"]["rent_offers"]["Row"]["location"]
    }
}

type RentedOut = Database["public"]["Views"]["rent_dates_with_renter"]["Row"] & {
    rent_offer: {
        id: Database["public"]["Tables"]["rent_offers"]["Row"]["id"]
        title: Database["public"]["Tables"]["rent_offers"]["Row"]["title"]
        location: Database["public"]["Tables"]["rent_offers"]["Row"]["location"]
    }
}

export default function Page() {
    const [user, setUser] = useState<User | null>(null);
    const [items, setItems] = useState<Database["public"]["Tables"]["rent_offers"]["Row"][]>([]);
    const [rentedOut, setRentedOut] = useState<RentedOut[]>([]);
    const [rented, setRented] = useState<Rented[]>([]);

    useEffect(() => {
        (async () => {
            const user = await getUser();
            setUser(user);

            const supabase = await createClient();

            const rentOffersResult = await supabase
                .from("rent_offers")
                .select(`
                    *`)
                .eq("user_id", user?.id);

            if (rentOffersResult.error) {
                console.log("Error fetching item:", rentOffersResult.error);
            }
            else {
                setItems(rentOffersResult.data);

                console.log(rentOffersResult.data.map(offer => offer.id))

                const rentedOutResult = await supabase
                    .from("rent_dates_with_renter")
                    .select(`
                    *, rent_offer (id, title, location)`)
                    .in("rent_offer", rentOffersResult.data.map(offer => offer.id))
                    .order("from", { ascending: false });

                if (rentedOutResult.error) {
                    console.log("Error fetching item:", rentedOutResult.error);
                }
                else {
                    setRentedOut(rentedOutResult.data);
                    console.log(rentedOutResult.data);
                }
            }

            const rentedResult = await supabase
                .from("rent_dates")
                .select(`
                    *, rent_offer (id, title, location)`)
                .eq("user_id", user?.id);

            if (rentedResult.error) {
                console.log("Error fetching item:", rentedResult.error);
            }
            else {
                setRented(rentedResult.data);
            }
        })();
    }, []);

    const [activeCard, setActiveCard] = useState('myItems');

    const cards = [
        { id: "myItems", label: "My items" },
        { id: "rented", label: "Rented" },
        { id: "rentedOut", label: "Rented out" }
    ]

    async function deleteItem(id: number) {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("rent_offers")
            .delete()
            .eq("id", id)

        if (error) {
            console.error("Error creating rent offer:", error);
            return
        }
        setItems(items.filter(item => item.id !== id));
    }

    return (
        <div className="flex flex-col min-h-svh w-full p-6 md:p-10 gap-6 max-w-6xl">
            <Label className={"text-xl"}>
                My account
            </Label>
            <div className={"flex gap-6 w-full"}>
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Profile info</CardTitle>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-3"}>
                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Name
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.user_metadata.first_name} {user?.user_metadata.last_name}
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Email
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.email}
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Phone
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.phone || "-"}
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Address
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.user_metadata.address || "-"}
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full flex flex-col gap-6">
                    <div className="flex bg-muted p-2 rounded-lg justify-around">
                        {cards.map(({ id, label }) => {
                            const isActive = id === activeCard;
                            return (
                                <Label
                                    key={id}
                                    onClick={() => setActiveCard(id)}
                                    className={`text-base ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                                >
                                    {label} ({id == "myItems" && items.length}{id == "rented" && rented.length}{id == "rentedOut" && rentedOut.length})
                                </Label>
                            )
                        })}
                    </div>
                    {
                        activeCard === "myItems" &&
                        items.map((item) => (
                            <Card key={item.id} className={"h-fit flex flex-col"}>
                                <CardHeader className={"flex gap-6 flex-row"}>
                                    <div className={"w-full flex flex-col"}>
                                        <CardTitle className="text-base">{item.title}</CardTitle>
                                        <CardDescription>
                                            {item.description}
                                        </CardDescription>
                                        <CardDescription>
                                            {item.location}
                                        </CardDescription>
                                        <CardDescription>
                                            {item.price_cents / 100}€ per day
                                        </CardDescription>
                                    </div>
                                    <div className={"flex gap-2"}>
                                        <Link href={`item/${item.id}`}>
                                            <Button variant={"outline"} className={"p-2"}>
                                                <Eye size={16} strokeWidth={2} />
                                            </Button>
                                        </Link>
                                        <Button variant={"outline"} className={"p-2"}><Pencil size={16} strokeWidth={2} /></Button>
                                        <Button variant={"outline"} className={"p-2 hover:bg-red-500 hover:text-black"} onClick={() => deleteItem(item.id)}><Trash size={16} strokeWidth={2} /></Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    }
                    {
                        activeCard === "rented" &&
                        rented.map((rented) => (
                            <Card key={rented.id} className={"h-fit flex flex-col"}>
                                <CardHeader className={"flex gap-6 flex-row"}>
                                    <div className={"w-full flex flex-col"}>
                                        <CardTitle className="text-base">{rented.rent_offer.title}</CardTitle>
                                        <CardDescription>
                                            {rented.rent_offer.location}
                                        </CardDescription>
                                        <CardDescription>
                                            From: {rented.from}
                                        </CardDescription>
                                        <CardDescription>
                                            To: {rented.to}
                                        </CardDescription>
                                    </div>
                                    <div className={"flex gap-2"}>
                                        <Link href={`item/${rented.id}`}>
                                            <Button variant={"outline"} className={"p-2"}>
                                                <Eye size={16} strokeWidth={2} />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    }
                    {
                        activeCard === "rentedOut" &&
                        rentedOut.map((rented) => (
                            <Card key={rented.id} className={"h-fit flex flex-col"}>
                                <CardHeader className={"flex gap-6 flex-row"}>
                                    <div className={"w-full flex flex-col"}>
                                        <CardTitle className="text-base">{rented.rent_offer.title}</CardTitle>
                                        <CardDescription>
                                            {rented.renter_name}
                                        </CardDescription>
                                        <CardDescription>
                                            From: {rented.from}
                                        </CardDescription>
                                        <CardDescription>
                                            To: {rented.to}
                                        </CardDescription>
                                    </div>
                                    <div className={"flex gap-2"}>
                                        <Link href={`item/${rented.id}`}>
                                            <Button variant={"outline"} className={"p-2"}>
                                                <Eye size={16} strokeWidth={2} />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
