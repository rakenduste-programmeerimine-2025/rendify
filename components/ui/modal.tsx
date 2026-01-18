"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    children: ReactNode;
    title: string;
    description?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export function Modal({
                          children,
                          title,
                          description,
                          open,
                          onOpenChange,
                          className
                      }: ModalProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                className={cn(
                    "bg-background rounded-xl border max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl",
                    className
                )}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-6 pb-2 bg-background/95 backdrop-blur-sm border-b">
                    <div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 ml-2 min-w-8"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
}
