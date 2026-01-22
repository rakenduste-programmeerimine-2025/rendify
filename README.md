# Rendify
Peer‑to‑peer equipment rental marketplace built with Next.js and Supabase.
Users can list their items for rent, browse available equipment, book rental periods via a calendar, and chat directly with item owners.

## Table of Contents
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Core Functionality](#core-functionality)
    - [Browsing and Search](#browsing-and-search)
    - [Item Details & Images](#item-details--images)
    - [Rental Flow](#rental-flow)
    - [Messaging & Chat](#messaging--chat)
    - [Account Area](#account-area)
* [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Database & Supabase](#database--supabase)
    - [Running the App](#running-the-app)
    - [Account Area](#account-area)
* [Development](#development)
* [Potential Improvements](#potential-improvements)
* [Screenshots](#screenshots)
* [Contributors](#contributors)

## Features
Rendify implements a small but realistic rental marketplace with:

* Item listings
    - Owners can create, edit, and delete rental offers
    - Category selection (tool categories)
    - Rich description, price per day, and location
    - Multiple images per item with a dedicated preview image
* Responsive image galleries
    - Main image + thumbnail strip on the item page
    - Search and account pages show small item preview thumbnails
    - Image uploader with drag‑and‑drop, preview selection, and delete
* Availability & booking
    - Date range picker for selecting rental period, with disabled dates for already booked ranges
    - Calculation of active rental days and total price
    - Owners do not see booking controls on their own items
* Chat / messaging system
    - Chat list page with conversations sorted by last update
    - Real‑time updates via Supabase Realtime (Postgres changes on messages)
    - Chat conversation view with bubble layout and auto‑scroll to the latest message
    - “Chat with owner” button on the item page
* Account dashboard
    - Tabs for:
        - My Items: items the user is renting out
        - Rented: items the user has rented from others
        - Rented Out: bookings where other users have rented their items
    - Each card shows a small item preview image (if available), location/user info, and rental period
    - Actions to view item, edit item, or delete item (for owner)
* Modern UI & UX
    - Built with Tailwind CSS and shadcn/ui components
    - Clean, minimal cards and modals
    - Proper disabled states (e.g. booking button disabled when no dates selected)

## Tech Stack

### Frontend
* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* lucide-react for icons
* react-day-picker for date range selection

### Backend / Data
* Supabase
* PostgreSQL database
* Auth (user accounts)
* Storage (item images)
* Realtime (subscriptions to messages table)

### Tooling
* pnpm (package manager)
* ESLint & TypeScript for static analysis
* Next.js middleware for auth‑related routing (see middleware.ts)

## Project Structure
High‑level structure based on the repository:

```
bash
rendify/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Landing / search
│   ├── item/[id]/page.tsx   # Item details page
│   ├── chat/page.tsx        # Chats list + active conversation
│   ├── account/             # Account-related pages
│   └── ...                  # Other routes & layouts
│
├── components/
│   ├── chat-conversation.tsx  # Chat messages list + input
│   ├── image-uploader.tsx     # Drag-and-drop image uploader with preview
│   ├── date-range-picker.tsx  # Wrapped date picker component
│   ├── ui/                    # shadcn/ui primitives (Card, Button, Modal, etc.)
│   └── ...                    # Shared components
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase browser client
│   │   └── database.types.ts  # Generated DB types
│   └── utils.ts               # Shared utilities (e.g. cn)
│
├── supabase/                 # Supabase branch/migration data
│   └── .branches/
│
├── public/                   # (Recommended) screenshots go here
│   └── screenshots/
│       ├── home.png
│       ├── item.png
│       ├── booking.png
│       └── chat.png
│
├── .env.example              # Environment variable template
├── eslint.config.mjs
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md                 # This file
```

## Core Functionality
### Browsing and Search
* Users land on a search‑oriented page showing available rental items.
    - Each item is displayed as a card with:
    - Title
    - Short description
    - Location
    - Price per day
    - Optional preview image
* Clicking a card or “View” button navigates to /item/[id].

### Item Details & Images
Item detail page (app/item/[id]/page.tsx) includes:
* Full‑width responsive image gallery:
    - Large main image with preserved aspect ratio
    - Thumbnails below; clicking a thumbnail updates the main image
    - Image counter showing current/total images
* Detailed information:
    - Title, category, description
    - Price per day (calculated from price_cents)
    - Location
    - Owner name
* A “Chat with owner” button that opens the chat page with the correct user pre‑selected.
* Logic that hides:
    - The “Chat with owner” button
    - The entire booking panel when the current user is the owner of the item.

### Rental Flow
The rental section on the item page includes:
* Date selection
    - Embedded DateRangePicker component
    - Disabled dates based on existing rent_dates entries
    - Only future dates are allowed; past dates are filtered out

* Reserved dates preview
    - List of already reserved ranges for the item

* Price calculation
    - Counts active days in the selected range excluding disabled days
    - Calculates total price: days * (price_cents / 100)
    - Displays a small summary card with dates, number of days, and total

* Booking modal
    - A confirmation modal summarizing:
        - Rental period (from / to)
        - Number of days
        - Total cost
    - “Confirm & Book” button that calls a useRentItem hook to create the booking and then refreshes data.

## Messaging & Chat
Chat experience is split into:
* Chat list page (/chat)
    - Fetches all chats associated with the logged‑in user (either as from_id or to_id) from a Supabase view (e.g. chats_with_names).
    - Shows:
        - Other participant’s name
        - Last message snippet
        - Timestamp of the last message
    - Clicking a chat sets it as the active conversation.
    - Subscribes via Supabase Realtime to INSERT events on the messages table to append new messages in real time.

* ChatConversation component
    - Receives a Chat object with an array of messages.
    - Displays messages as left/right bubbles depending on sender.
    - Auto‑scrolls to the latest message when opened and when new messages arrive.
    - Provides an input + “send” button:
        - On send, inserts a new message row via Supabase.
        - Local state is cleared and the realtime subscription updates the UI.

* Entry point from item page
    - The item page has a “Chat with owner” button.
    - It navigates to /chat?with=<owner_id>&name=<owner_name>.
    - On the chat page, logic:
        - Looks for an existing chat with that user.
        - If found, activates it.
        - If not, it can behave like a fresh (empty) conversation until a message is sent.

## Account Area
The account page (or dashboard) uses three logical views:
* My Items
    - All items created by the current user.
    - Each card shows:
        - A small preview image (first image if available)
        - Title, description, location, price
    - Actions:
        - View item
        - Edit item (opens “Edit Item” modal)
        - Delete item
* Rented
    - Items the user has rented from others.
    - Card content:
        - Small preview image of the rented item
        - Item title and location
        - Rental period (from / to)
    - Link to view the item.
* Rented Out
    - Items that other users have rented from this owner.
    - Card content:
        - Small preview image of the item
        - Item title
        - Renter’s name
        - Rental period (from / to)
    - Link to view the item.

Edit Item Modal
The Edit Item modal includes:
* Existing item data prefilled:
    - Title, category, description
    - Pricing
    - Address / option “Use my account address”
    - ImageUploader integrated with existing images:
        - Shows current images as thumbnails when opening the modal.
        - Allows adding new images via drag‑and‑drop or file selection.
        - Allows choosing exactly one preview image.
        - Allows deleting images.
    - Validation: “Update Item” button is disabled until the form is valid.

## Getting Started
### Prerequisites
* Node.js (LTS recommended)
* pnpm installed globally:
    ```
    npm install -g pnpm
    ```
* Supabase project (database + storage + auth)
### Environment Variables
Use .env.example as a template and create a .env.local file in the project root:
```
cp .env.example .env.local
```
Typical variables (adjust to match your actual keys):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role
```

## Installation
Clone the repository and install dependencies:

```
git clone https://github.com/rakenduste-programmeerimine-2025/rendify.git
cd rendify

pnpm install
```

## Database & Supabase
1. Create a new Supabase project.
2. Configure:
- Tables for:
    - users / profiles (auth)
    - rent offers (items)
    - rent dates / bookings
    - chats
    - messages
- Storage bucket for item images, e.g. OfferImages.
3. Update RLS policies in Supabase to allow:
- Owners to manage their own items and chats.
- Authorized users to create bookings and send messages.
4. If you have SQL migrations or functions (e.g. views like rent_offers_with_owner, chats_with_names), run them via the Supabase SQL editor.

## Running the App
Start the development server:
```
pnpm dev
```
By default, the app runs at:
```
http://localhost:3000
```

## Development
Common scripts (check package.json to confirm):

```
# Start dev server
pnpm dev

# Lint
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm start
```
You can also use typical Next.js workflow:
* Edit files in app/, components/, lib/
* Hot‑reload will update the UI in your browser

## Potential Improvements
Some ideas (possibly can be implement later):
* Show average rating or reviews per item.
* Add status indicators for active/past/future bookings.
* Enhance chat with typing indicators or read receipts.
* Add server‑side validation and clearer error states for all Supabase calls.

## Screenshots
### Home page
<img width="3842" height="2161" alt="localhost_3000_auth_login" src="https://github.com/user-attachments/assets/f5b8ab7c-05f2-4720-91bd-4190ac7aa7cf" />
### Item details page
<img width="3842" height="2161" alt="localhost_3000_auth_login (1)" src="https://github.com/user-attachments/assets/06a05816-89cc-4e4f-a82c-aefc78219afd" />
### Chat Page
<img width="3842" height="2161" alt="localhost_3000_chat_with=da81d2d6-eec3-4cb8-8f2c-699fc37fbde4 name=John+D" src="https://github.com/user-attachments/assets/4f63266c-fc84-4167-83f7-9c3c62b1b0a0" />
### Account page
<img width="3842" height="2161" alt="localhost_3000_chat_with=da81d2d6-eec3-4cb8-8f2c-699fc37fbde4 name=John+D  (1)" src="https://github.com/user-attachments/assets/78b2a5cb-6cc0-48b1-a594-e335c66c82b6" />

## Contributors
Students of “Rakenduste programmeerimine 2025” course
Example contributors:
* Mihhail Zolotarjov (@maska12271)
* Gabriel Jõe (@Drigster)
