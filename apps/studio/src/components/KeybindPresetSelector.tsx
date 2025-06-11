import { Select } from "@chakra-ui/react";
import { useKeybindPresetState } from "../model/KeybindPresets";
import { useWorkspaceState } from "../model/Workspace";
import { KEYBIND_PRESETS, KeyBindPreset } from "../types/keybinds";

export const KeybindPresetSelector = () => {
  const { activePreset, setActivePreset } = useKeybindPresetState();
  const { rebindKeys } = useWorkspaceState();

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActivePreset(event.target.value as KeyBindPreset);
    // Trigger keybind rebinding for the current mode
    setTimeout(() => rebindKeys(), 0);
  };

  return (
    <Select
      value={activePreset}
      onChange={handlePresetChange}
      size="xs"
      variant="filled"
      bg="gray.700"
      borderColor="gray.600"
      color="white"
      maxW="160px"
      _hover={{ borderColor: "gray.500" }}
      _focus={{
        borderColor: "blue.400",
        boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
      }}
    >
      {Object.entries(KEYBIND_PRESETS).map(([key, config]) => (
        <option
          key={key}
          value={key}
          style={{
            background: "var(--chakra-colors-gray-700)",
            fontSize: "8px",
          }}
        >
          {config.displayName}
        </option>
      ))}
    </Select>
  );
};
