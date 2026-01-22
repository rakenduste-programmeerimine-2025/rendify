"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppSelect } from "@/components/ui/select";
import { TOOL_CATEGORIES } from "@/app/tool-categories";

interface ProductFiltersProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    minPrice: number;
    maxPrice: number;
    maxPriceFilter: number;
    setMaxPriceFilter: React.Dispatch<React.SetStateAction<number | null>>;
    distance: number;
    setDistance: React.Dispatch<React.SetStateAction<number>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export function ProductFilters({
    name,
    setName,
    minPrice,
    maxPrice,
    maxPriceFilter,
    setMaxPriceFilter,
    distance,
    setDistance,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    category,
    setCategory,
}: ProductFiltersProps) {
    return (
        <div className="w-full max-w-xs">
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
                        <div className={"flex items-center justify-between"}>
                            <Label className="relative text-base text-foreground font-medium">
                                Category
                            </Label>

                            {category && (
                                <button
                                    type="button"
                                    onClick={() => setCategory("")}
                                    className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <AppSelect
                            value={category}
                            onChange={setCategory}
                            placeholder="Select category"
                            options={TOOL_CATEGORIES}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label className="relative text-base text-foreground font-medium">
                            Max price: {maxPriceFilter}€ / day
                        </Label>
                        <Input
                            className="p-0 accent-primary"
                            id="maxPrice"
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={maxPriceFilter}
                            onChange={(e) => setMaxPriceFilter(+e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label className="relative text-base text-foreground font-medium">
                            Max distance {distance} km
                        </Label>
                        <Input
                            className="p-0 accent-primary"
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
