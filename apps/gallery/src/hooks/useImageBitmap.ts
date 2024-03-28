import { useEffect, useState } from "react";

export const useImageBitmap = (uri: string) => {
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      createImageBitmap(img).then((bitmap) => {
        setBitmap(bitmap);
      });
    };
    img.src = uri;
  }, [uri]);

  return bitmap;
};
