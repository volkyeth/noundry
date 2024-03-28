export const getBlob = async (canvas: HTMLCanvasElement) => {
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create a blob");
      }
      resolve(blob);
    });
  });
};
