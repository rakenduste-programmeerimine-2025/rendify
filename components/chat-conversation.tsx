"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { format } from "date-fns";

type ChatMessage = {
    id: number;
    text: string;
    isMine: boolean;
    sentAt: string;
};

type Chat = {
    id: number;
    name: string;
    product: string;
    messages: ChatMessage[];
};

export function ChatConversation({ chat }: { chat: Chat }) {
    const messages = chat.messages;
    const [text, setText] = useState("");

    const handleSend = () => {
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">
                        {chat.name}
                    </CardTitle>
                    <Label className="text-xs text-muted-foreground">
                        {chat.product}
                    </Label>
                </CardHeader>

                <CardContent className="flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-4 flex-1">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex flex-col gap-1">
                                {!msg.isMine && (
                                    <span className="text-xs text-muted-foreground">
                    {chat.name}
                  </span>
                                )}

                                <div
                                    className={`max-w-[70%] rounded-full px-4 py-2 text-sm ${
                                        msg.isMine
                                            ? "ml-auto bg-primary text-primary-foreground"
                                            : "mr-auto bg-muted text-foreground"
                                    }`}
                                >
                                    {msg.text}
                                </div>

                                <span
                                    className={`mt-0.5 text-xs text-muted-foreground ${
                                        msg.isMine ? "ml-auto" : "mr-auto"
                                    }`}
                                >
                  {format(new Date(msg.sentAt), "MM/dd")}
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
