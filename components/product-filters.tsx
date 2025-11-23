"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductFiltersProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    maxPrice: number;
    setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
    distance: number;
    setDistance: React.Dispatch<React.SetStateAction<number>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

export function ProductFilters({
                                   name,
                                   setName,
                                   maxPrice,
                                   setMaxPrice,
                                   distance,
                                   setDistance,
                                   startDate,
                                   setStartDate,
                                   endDate,
                                   setEndDate,
                               }: ProductFiltersProps) {
    return (
        <div className="w-full max-w-sm">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Filters</CardTitle>
                </CardHeader>
                <CardContent className={"flex flex-col gap-3"}>
                    <div className="flex flex-col gap-0.5">
                        <Label className="relative text-base text-foreground font-medium">
                            Search
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Search by item name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label className="relative text-base text-foreground font-medium">
                            Max price: {maxPrice}€ / day
                        </Label>
                        <Input
                            className="p-0"
                            id="maxPrice"
                            type="range"
                            min={5}
                            max={100}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(+e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label className="relative text-base text-foreground font-medium">
                            Max distance {distance} km
                        </Label>
                        <Input
                            className="p-0"
                            id="maxDistance"
                            type="range"
                            max={100}
                            min={0}
                            value={distance}
                            onChange={(e) => setDistance(+e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label className="relative text-base text-foreground font-medium">
                            Start date
                        </Label>
                        <Input
                            className="block"
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label className="relative text-base text-foreground font-medium">
                            End date
                        </Label>
                        <Input
                            className="block"
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
