import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KeyBindPreset } from "../types/keybinds";

interface KeybindPresetState {
  activePreset: KeyBindPreset;
  setActivePreset: (preset: KeyBindPreset) => void;
}

export const useKeybindPresetState = create<KeybindPresetState>()(
  persist(
    (set) => ({
      activePreset: "photoshop",
      setActivePreset: (preset: KeyBindPreset) => set({ activePreset: preset }),
    }),
    {
      name: "keybind-preset-storage",
    }
  )
);