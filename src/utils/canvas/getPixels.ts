import { colord } from "colord";
import { chunk } from "lodash";

export const getPixels = (canvas: HTMLCanvasElement) =>
  chunk(canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data, 4).map(([r, g, b, a]) =>
    colord({ r, g, b, a: Math.floor(a / 255) })
  );
