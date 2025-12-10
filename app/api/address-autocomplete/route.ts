import { NextResponse } from "next/server";

const BASE_URL = "https://inaadress.maaamet.ee/inaadress/gazetteer";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (q.length < 3) {
        return NextResponse.json([]);
    }

    const params = new URLSearchParams({
        results: "10",
        features: "EHAK,VAIKEKOHT,KATASTRIYKSUS,TANAV,EHITISHOONE",
        ihist: "1993",
        address: q,
        appartment: "1",
        unik: "0",
        tech: "1",
        iTappAsendus: "0",
        ky: "0",
        poi: "0",
        knr: "0",
        help: "1",
    });

    const url = `${BASE_URL}?${params.toString()}`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Maa-amet error", res.status, text);
        return NextResponse.json([], { status: 500 });
    }

    const data = await res.json() as {
        addresses?: any[];
    };

    console.log(data)

    const suggestions =
        data.addresses?.map((item, i) => ({
            id: item.adr_id ?? item.ads_oid ?? i,
            formatted: item.pikkaadress || item.taiсаadress || "",
            lat: item.viitepunkt_b ? Number(item.viitepunkt_b) : undefined,
            lon: item.viitepunkt_l ? Number(item.viitepunkt_l) : undefined,
        })) ?? [];

    return NextResponse.json(suggestions);
}
