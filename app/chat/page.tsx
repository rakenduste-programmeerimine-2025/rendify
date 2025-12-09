"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";
import { ALL_CHATS } from "../chats";
import { format, isToday } from "date-fns";
import {ChatConversation} from "@/components/chat-conversation";

export default function Page() {
    const router = useRouter();
    const [activeChatId, setActiveChatId] = useState(ALL_CHATS[0].id);

    const activeChat = ALL_CHATS.find(c => c.id === activeChatId)!;

    function formatChatDate(dateString: string) {
        const d = new Date(dateString);
        if (isToday(d)) {
            return format(d, "HH:mm");
        }
        return format(d, "dd.MM");
    }

    return (
        <div className="flex flex-col gap-6 p-6 w-full min-h-svh items-start max-w-3xl">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft size="16" strokeWidth={2} />Back
            </Button>
            <div className={"flex gap-6 w-full"}>
                <div className="w-full max-w-xs">
                    <Card className={"pb-5"}>
                        <CardHeader>
                            <CardTitle>
                                Chats
                            </CardTitle>
                        </CardHeader>
                        {ALL_CHATS.map((chat, index) => {
                            const isLast = index === ALL_CHATS.length - 1;
                            const isActive = chat.id === activeChatId;

                            const lastMessage = chat.messages[chat.messages.length - 1];

                            return (
                                <div
                                    key={chat.id}
                                    className={`flex flex-col gap-1.5 p-4 ${
                                        isLast ? "" : "border-b border-border"
                                    } ${isActive && "bg-muted"} hover:bg-[#1d232f99] cursor-pointer transition-colors`}
                                    onClick={() => setActiveChatId(chat.id)}
                                >
                                    <div className="flex justify-between">
                                        <Label className="text-base">{chat.name}</Label>
                                        <Label className="text-base text-muted-foreground">
                                            {lastMessage && formatChatDate(lastMessage.sentAt)}
                                        </Label>
                                    </div>

                                    {lastMessage && (
                                        <Label className="text-base text-muted-foreground">
                                            {lastMessage.text}
                                        </Label>
                                    )}

                                    <Label className="text-base text-muted-foreground">
                                        {chat.product}
                                    </Label>
                                </div>
                            );
                        })}
                    </Card>
                </div>

                <ChatConversation chat={activeChat} />
            </div>
        </div>
    );
}
