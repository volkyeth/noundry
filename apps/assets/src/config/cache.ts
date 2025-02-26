// Cache configuration for Nouns asset routes
// CDN will cache for 6 hours, but browsers will always revalidate

// 6 hours in seconds
export const CDN_CACHE_DURATION = 21_600;

// Cache-Control header for Nouns asset routes
// - no-cache: Instructs browsers to always revalidate with the CDN
// - s-maxage: Instructs the CDN to cache for a long time
// - immutable: Indicates the resource won't change until manually invalidated
export const CACHE_CONTROL = `no-cache, s-maxage=${CDN_CACHE_DURATION}, immutable`; 