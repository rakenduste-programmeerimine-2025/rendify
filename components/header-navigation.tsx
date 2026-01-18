"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, PlusCircle } from "lucide-react";


export function HeaderNav() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Browse", icon: Home },
        { href: "/chat", label: "Messages", icon: MessageCircle },
        { href: "/createItem", label: "Add item", icon: PlusCircle },
    ];

    return (
        <nav className="flex gap-5 items-center font-semibold">
            {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`px-4 py-2 rounded flex gap-2 items-center ${
                            isActive && "bg-primary text-primary-foreground"
                        }`}
                    >
                        <Icon size="16" strokeWidth={2} />
                        <span>{label}</span>
                    </Link>
                )
            })}
        </nav>
    );
}
