// Cache configuration for Nouns asset routes

// 6 hours in seconds
export const CDN_CACHE_DURATION = 21_600;

// 1 day in seconds (for stale-while-revalidate)
export const STALE_REVALIDATE_DURATION = 86_400;

// CDN will cache for 6 hours, but browsers will always revalidate
// stale-while-revalidate allows serving stale content while fetching fresh content
export const CACHE_HEADERS = {
    'Cache-Control': 'no-cache',
    'CDN-Cache-Control': `s-maxage=${CDN_CACHE_DURATION}, stale-while-revalidate=${STALE_REVALIDATE_DURATION}, immutable`,
    'Vercel-CDN-Cache-Control': `s-maxage=${CDN_CACHE_DURATION}, stale-while-revalidate=${STALE_REVALIDATE_DURATION}, immutable`
};

// CORS headers to allow access from anywhere
export const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
}; 