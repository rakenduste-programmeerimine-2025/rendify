"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, isToday } from "date-fns";
import { ChatConversation } from "@/components/chat-conversation";
import { createClient } from "@/lib/supabase/client";
import { getUser } from "../account/server";
import { User } from "@supabase/supabase-js";

export type ChatMessage = {
    id: number;
    created_at: string;
    to_id: string;
    to_name: string;
    from_id: string;
    from_name: string;
    message: string;
};

export default function Page() {
    return (
        <Suspense fallback={<div className="flex flex-col gap-6 p-6 w-full min-h-svh items-start max-w-3xl">Loading...</div>}>
            <ChatPage />
        </Suspense>
    );
}

function ChatPage() {
    const router = useRouter();
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<
        Map<string, ChatMessage[]>
    >(new Map());
    const [user, setUser] = useState<User | null>(null);
    const activeChatMessages = messages.get(activeChatId ?? "") ?? null;
    const [activeChatRecipient, setActiveChatRecipient] = useState<
        string | null
    >(null);
    const searchParams = useSearchParams();

    // Initial load
    useEffect(() => {
        (async () => {
            const supabase = await createClient();
            const currentUser = await getUser();
            setUser(currentUser);

            const messagesResult = await supabase
                .from("messages_with_sender")
                .select(`*`)
                .order("created_at", { ascending: true })
                .or(
                    `from_id.eq.${currentUser?.id},to_id.eq.${currentUser?.id}`
                );

            if (messagesResult.error) {
                console.log("Error fetching chats:", messagesResult.error);
                return;
            }

            if (messagesResult.data.length === 0) {
                return;
            }

            // Build messages map
            const newMessages = new Map<string, ChatMessage[]>();
            for (const message of messagesResult.data) {
                const chatId =
                    message.to_id === currentUser?.id
                        ? message.from_id
                        : message.to_id;

                if (!newMessages.has(chatId)) {
                    newMessages.set(chatId, []);
                }
                newMessages.get(chatId)!.push(message);
            }

            setMessages(newMessages);

            // Set first chat as active
            const firstChatId = newMessages.keys().next().value;
            if (firstChatId) {
                setActiveChatId(firstChatId);
                setActiveChatRecipient(
                    newMessages.get(firstChatId)![0].from_name
                );
            }

            // Subscribe to new messages
            const channel = supabase
                .channel(`messages`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                    },
                    (payload) => {
                        const chatId =
                            payload.new.to_id === currentUser?.id
                                ? payload.new.from_id
                                : payload.new.to_id;

                        setMessages((prev) => {
                            const updated = new Map(prev);
                            const chatMessages = updated.get(chatId) ?? [];
                            updated.set(chatId, [
                                ...chatMessages,
                                {
                                    id: payload.new.id,
                                    created_at: payload.new.created_at,
                                    from_id: payload.new.from_id,
                                    from_name: payload.new.from_name,
                                    to_id: payload.new.to_id,
                                    to_name: payload.new.to_name,
                                    message: payload.new.message,
                                },
                            ]);
                            return updated;
                        });
                    }
                )
                .subscribe();

            return () => {
                channel.unsubscribe();
            };
        })();
    }, []);

    // Handle search params for opening specific chat
    useEffect(() => {
        if (!user) return;

        const withUserId = searchParams?.get("with");
        const ownerName = searchParams?.get("name") || "Item Owner";

        if (!withUserId) return;

        if (messages.has(withUserId)) {
            setActiveChatId(withUserId);
        } else {
            // Create new chat
            setMessages((prev) => {
                const updated = new Map(prev);
                updated.set(withUserId, []);
                return updated;
            });
            setActiveChatId(withUserId);
        }

        setActiveChatRecipient(ownerName);
    }, [user, searchParams]);

    function formatChatDate(dateString: string) {
        const d = new Date(dateString);
        return isToday(d) ? format(d, "HH:mm") : format(d, "dd.MM");
    }

    return (
        <div className="flex flex-col gap-6 p-6 w-full min-h-svh items-start max-w-3xl">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft size="16" strokeWidth={2} />
                Back
            </Button>
            <div className={"flex gap-6 w-full"}>
                <div className="w-full max-w-xs">
                    <Card className={"pb-5"}>
                        <CardHeader>
                            <CardTitle>Chats</CardTitle>
                        </CardHeader>
                        {Array.from(messages.entries()).map(
                            ([chatId, chatMessages], index) => {
                                const isLast = index === messages.size - 1;
                                const isActive = chatId === activeChatId;

                                const lastMessage = chatMessages[chatMessages.length - 1];
                                const recipientName =
                                    lastMessage?.from_id === user?.id
                                        ? lastMessage.to_name
                                        : lastMessage?.from_name || "Unknown";

                                return (
                                    <div
                                        key={chatId}
                                        className={`flex flex-col gap-1.5 p-4 ${isLast ? "" : "border-b border-border"
                                            } ${isActive && "bg-muted"
                                            } hover:bg-[#1d232f99] cursor-pointer transition-colors`}
                                        onClick={() => setActiveChatId(chatId)}
                                    >
                                        <div className="flex justify-between">
                                            <Label className="text-base">
                                                {activeChatId == chatId ? activeChatRecipient : recipientName}
                                            </Label>
                                            <Label className="text-base text-muted-foreground">
                                                {lastMessage &&
                                                    formatChatDate(lastMessage.created_at)}
                                            </Label>
                                        </div>

                                        {lastMessage && (
                                            <Label className="text-base text-muted-foreground">
                                                {lastMessage.message}
                                            </Label>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </Card>
                </div>

                {activeChatId && activeChatMessages && (
                    <ChatConversation
                        chatId={activeChatId}
                        chatName={activeChatRecipient ?? "Unknown"}
                        messages={activeChatMessages}
                    />
                )}
            </div>
        </div>
    );
}