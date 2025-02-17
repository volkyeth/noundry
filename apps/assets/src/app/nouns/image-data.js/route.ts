import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData, nounsTraitNames, toImageData } from "noggles";

export const revalidate = 900;

export async function GET() {
    const imageData = toImageData(await fetchOnchainNounsArtData(publicClient), nounsTraitNames);

    // Create a self-executing function that assigns the data to window.nounsImageData
    const jsContent = `(function(){window.nounsImageData=${JSON.stringify(imageData)};})();`;

    const response = new NextResponse(jsContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=604800`
        },
    });

    return response;
} 