import localImageData from './image-data.json';
import { ImageData } from './types';

declare global {
    interface Window {
        lilNounsImageData?: ImageData;
    }
}

const imageData: ImageData = new Proxy(localImageData as ImageData, {
    get: function (target, prop: keyof ImageData) {
        if (typeof window !== 'undefined' && window.lilNounsImageData) {
            return window.lilNounsImageData[prop];
        }

        return target[prop];
    }
});

export default imageData;

export const { bgcolors, palette, images } = imageData;