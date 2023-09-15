export const getBlob = async (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject("Couldn't create blob");
        return;
      }

      resolve(blob);
    });
  });
