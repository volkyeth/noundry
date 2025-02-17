import { TraitNames } from "../nouns/traitNames.js";
import { NounsArtData } from "../types/artwork.js";

export const toImageData = (artData: NounsArtData, traitNames: TraitNames) => ({
    bgcolors: artData.backgrounds.map(color => color.slice(1)),
    palette: artData.palettes[0].map((color, i) => i === 0 ? "" : color.slice(1)),
    images: {
        bodies: artData.bodies.map((data, i) => ({ filename: `body-${toFilename(traitNames.bodies[i] ?? `${i}`)}`, data })),
        accessories: artData.accessories.map((data, i) => ({ filename: `accessory-${toFilename(traitNames.accessories[i] ?? `${i}`)}`, data })),
        heads: artData.heads.map((data, i) => ({ filename: `head-${toFilename(traitNames.heads[i] ?? `${i}`)}`, data })),
        glasses: artData.glasses.map((data, i) => ({ filename: `glasses-${toFilename(traitNames.glasses[i] ?? `${i}`)}`, data })),
    }
})

const toFilename = (traitName: string) => traitName.replace(/ /g, '-')