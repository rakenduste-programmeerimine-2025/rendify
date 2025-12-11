"use client";

import { use, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { format, set } from "date-fns";
import { type Chat } from "@/app/chat/page";
import { getUser } from "@/app/account/server";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function ChatConversation({ chat }: { chat: Chat }) {
    const messages = chat.messages;
    const [text, setText] = useState("");
    const [user, setUser] = useState<User | null>(null);

    const handleSend = async () => {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("messages")
            .insert({
                chat_id: chat.id,
                message: text,
            })
            .select("*");

        if (error) {
            console.error("Error creating rent offer:", error);
            return
        }

        setText("");
    };

    useEffect(() => {
        (async () => {
            const user = await getUser();
            setUser(user);
        })();
    }, []);

    return (
        <div className="w-full flex flex-col gap-6">
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">
                        {chat.from_id == user?.id ? chat.to_name : chat.from_name}
                    </CardTitle>
                    <Label className="text-xs text-muted-foreground">
                        {"chat.product"}
                    </Label>
                </CardHeader>

                <CardContent className="flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-4 flex-1">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex flex-col gap-1">
                                <div
                                    className={`max-w-[70%] rounded-full px-4 py-2 text-sm ${msg.sender_id == user?.id
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "mr-auto bg-muted text-foreground"
                                        }`}
                                >
                                    {msg.message}
                                </div>

                                <span
                                    className={`mt-0.5 text-xs text-muted-foreground ${msg.sender_id == user?.id ? "ml-auto" : "mr-auto"
                                        }`}
                                >
                                    {format(new Date(msg.created_at), "MM/dd")}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* input + send button */}
                    <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
                        <Input
                            className="flex-1"
                            placeholder="Write a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSend();
                            }}
                        />
                        <Button
                            size="icon"
                            className="shrink-0"
                            onClick={handleSend}
                        >
                            <SendHorizonal className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
