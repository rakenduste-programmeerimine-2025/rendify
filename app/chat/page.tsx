"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, isToday, set } from "date-fns";
import { ChatConversation } from "@/components/chat-conversation";
import { createClient } from "@/lib/supabase/client";
import { getUser } from "../account/server";
import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

export type ChatMessage = {
    id: number;
    created_at: string;
    sender_id: string;
    sender_name: string;
    message: string;
};

export type Chat = {
    created_at: string;
    from_id: string;
    from_name: string;
    id: number;
    to_id: string;
    to_name: string;
    updated_at: string;
    messages: ChatMessage[]
}
export default function Page() {
    const router = useRouter();
    const [activeChatId, setActiveChatId] = useState(-1);
    const [chats, setChats] = useState<Chat[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const activeChat = chats.find(c => c.id === activeChatId)!;
    const searchParams = useSearchParams();

    useEffect(() => {
        (async () => {
            const supabase = await createClient();
            const user = await getUser();
            setUser(user);

            const chatsResult = await supabase
                .from("chats_with_names")
                .select(`*,
                    messages_with_sender (
                        *
                    )
                `)
                .order("updated_at", { ascending: false })
                .or(`from_id.eq.${user?.id},to_id.eq.${user?.id}`)

            if (chatsResult.error) {
                console.log("Error fetching chats:", chatsResult.error);
            }
            else {
                const chats: Chat[] = chatsResult.data.map(c => ({
                    created_at: c.created_at!,
                    from_id: c.from_id!,
                    from_name: c.from_name!,
                    id: c.id!,
                    to_id: c.to_id!,
                    to_name: c.to_name!,
                    updated_at: c.updated_at!,
                    messages: c.messages_with_sender.map(m => ({
                        id: m.id!,
                        created_at: m.created_at!,
                        sender_id: m.sender_id!,
                        sender_name: m.sender_name!,
                        message: m.message!,
                    }))
                }));
                setChats(chats);
                setActiveChatId(chats[0].id);
            }

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
                        console.log(payload);
                        setChats(chats => chats.map(c => {
                            if (c.id == payload.new.chat_id!) {
                                return {
                                    ...c,
                                    messages: [
                                        ...c.messages,
                                        {
                                            id: payload.new.id,
                                            created_at: payload.new.created_at,
                                            sender_id: payload.new.sender_id,
                                            sender_name: payload.new.sender_name,
                                            message: payload.new.message,
                                        }
                                    ]
                                }
                            }
                            return c;
                        }));
                    }
                )
                .subscribe();
        })();
    }, []);

    useEffect(() => {
        if (chats.length === 0 || !user) return;

        const withUserId = searchParams?.get('with');
        const ownerName = searchParams?.get('name') || 'Item Owner';

        if (!withUserId) return;

        const existingChat = chats.find(chat =>
            chat.from_id === withUserId || chat.to_id === withUserId
        );


        if (existingChat) {
            setActiveChatId(existingChat.id);
            return;
        }

        const fakeChat: Chat = {
            id: `fake-${Date.now()}`,
            created_at: new Date().toISOString(),
            from_id: user.id,
            from_name: (user.user_metadata as any)?.full_name || 'You',
            to_id: withUserId,
            to_name: decodeURIComponent(ownerName),
            updated_at: new Date().toISOString(),
            messages: []
        };

        setChats(prev => [fakeChat, ...prev]);
        setActiveChatId(fakeChat.id);
    }, [chats.length, user]);

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
                        {chats.map((chat, index) => {
                            const isLast = index === chats.length - 1;
                            const isActive = chat.id === activeChatId;

                            const lastMessage = chat.messages[chat.messages.length - 1];

                            return (
                                <div
                                    key={chat.id}
                                    className={`flex flex-col gap-1.5 p-4 ${isLast ? "" : "border-b border-border"
                                        } ${isActive && "bg-muted"} hover:bg-[#1d232f99] cursor-pointer transition-colors`}
                                    onClick={() => setActiveChatId(chat.id)}
                                >
                                    <div className="flex justify-between">
                                        <Label className="text-base">{user?.id == chat.from_id ? chat.to_name : chat.from_name}</Label>
                                        <Label className="text-base text-muted-foreground">
                                            {lastMessage && formatChatDate(lastMessage.created_at)}
                                        </Label>
                                    </div>

                                    {lastMessage && (
                                        <Label className="text-base text-muted-foreground">
                                            {lastMessage.message}
                                        </Label>
                                    )}

                                    {/*<Label className="text-base text-muted-foreground">*/}
                                    {/*    {"chat.product"}*/}
                                    {/*</Label>*/}
                                </div>
                            );
                        })}
                    </Card>
                </div>

                {activeChat && <ChatConversation chat={activeChat} />}
            </div>
        </div>
    );
}
