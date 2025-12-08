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

export const ALL_CHATS: Chat[] = [
    {
        id: 1,
        name: "Jon Snow",
        product: "Heart",
        messages: [
            {
                id: 1,
                text: "Is it still available?",
                isMine: true,
                sentAt: "2025-12-04 18:12",
            },
            {
                id: 2,
                text: "Yes, I can bring it tomorrow.",
                isMine: false,
                sentAt: "2025-12-04 18:20",
            },
            {
                id: 3,
                text: "For the watch.",
                isMine: true,
                sentAt: "2025-12-04 18:25",
            },
        ],
    },
    {
        id: 2,
        name: "Walter White",
        product: "Lab equipment",
        messages: [
            {
                id: 1,
                text: "I need the tools for a weekend project.",
                isMine: false,
                sentAt: "2025-12-03 09:15",
            },
            {
                id: 2,
                text: "Can you do a discount for 3 days?",
                isMine: true,
                sentAt: "2025-12-03 09:22",
            },
        ],
    },
];
