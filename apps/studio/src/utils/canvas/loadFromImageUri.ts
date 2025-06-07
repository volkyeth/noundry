import { clearCanvas } from "./clearCanvas";

export const loadFromImageUri = (imageUri: string, canvas: HTMLCanvasElement): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    // Set crossOrigin for external URLs to avoid CORS issues
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        clearCanvas(canvas);
        // Draw the image scaled to the canvas size (32x32)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      console.error("Failed to load image from URI:", imageUri.substring(0, 100) + "...");
      reject(new Error(`Failed to load image from URI: ${imageUri.substring(0, 100)}...`));
    };

    img.src = imageUri;
  });
};