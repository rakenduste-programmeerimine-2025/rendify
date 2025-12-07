"use client"; // если нужен клиентский компонент

import { useParams } from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import products from '../../../products.json';
import {useState} from "react";
import { format, differenceInCalendarDays, addDays, isSameDay } from "date-fns";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ItemPage() {
    const router = useRouter();
    const params = useParams();
    const item = products.find((product: any) => product.id === params.id);
    const [range, setRange] = useState<DateRange | undefined>();
    const disabledDates: Date[] =
        item?.disabledDates?.map((d: string) => new Date(d)) ?? [];

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

    function book(){
        console.log("book");
    }

    const nights = countActiveDays(range, disabledDates);
    const totalPrice = nights * item.pricePerDay;

    return (
        <div className="flex flex-col gap-6 p-6 w-full min-h-svh items-start max-w-6xl">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft size="16" strokeWidth={2} />Back to search
            </Button>
            <div className="flex gap-6 w-full">
                <Card className={"w-full h-fit"}>
                    <CardContent className={"flex flex-col gap-3 pt-6"}>
                        <label>{item?.name}</label>
                        <div className={"p-1 rounded-lg text-xs bg-primary w-fit"}>{item?.group}</div>
                        <label className={"text-xl"}>Description:</label>
                        <label className={"text-muted-foreground"}>{item?.description}</label>
                        <label className={"text-xl"}>Price:</label>
                        <label><span className={"text-primary"}>{item?.pricePerDay}€</span> per day</label>
                        <label className={"text-xl"}>Location:</label>
                        <div className={"flex gap-1.5 items-center text-muted-foreground"}>
                            <MapPin size="16" strokeWidth={2}/>
                            {item?.address}
                        </div>
                        <label className={"text-xl"}>Owner:</label>
                        <label>{item?.ownerName}</label>
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
                                <div className={"h-px w-full bg-border"}/>
                                <div className={"flex justify-between"}>
                                    <label>Total:</label>
                                    <label className={"text-primary"}>{totalPrice}€</label>
                                </div>
                            </div>
                        }
                        <Button disabled={nights == 0} onClick={() => book()}>
                            <Calendar size="16" strokeWidth={2}/>
                            Book
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
