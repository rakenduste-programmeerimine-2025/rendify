"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getUser } from "./server";
import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Delete, Eye, Pencil, Trash } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { ImageUploader } from "@/components/image-uploader";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { TOOL_CATEGORIES } from "@/app/tool-categories";
import { Textarea } from "@/components/ui/textarea";
import { AddressInput } from "@/components/address-input";
import { useEditItem } from "@/hooks/useEditItem";


type Rented = Database["public"]["Tables"]["rent_dates"]["Row"] & {
    rent_offer: {
        id: Database["public"]["Tables"]["rent_offers"]["Row"]["id"]
        title: Database["public"]["Tables"]["rent_offers"]["Row"]["title"]
        location: Database["public"]["Tables"]["rent_offers"]["Row"]["location"]
    }
}

type RentedOut = Database["public"]["Views"]["rent_dates_with_renter"]["Row"] & {
    rent_offer: {
        id: Database["public"]["Tables"]["rent_offers"]["Row"]["id"]
        title: Database["public"]["Tables"]["rent_offers"]["Row"]["title"]
        location: Database["public"]["Tables"]["rent_offers"]["Row"]["location"]
    }
}

export default function Page() {
    const [user, setUser] = useState<User | null>(null);
    const [items, setItems] = useState<Database["public"]["Tables"]["rent_offers"]["Row"][]>([]);
    const [rentedOut, setRentedOut] = useState<RentedOut[]>([]);
    const [rented, setRented] = useState<Rented[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const { deleteItem: performDelete, loading } = useDeleteItem();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        category: "",
        price: 0,
        address: "",
        useAccountAddress: true,
        image_urls: []
    });
    const { editItem: performEdit, loading: editLoading } = useEditItem();

    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditForm({
            title: item.title || "",
            description: item.description || "",
            category: item.category || "",
            price: (item.price_cents || 0) / 100,
            address: item.location || "",
            useAccountAddress: true,
            image_urls: item.image_urls
        });
        setEditModalOpen(true);

    };

    const updateEditForm = (field, value) => {
        setEditForm(prev => {
            if (prev[field] === value) return prev;
            return { ...prev, [field]: value };
        });
    };

    const confirmEdit = async () => {
        if (editingItem) {
            const updates = {
                title: editForm.title,
                description: editForm.description,
                category: editForm.category,
                price_cents: Math.round(editForm.price * 100),
                location: editForm.useAccountAddress ? "account_address" : editForm.address
            };

            await performEdit(editingItem.id, updates);
            setEditModalOpen(false);
            setEditingItem(null);
        }
    };

    const isEditFormValid =
        editForm.title.trim() &&
        editForm.category &&
        editForm.description.trim() &&
        editForm.price > 0;

    const handleDeleteClick = (itemId) => {
        setItemToDelete(itemId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            await performDelete(itemToDelete);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            setItems(items.filter(item => item.id !== itemToDelete));
        }
    };

    useEffect(() => {
        (async () => {
            const user = await getUser();
            setUser(user);

            const supabase = await createClient();

            const rentOffersResult = await supabase
                .from("rent_offers")
                .select(`
                    *`)
                .eq("user_id", user?.id);

            if (rentOffersResult.error) {
                console.log("Error fetching item:", rentOffersResult.error);
            }
            else {
                setItems(rentOffersResult.data);

                console.log(rentOffersResult.data.map(offer => offer.id))

                const rentedOutResult = await supabase
                    .from("rent_dates_with_renter")
                    .select(`
                    *, rent_offer (id, title, location)`)
                    .in("rent_offer", rentOffersResult.data.map(offer => offer.id))
                    .order("from", { ascending: false });

                if (rentedOutResult.error) {
                    console.log("Error fetching item:", rentedOutResult.error);
                }
                else {
                    setRentedOut(rentedOutResult.data);
                    console.log(rentedOutResult.data);
                }
            }

            const rentedResult = await supabase
                .from("rent_dates")
                .select(`
                    *, rent_offer (id, title, location)`)
                .eq("user_id", user?.id);

            if (rentedResult.error) {
                console.log("Error fetching item:", rentedResult.error);
            }
            else {
                setRented(rentedResult.data);
            }
        })();
    }, []);

    const [activeCard, setActiveCard] = useState('myItems');

    const cards = [
        { id: "myItems", label: "My items" },
        { id: "rented", label: "Rented" },
        { id: "rentedOut", label: "Rented out" }
    ]

    return (
        <div className="flex flex-col min-h-svh w-full p-6 md:p-10 gap-6 max-w-6xl">
            <Label className={"text-xl"}>
                My account
            </Label>
            <div className={"flex gap-6 w-full"}>
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Profile info</CardTitle>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-3"}>
                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Name
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.user_metadata.first_name} {user?.user_metadata.last_name}
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Email
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.email}
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Phone
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.phone || user?.user_metadata.phone || "-"}
                                </Label>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Label
                                    className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                    Address
                                </Label>
                                <Label
                                    className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                    {user?.user_metadata.location || "-"}
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full flex flex-col gap-6">
                    <div className="flex bg-muted p-2 rounded-lg justify-around">
                        {cards.map(({ id, label }) => {
                            const isActive = id === activeCard;
                            return (
                                <Label
                                    key={id}
                                    onClick={() => setActiveCard(id)}
                                    className={`text-base ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                                >
                                    {label} ({id == "myItems" && items.length}{id == "rented" && rented.length}{id == "rentedOut" && rentedOut.length})
                                </Label>
                            )
                        })}
                    </div>
                    {
                        activeCard === "myItems" &&
                        items.map((item) => (
                            <Card key={item.id} className={"h-fit flex flex-col"}>
                                <CardHeader className={"flex gap-4 flex-row"}>
                                    {item.image_urls && item.image_urls.length > 0 && (
                                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${item.image_urls[0]}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className={"w-full flex flex-col"}>
                                        <CardTitle className="text-base">{item.title}</CardTitle>
                                        <CardDescription>
                                            {item.description}
                                        </CardDescription>
                                        <CardDescription>
                                            {item.location}
                                        </CardDescription>
                                        <CardDescription>
                                            {item.price_cents / 100}€ per day
                                        </CardDescription>
                                    </div>
                                    <div className={"flex gap-2"}>
                                        <Link href={`item/${item.id}`}>
                                            <Button variant={"outline"} className={"p-2"}>
                                                <Eye size={16} strokeWidth={2} />
                                            </Button>
                                        </Link>
                                        <Button variant={"outline"} className={"p-2"} onClick={() => handleEditClick(item)}><Pencil size={16} strokeWidth={2} /></Button>
                                        <Button
                                            variant="destructive"
                                            className="p-2 group"
                                            onClick={() => handleDeleteClick(item.id)}
                                        >
                                            <Trash size={16} strokeWidth={2} />
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    }

                    {
                        activeCard === "rented" &&
                        rented.map((rented) => (
                            <Card key={rented.id} className={"h-fit flex flex-col"}>
                                <CardHeader className={"flex gap-4 flex-row"}>
                                    {rented.rent_offer.image_urls && rented.rent_offer.image_urls.length > 0 && (
                                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${rented.rent_offer.image_urls[0]}`}
                                                alt={rented.rent_offer.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className={"w-full flex flex-col"}>
                                        <CardTitle className="text-base">{rented.rent_offer.title}</CardTitle>
                                        <CardDescription>
                                            {rented.rent_offer.location}
                                        </CardDescription>
                                        <CardDescription>
                                            From: {rented.from}
                                        </CardDescription>
                                        <CardDescription>
                                            To: {rented.to}
                                        </CardDescription>
                                    </div>
                                    <div className={"flex gap-2"}>
                                        <Link href={`item/${rented.id}`}>
                                            <Button variant={"outline"} className={"p-2"}>
                                                <Eye size={16} strokeWidth={2} />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    }

                    {
                        activeCard === "rentedOut" &&
                        rentedOut.map((rented) => (
                            <Card key={rented.id} className={"h-fit flex flex-col"}>
                                <CardHeader className={"flex gap-4 flex-row"}>
                                    {rented.rent_offer.image_urls && rented.rent_offer.image_urls.length > 0 && (
                                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/OfferImages/${rented.rent_offer.image_urls[0]}`}
                                                alt={rented.rent_offer.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className={"w-full flex flex-col"}>
                                        <CardTitle className="text-base">{rented.rent_offer.title}</CardTitle>
                                        <CardDescription>
                                            {rented.renter_name}
                                        </CardDescription>
                                        <CardDescription>
                                            From: {rented.from}
                                        </CardDescription>
                                        <CardDescription>
                                            To: {rented.to}
                                        </CardDescription>
                                    </div>
                                    <div className={"flex gap-2"}>
                                        <Link href={`item/${rented.id}`}>
                                            <Button variant={"outline"} className={"p-2"}>
                                                <Eye size={16} strokeWidth={2} />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    }

                </div>

                {/* Modal for submit deleting my item */}
                <Modal
                    open={deleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    title="Delete Item?"
                    description="This action cannot be undone. All data and images will be permanently deleted."
                    className="max-w-sm"
                >
                    <div className="space-y-4 pt-4">
                        {itemToDelete && (
                            <div className="p-4 bg-muted rounded-lg text-center">
                                <div className="text-sm font-medium mb-1">"{items.find(i => i.id === itemToDelete)?.title}"</div>
                                <div className="text-xs text-muted-foreground">will be deleted forever</div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                loading={loading}
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete Item"}
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    title="Edit Item"
                    description="Update your item details"
                    className="max-w-lg"
                >
                    <CardContent className="flex flex-col gap-3 pt-0">
                        {/* ImageUploader with existing images */}
                        <ImageUploader
                            onImagesChange={(images) => updateEditForm("images", images)}
                            maxImages={10}
                            initialImages={editForm?.image_urls || []}
                            previewImageUrl={editForm?.image_urls?.[0]}
                        />

                        {/* Title */}
                        <label>Title*</label>
                        <Input
                            required
                            placeholder="e.g. Bosh Power Drill"
                            value={editForm.title}
                            onChange={(e) => updateEditForm("title", e.target.value)}
                        />

                        {/* Category */}
                        <label>Category*</label>
                        <AppSelect
                            value={editForm.category}
                            onChange={(value) => updateEditForm("category", value)}
                            placeholder="Select category"
                            options={TOOL_CATEGORIES}
                        />

                        {/* Description */}
                        <label>Description*</label>
                        <Textarea
                            required
                            placeholder="Describe your item in details"
                            value={editForm.description}
                            onChange={(e) => updateEditForm("description", e.target.value)}
                        />

                        {/* Address */}
                        <div className="mt-2 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    id="use-account-address"
                                    type="checkbox"
                                    className="h-4 w-4 accent-accent"
                                    checked={editForm.useAccountAddress}
                                    onChange={(e) => updateEditForm("useAccountAddress", e.target.checked)}
                                />
                                <label htmlFor="use-account-address" className="text-sm">
                                    Use my account address
                                </label>
                            </div>

                            {!editForm.useAccountAddress && (
                                <div className="flex flex-col gap-1">
                                    <label>Pickup address*</label>
                                    <AddressInput
                                        value={editForm.address}
                                        onChange={(value) => updateEditForm("address", value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <label>Price per day (€)*</label>
                        <Input
                            required
                            type="number"
                            placeholder="15.00"
                            value={editForm.price}
                            onChange={(e) => updateEditForm("price", parseFloat(e.target.value) || 0)}
                        />

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setEditModalOpen(false)}
                                className="flex-1"
                                disabled={editLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmEdit}
                                disabled={!isEditFormValid || editLoading}
                                className="flex-1"
                            >
                                {editLoading ? "Saving..." : "Update Item"}
                            </Button>
                        </div>
                    </CardContent>
                </Modal>
            </div>
        </div>
    );
}
