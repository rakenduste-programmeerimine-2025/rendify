"use client";

import dynamic from "next/dynamic";
import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { format, differenceInCalendarDays, addDays, isSameDay, set, setDate, startOfDay, isBefore } from "date-fns";
import {ArrowLeft, MapPin, Calendar, CalendarDays, ChevronRight, ChevronLeft} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";
import { TOOL_CATEGORIES } from "@/app/tool-categories";
import { Modal } from "@/components/ui/modal";
import { useRentItem } from "@/hooks/useRentItem";
import {cn} from "@/lib/utils";

type Item = Database["public"]["Views"]["rent_offers_with_owner"]["Row"] & {
    rent_dates: Database["public"]["Tables"]["rent_dates"]["Row"][]
}

const DateRangePicker = dynamic(
    () => import("@/components/date-range-picker").then(mod => mod.DateRangePicker),
    { ssr: false }
);

export default function ItemPage() {
    const router = useRouter();
    const { id } = useParams();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    if (!id) notFound();
    if (typeof id !== "string") notFound();
    if (id == "") notFound();

    const [item, setItem] = useState<Item | null>(null);
    const [imageIndex, setImageIndex] = useState(0);

    const { rentItem, loading: rentLoading } = useRentItem(item?.price_cents / 100 || 0);

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

    type RentDate = {
        from: string;
        to: string;
    };

    const today = startOfDay(new Date());

    const disabledDates: Date[] =
        item?.rent_dates
            ?.flatMap((r: RentDate) => {
                const from = startOfDay(new Date(r.from));
                const to = startOfDay(new Date(r.to));

                const days = differenceInCalendarDays(to, from) + 1;

                return Array.from({ length: days }, (_, i) => {
                    const day = addDays(from, i);
                    return isBefore(day, today) ? null : day;
                }).filter((d): d is Date => d !== null);
            }) ?? [];

    const futureRanges =
        item?.rent_dates?.filter((r) => !isBefore(startOfDay(new Date(r.to)), today)) ?? [];

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
        if (nights === 0 || !range?.from || !range?.to) return;

        // Show modal
        setShowConfirmModal(true);
    }

    const confirmBook = async () => {
        if (!range?.from || !range?.to || !item) return;

        // call hook
        const result = await rentItem(item.id, {
            startDate: range.from.toISOString(),
            endDate: range.to.toISOString()
        });

        if (result.success) {
            setShowConfirmModal(false);
            setRange(undefined);
            router.refresh(); // update renge dates
        }
    };

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
                        <div className={"p-1 rounded-lg text-xs bg-primary w-fit"}>{TOOL_CATEGORIES.find((c) => c.value === item?.category)?.label ?? ""}</div>
                        <div>
                            {item?.image_urls?.length > 0 ? (
                                <div className="relative w-full max-w-2xl mx-auto"> {/* ✅ max-w */}
                                    {/* Main image - responsive */}
                                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:h-80 rounded-2xl overflow-hidden shadow-2xl group">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${item.image_urls[imageIndex]}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 brightness-100 group-hover:brightness-105"
                                        />
                                    </div>

                                    {/* mini images */}
                                    {item.image_urls.length > 1 && (
                                        <div className="flex gap-2 sm:gap-3 mt-4 p-2 -mx-2 sm:-mx-4 overflow-x-auto pb-3 scrollbar-thin bg-muted/30 rounded-xl border backdrop-blur-sm">
                                            {item.image_urls.map((url, index) => (
                                                <button
                                                    key={url}
                                                    onClick={() => setImageIndex(index)}
                                                    className={cn(
                                                        // Responsive size
                                                        "relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300",

                                                        // Active
                                                        index === imageIndex
                                                            ? "ring-2 ring-accent/80 shadow-accent/30 border-2 border-accent scale-[1.06] bg-accent/10"
                                                            : "hover:scale-105 hover:shadow-lg hover:border-accent/40 border border-transparent",

                                                        "hover:-translate-y-1 active:scale-[0.98]"
                                                    )}
                                                >
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${url}`}
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-full object-cover brightness-110 hover:brightness-120 transition-all"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Counter */}
                                    {item.image_urls.length > 1 && (
                                        <div className="text-center mt-3 p-2 bg-muted/50 rounded-lg backdrop-blur-sm">
                                            <span className="text-sm font-semibold text-foreground">
                                                {imageIndex + 1} / {item.image_urls.length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Responsive placeholder
                                <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-gradient-to-br from-muted to-muted-foreground/10 rounded-2xl flex items-center justify-center shadow-xl">
                                    <div className="text-muted-foreground text-lg font-medium px-4 text-center">
                                        No images available
                                    </div>
                                </div>
                            )}

                        </div>
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
                        <label>{item?.owner_name}</label>
                    </CardContent>
                </Card>

                <Card className={"max-w-min"}>
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
                        {futureRanges.length > 0 && (
                            <div>
                                <CardDescription>Reserved dates:</CardDescription>
                                <div className="flex gap-3 flex-wrap">
                                    {futureRanges.map((date, index) => (
                                        <div
                                            key={index}
                                            className="border border-b p-1 rounded-lg text-xs"
                                        >
                                            {format(new Date(date.from), "dd.MM.yyyy")} -{" "}
                                            {format(new Date(date.to), "dd.MM.yyyy")}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

            {/* New modal for submiting */}
            <Modal
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
                title="Confirm Booking"
                description="Review your rental details before confirming"
                className="max-w-sm"
            >
                <div className="space-y-4 p-4">
                    {/* Selected dates */}
                    <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CalendarDays size={18} />
                            <span className="font-medium">Rental Period:</span>
                        </div>
                        <div className="text-lg font-bold">
                            {range?.from ? format(range.from, "dd.MM.yyyy") : "–"}
                            <span className="mx-2">→</span>
                            {range?.to ? format(range.to, "dd.MM.yyyy") : "–"}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {nights} {nights === 1 ? "day" : "days"}
                        </div>
                    </div>

                    {/* Amount of rent */}
                    <div className="p-4 bg-accent/10 border rounded-lg text-center">
                        <div className="text-3xl font-bold text-accent-foreground">
                            €{totalPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Total cost
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmBook}
                            disabled={rentLoading}
                            className="flex-1 gap-2"
                        >
                            {rentLoading ? "Booking..." : "Confirm & Book"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
