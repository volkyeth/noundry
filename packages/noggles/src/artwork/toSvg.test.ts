import { describe, expect, test } from "vitest";
import { toSvg } from "./toSvg.js";

describe("toSvg", () => {
    test("converts pixel data to svg", () => {
        const data = new Uint8ClampedArray([
            255, 0, 0, 255,    // Red pixel
            255, 0, 0, 255,    // Red pixel
            0, 255, 0, 255,    // Green pixel
            0, 0, 255, 255,    // Blue pixel
        ]);

        const svg = toSvg(data, 2, 2);

        expect(svg).toBe(`<svg width="2" height="2" viewBox="0 0 2 2" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0L2 0L2 1L0 1Z" fill="rgba(255,0,0,1)"/>
  <path d="M0 1L1 1L1 2L0 2Z" fill="rgba(0,255,0,1)"/>
  <path d="M1 1L2 1L2 2L1 2Z" fill="rgba(0,0,255,1)"/>
</svg>`);
    });

    test("merges adjacent pixels", () => {
        const data = new Uint8ClampedArray([
            255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
            255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
            255, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255,
        ]);

        const svg = toSvg(data, 3, 3);

        expect(svg).toBe(`<svg width="3" height="3" viewBox="0 0 3 3" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0L3 0L3 2L1 2L1 3L0 3Z" fill="rgba(255,0,0,1)"/>
  <path d="M1 2L3 2L3 3L1 3Z" fill="rgba(0,255,0,1)"/>
</svg>`);
    });
}); 