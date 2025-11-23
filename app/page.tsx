"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {useState} from "react";
import products from '../products.json';
import {ProductFilters} from "@/components/product-filters";
import {Button} from "@/components/ui/button";

export default function Home() {
    const [name, setName] = useState("");
    const [maxPrice, setMaxPrice] = useState(10);
    const [distance, setDistance] = useState(15);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(tomorrowISO);
    const [endDate, setEndDate] = useState(tomorrowISO);

    return (
        <div className="flex min-h-svh w-full p-6 md:p-10 gap-6">
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
            />

            <div className="w-full grid grid-cols-3 gap-6 h-fit">
                {products.map((product) => (
                    <Card key={product.id} className={"h-full flex flex-col"}>
                        <CardHeader>
                            <CardTitle className="text-base">{product.name}</CardTitle>
                            <CardDescription>
                                {product.description}
                            </CardDescription>
                            <CardDescription>
                                {product.address}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={"flex flex-row justify-between align-items-bottom items-center mt-auto"}>
                            <Label className={"text-muted-foreground"}>{product.pricePerDay}€ per day</Label>
                            <Button>View</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
