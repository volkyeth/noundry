import { decodeTrait } from "../artwork/decodeTrait.js";
import { inflateTraits } from "../artwork/inflateTraits.js";

const [data] = process.argv.slice(2);

const encodedTraits = inflateTraits(data as `0x${string}`);

const decodedTraits = encodedTraits.map((trait) => decodeTrait(trait, 32, 32));

console.log({ data, encodedTraits, decodedTraits });
