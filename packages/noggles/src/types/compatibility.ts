export interface EncodedImage {
    filename: string;
    data: string;
}

export interface NounData {
    parts: EncodedImage[];
    background: string;
}

export interface ImageData {
    bgcolors: string[];
    palette: string[];
    images: {
        bodies: EncodedImage[];
        accessories: EncodedImage[];
        heads: EncodedImage[];
        glasses: EncodedImage[];
    };
}