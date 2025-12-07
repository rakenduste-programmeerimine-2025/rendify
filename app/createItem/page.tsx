"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export default function CreateItem() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [group, setGroup] = useState("");
    const [price, setPrice] = useState("");

    function createItem(){
        console.log("book");
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
                    <Input
                        required
                        placeholder={"e.g. Tools"}
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
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
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <div className={"flex gap-3"}>
                        <Button variant={"ghost"} className={"border"}>Cancel</Button>
                        <Button
                            disabled={
                                title.length == 0 ||
                                group.length == 0 ||
                                description.length == 0 ||
                                price.length == 0
                            }
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
