"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderNav() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Browse" },
        { href: "/chat", label: "Messages" },
        { href: "/createItem", label: "Add item" },
    ];

    return (
        <nav className="flex gap-5 items-center font-semibold">
            {links.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                    <Link key={href} href={href} passHref legacyBehavior>
                        <button
                            className={`px-4 py-2 rounded ${
                                isActive && "bg-primary"
                            }`}
                        >
                            {label}
                        </button>
                    </Link>
                );
            })}
        </nav>
    );
}
