"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { TOOL_CATEGORIES } from "../tool-categories";
import { AppSelect } from "@/components/ui/select";
import { User } from "@supabase/supabase-js";
import { getUser } from "@/app/account/server";
import { AddressInput } from "@/components/address-input";

type Suggestion = {
    id: string | number;
    formatted: string;
    lat?: number;
    lon?: number;
};

export default function CreateItem() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string>("");
    const [price, setPrice] = useState(0);

    // адрес
    const [address, setAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<Suggestion | null>(null);
    const [useAccountAddress, setUseAccountAddress] = useState(true);

    useEffect(() => {
        (async () => {
            const user = await getUser();
            setUser(user);

            const accAddress = (user as any)?.user_metadata?.address as string | undefined;
            if (accAddress) {
                setAddress(accAddress);
            }
        })();
    }, []);

    const isAddressValid =
        useAccountAddress || (!!selectedAddress && address === selectedAddress.formatted);

    async function createItem() {
        const supabase = await createClient();

        const finalAddress = useAccountAddress
            ? (user as any)?.user_metadata?.address ?? ""
            : address;

        const { data, error } = await supabase
            .from("rent_offers")
            .insert({
                title,
                description,
                category,
                price_cents: price * 100,
                location: finalAddress,
            })
            .select("id");

        if (error) {
            console.error("Error creating rent offer:", error);
            return
        }

        redirect("/item/" + data[0].id);
    }

    const isFormInvalid =
        title.length === 0 ||
        category.length === 0 ||
        description.length === 0 ||
        price === 0 ||
        !isAddressValid;

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
                    <label>Category*</label>
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
                    <div className="mt-2 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                id="use-account-address"
                                type="checkbox"
                                className="h-4 w-4 accent-accent"
                                checked={useAccountAddress}
                                onChange={(e) => setUseAccountAddress(e.target.checked)}
                            />
                            <label htmlFor="use-account-address" className="text-sm">
                                Use my account address
                            </label>
                        </div>

                        {!useAccountAddress && (
                            <div className="flex flex-col gap-1">
                                <label>Pickup address*</label>
                                <AddressInput
                                    value={address}
                                    onChange={setAddress}
                                    onValidAddressChange={setSelectedAddress}
                                />
                            </div>
                        )}

                        {useAccountAddress && (
                            <p className="text-xs text-muted-foreground">
                                Item will use your account address as pickup location.
                            </p>
                        )}

                        {!useAccountAddress && !isAddressValid && address.trim().length >= 3 && (
                            <p className="text-xs text-red-500">
                                Please select a valid address from suggestions.
                            </p>
                        )}
                    </div>
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
                                category.length == 0 ||
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
