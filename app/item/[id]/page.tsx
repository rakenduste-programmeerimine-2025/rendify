"use client";

import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import { useEffect, useState } from "react";
import { format, differenceInCalendarDays, addDays, isSameDay, set, setDate } from "date-fns";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

type Item = Database["public"]["Views"]["rent_offers_with_owner"]["Row"] & {
    rent_dates: Database["public"]["Tables"]["rent_dates"]["Row"][]
}

export default function ItemPage() {
    const router = useRouter();
    const { id } = useParams();
    if (!id) notFound();
    if (typeof id !== "string") notFound();
    if (id == "") notFound();

    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        (async () => {
            const supabase = await createClient();

            const itemResult = await supabase
                .from("rent_offers_with_owner")
                .select(`
                    *,
                    rent_dates (
                    *
                    )
                `)
                .eq("id", parseInt(id))
                .single();

            if (itemResult.error) {
                console.log("Error fetching item:", itemResult.error);
                notFound();
            };

            setItem(itemResult.data);
            console.log("item", itemResult.data);
        })();
    }, []);

    const [range, setRange] = useState<DateRange | undefined>();
    const disabledDates: Date[] =
        item?.rent_dates?.map(date => new Date(date.from)) ?? [];

    function countActiveDays(range: DateRange | undefined, disabled: Date[]): number {
        if (!range?.from || !range?.to) return 0;

        const totalDays =
            differenceInCalendarDays(range.to, range.from) + 1; // включительно[web:53]

        let activeDays = 0;

        for (let i = 0; i < totalDays; i++) {
            const day = addDays(range.from, i);
            const isDisabled = disabled.some(d => isSameDay(d, day));
            if (!isDisabled) {
                activeDays++;
            }
        }

        return activeDays;
    }

    async function book() {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("rent_dates")
            .insert({
                from: range?.from,
                to: range?.to,
                rent_offer: item!.id,
                price_cents: item!.price_cents,
            })
            .select("id");

        if (error) {
            console.error("Error creating rent offer:", error);
            return
        }

        setRange(undefined);
        router.push(`/item/${item!.id}`);
    }

    const nights = countActiveDays(range, disabledDates);
    const totalPrice = nights * (item?.price_cents || 0) / 100;

    return (
        <div className="flex flex-col gap-6 p-6 w-full min-h-svh items-start max-w-6xl">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft size="16" strokeWidth={2} />Back to search
            </Button>
            <div className="flex gap-6 w-full">
                <Card className={"w-full h-fit"}>
                    <CardContent className={"flex flex-col gap-3 pt-6"}>
                        <label>{item?.title}</label>
                        <div className={"p-1 rounded-lg text-xs bg-primary w-fit"}>Group</div>
                        <label className={"text-xl"}>Description:</label>
                        <label className={"text-muted-foreground"}>{item?.description}</label>
                        <label className={"text-xl"}>Price:</label>
                        <label><span className={"text-primary"}>{(item?.price_cents || 0) / 100}€</span> per day</label>
                        <label className={"text-xl"}>Location:</label>
                        <div className={"flex gap-1.5 items-center text-muted-foreground"}>
                            <MapPin size="16" strokeWidth={2} />
                            {item?.location}
                        </div>
                        <label className={"text-xl"}>Owner:</label>
                        <label>{item?.user_name}</label>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Renting info</CardTitle>
                    </CardHeader>
                    <CardContent className={"flex flex-col gap-3"}>
                        <CardDescription>
                            Select dates
                        </CardDescription>
                        <DateRangePicker
                            value={range}
                            onChange={setRange}
                            disabledDates={disabledDates}
                        />
                        {disabledDates.length > 0 &&
                            <div>
                                <CardDescription>
                                    Reserved dates:
                                </CardDescription>
                                <div className={"flex gap-3 flex-wrap"}>
                                    {disabledDates.map((date, index) => (
                                        <div className={"border border-b p-1 rounded-lg text-xs"} key={index}>{format(date, "dd.MM.yyyy")}</div>
                                    ))}
                                </div>
                            </div>
                        }
                        {nights > 0 &&
                            <div className={"rounded-2xl bg-muted p-3 gap-1.5 flex flex-col"}>
                                <div className={"flex justify-between"}>
                                    <label className={"text-muted-foreground"}>
                                        Dates:
                                    </label>
                                    {range?.from && range?.to && (
                                        <p className="text-sm">
                                            {format(range.from, "dd.MM.yyyy")} – {format(range.to, "dd.MM.yyyy")}
                                        </p>
                                    )}
                                </div>
                                <div className={"flex justify-between"}>
                                    <label className={"text-muted-foreground"}>
                                        Days:
                                    </label>
                                    <label className={"text-muted-foreground"}>
                                        {nights}
                                    </label>
                                </div>
                                <div className={"h-px w-full bg-border"} />
                                <div className={"flex justify-between"}>
                                    <label>Total:</label>
                                    <label className={"text-primary"}>{totalPrice}€</label>
                                </div>
                            </div>
                        }
                        <Button disabled={nights == 0} onClick={() => book()}>
                            <Calendar size="16" strokeWidth={2} />
                            Book
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
