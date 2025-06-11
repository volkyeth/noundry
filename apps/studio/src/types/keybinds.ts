export type KeyBindPreset = "photoshop" | "aseprite";

export interface KeyBinding {
  commands: string[];
  callback: (e: KeyboardEvent) => void;
  description: string;
}

export interface KeyBindPresetConfig {
  name: string;
  displayName: string;
  bindings: Omit<KeyBinding, 'callback'>[];
}

export const KEYBIND_PRESETS: Record<KeyBindPreset, KeyBindPresetConfig> = {
  photoshop: {
    name: "photoshop",
    displayName: "Photoshop",
    bindings: [
      { commands: ["b"], description: "Brush tool" },
      { commands: ["["], description: "Decrease brush size" },
      { commands: ["]"], description: "Increase brush size" },
      { commands: ["e"], description: "Eraser tool" },
      { commands: ["u"], description: "Cycle between Line, Rectangle and Ellipse tool" },
      { commands: ["g"], description: "Bucket tool" },
      { commands: ["v"], description: "Move tool" },
      { commands: ["m"], description: "Cycle between Rectangular and Elliptical Marquee tool" },
      { commands: ["i"], description: "Eyedropper tool" },
      { commands: ["?"], description: "Open cheat sheet" },
    ]
  },
  aseprite: {
    name: "aseprite",
    displayName: "Aseprite",
    bindings: [
      { commands: ["b"], description: "Brush tool" },
      { commands: ["-"], description: "Decrease brush size" },
      { commands: ["="], description: "Increase brush size" },
      { commands: ["e"], description: "Eraser tool" },
      { commands: ["l"], description: "Line tool" },
      { commands: ["u"], description: "Rectangle tool" },
      { commands: ["shift+u"], description: "Filled Rectangle tool" },
      { commands: ["o"], description: "Ellipse tool" },
      { commands: ["shift+o"], description: "Filled Ellipse tool" },
      { commands: ["g"], description: "Bucket tool" },
      { commands: ["h"], description: "Move tool" },
      { commands: ["m"], description: "Cycle between Rectangular and Elliptical Marquee tool" },
      { commands: ["alt"], description: "Eyedropper tool (hold)" },
      { commands: ["i"], description: "Eyedropper tool" },
      { commands: ["?"], description: "Open cheat sheet" },
    ]
  }
};