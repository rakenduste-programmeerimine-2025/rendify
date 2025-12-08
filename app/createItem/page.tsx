"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { TOOL_CATEGORIES } from "../tool-categories";
import { AppSelect } from "@/components/ui/select";

export default function CreateItem() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string>("");
    const [price, setPrice] = useState(0);

    async function createItem() {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("rent_offers")
            .insert({
                title,
                description,
                price_cents: price / 100,
            })
            .select("id");

        if (error) {
            console.error("Error creating rent offer:", error);
            return
        }

        redirect("/item/" + data[0].id);
    }

    return (
        <div className="flex flex-col gap-6 p-6 w-full min-h-svh items-start max-w-3xl">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft size="16" strokeWidth={2} />Back
            </Button>
            <Card className={"w-full h-fit"}>
                <CardHeader>
                    <CardTitle>
                        Add new item
                    </CardTitle>
                </CardHeader>
                <CardContent className={"flex flex-col gap-3 pt-6"}>
                    <label>Title*</label>
                    <Input
                        required
                        placeholder={"e.g. Bosh Power Drill"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Group*</label>
                    <AppSelect
                        value={category}
                        onChange={setCategory}
                        placeholder="Select category"
                        options={TOOL_CATEGORIES}
                    />
                    <label>Description*</label>
                    <Textarea
                        required
                        placeholder={"Describe your item in details"}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label>Price per day (€)*</label>
                    <Input
                        required
                        type="number"
                        placeholder={"15.00"}
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    />
                    <div className={"flex gap-3"}>
                        <Button variant={"ghost"} className={"border"}>Cancel</Button>
                        <Button
                            disabled={
                                title.length == 0 ||
                                group.length == 0 ||
                                description.length == 0 ||
                                price == 0
                            }
                            onClick={createItem}
                            variant={"default"}
                        >
                            Add item
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
