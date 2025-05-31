/**
 * Checks if a canvas has any transparent pixels
 * @param canvas The canvas element to check
 * @returns true if the image has transparent pixels, false if it's fully opaque
 */
export const hasTransparency = (canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Check alpha channel (every 4th value) for any transparent pixels
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
            return true; // Found a transparent or semi-transparent pixel
        }
    }

    return false; // All pixels are fully opaque
}; 