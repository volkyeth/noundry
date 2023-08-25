import Mousetrap from "mousetrap";
import { useEffect } from "react";
import { useClipboardState } from "../model/Clipboard";
import { useSelectionState } from "../model/Selection";
import { useWorkspaceState } from "../model/Workspace";
import { withSelectionClip } from "../tools/tools";
import { clearCanvas } from "./canvas";

export const useHotkeys = () => {
  const { clearSelection } = useSelectionState();
  const { canvas, apply } = useWorkspaceState();
  const { hasSelection } = useSelectionState();
  const { saveSelectionToClipboard, placeFromClipboard, placing, place } = useClipboardState();
  useEffect(() => {
    return () => {
      Mousetrap.reset();
    };
  }, []);

  Mousetrap.bind("escape", () => {
    if (!canvas) {
      return;
    }

    if (placing) {
      place(canvas);
      return;
    }
    clearSelection();
  });

  Mousetrap.bind("enter", () => {
    if (!canvas || !placing) {
      return;
    }

    place(canvas);
  });

  Mousetrap.bind(["ctrl+c", "command+c"], () => {
    if (!hasSelection() || !canvas) {
      return;
    }

    console.log("copied");

    saveSelectionToClipboard(canvas);
  });

  Mousetrap.bind(["ctrl+x", "command+x"], () => {
    if (!hasSelection() || !canvas) {
      return;
    }

    saveSelectionToClipboard(canvas);
    apply((ctx) => {
      withSelectionClip(ctx, () => {
        clearCanvas(canvas);
      });
    });
  });

  Mousetrap.bind(["del", "backspace"], () => {
    if (!hasSelection() || !canvas) {
      return;
    }

    apply((ctx) => {
      withSelectionClip(ctx, () => {
        clearCanvas(canvas);
      });
    });
  });

  Mousetrap.bind(["ctrl+v", "command+v"], () => {
    if (!canvas) {
      return;
    }

    if (placing) {
      place(canvas);
    }

    clearSelection();
    placeFromClipboard();
  });

  Mousetrap.bind(["ctrl+shift+v", "command+shift+v"], () => {
    if (!canvas) {
      return;
    }

    placeFromClipboard();
  });
};
