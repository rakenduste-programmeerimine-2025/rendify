"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";
import { User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return user ? (
        <div className="flex items-center gap-4">
            <Button variant={"ghost"}>
                <Link
                    href="/account"
                    className={"flex items-center gap-2 text-muted-foreground"}
                >
                    <UserIcon size={14} strokeWidth={2} />
                    {user?.user_metadata.first_name} {user?.user_metadata.last_name}
                </Link>
            </Button>
            <LogoutButton />
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={"outline"}>
                <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={"default"}>
                <Link href="/auth/sign-up">Sign up</Link>
            </Button>
        </div>
    );
}