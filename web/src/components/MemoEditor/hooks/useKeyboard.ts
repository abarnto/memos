import { useEffect } from "react";
import type { EditorRefActions } from "../Editor";
import { handleMarkdownShortcuts } from "../Editor/shortcuts";

interface UseKeyboardOptions {
  onSave: () => void;
}

export const useKeyboard = (_editorRef: React.RefObject<EditorRefActions | null>, options: UseKeyboardOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "Enter") {
          event.preventDefault();
          options.onSave();
        }
        handleMarkdownShortcuts(event, _editorRef.current as EditorRefActions);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options]);
};
