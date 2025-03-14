import { CACHE_HEADERS, CDN_CACHE_DURATION, CORS_HEADERS } from "@/config/cache";
import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData, nounsTraitNames, toImageData } from "noggles";

// Set revalidation time to match CDN cache duration
export const revalidate = CDN_CACHE_DURATION;

export async function GET() {
    const imageData = toImageData(await fetchOnchainNounsArtData(publicClient), nounsTraitNames);

    const jsContent = `(function(){window.nounsImageData=${JSON.stringify(imageData)};})();`;

    return new NextResponse(jsContent, {
        headers: {
            'Content-Type': 'application/javascript',
            ...CACHE_HEADERS,
            ...CORS_HEADERS
        },
    });
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        headers: CORS_HEADERS
    });
} 