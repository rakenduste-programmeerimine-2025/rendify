"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import Link from "next/link";

export default function Page() {
    const [activeCard, setActiveCard] = useState('myItems');

    const cards = [
        {id: "myItems", label: "My items"},
        {id: "rented", label: "Rented"},
        {id: "rentedOut", label: "Rented out"}
    ]

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
                                    Name
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Email
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    some.random@email.com
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Phone
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    +372 2w834957
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Address
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    Idk
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
                                    {label}
                                </Label>
                            )
                        })}
                    </div>
                    <Card>

                    </Card>
                </div>
            </div>
        </div>
    );
}
