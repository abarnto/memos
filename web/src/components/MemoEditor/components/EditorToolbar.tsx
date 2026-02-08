import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/i18n";
import { validationService } from "../services";
import { useEditorContext } from "../state";
import InsertMenu from "../Toolbar/InsertMenu";
import VisibilitySelector from "../Toolbar/VisibilitySelector";
import type { EditorToolbarProps } from "../types";
import { FocusModeToggleButton } from "./FocusModeOverlay";
import TextStyleButtons from "./TextStyleButtons";
import { useView } from "@/contexts/ViewContext";

export const EditorToolbar: FC<EditorToolbarProps> = ({ onSave, onCancel, memoName, editorRef }) => {
  const t = useTranslate();
  const viewContext = useView();
  const { state, actions, dispatch } = useEditorContext();
  const { valid } = validationService.canSave(state);

  const isSaving = state.ui.isLoading.saving;

  const handleLocationChange = (location: typeof state.metadata.location) => {
    dispatch(actions.setMetadata({ location }));
  };

  const handleToggleFocusMode = () => {
    dispatch(actions.toggleFocusMode());
  };

  const handleVisibilityChange = (visibility: typeof state.metadata.visibility) => {
    dispatch(actions.setMetadata({ visibility }));
  };

  const toolbarColumnLayout = !state.ui.isFocusMode && viewContext.layout === 'MASONRY'

  return (
    <div className={`w-full flex flex-col ${toolbarColumnLayout ? '' : 'md:flex-row'} mb-2`}>
      <div className="w-fit flex flex-row border rounded-lg md:me-2">
        <InsertMenu
          isUploading={state.ui.isLoading.uploading}
          location={state.metadata.location}
          onLocationChange={handleLocationChange}
          onToggleFocusMode={handleToggleFocusMode}
          memoName={memoName}
        />

        <FocusModeToggleButton isActive={state.ui.isFocusMode} onToggle={handleToggleFocusMode} />

        <div className="size-px h-auto my-2 bg-gray-200 mx-1"></div>

        <TextStyleButtons editorRef={editorRef} />
      </div>

      <div className={`w-full mt-1 ${toolbarColumnLayout ? '' : 'md:mt-0'} flex flex-row justify-end items-center`}>
        <div className="flex flex-row items-center">
          <VisibilitySelector value={state.metadata.visibility} onChange={handleVisibilityChange} />

          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
              {t("common.cancel")}
            </Button>
          )}

          <Button onClick={onSave} disabled={!valid || isSaving}>
            {isSaving ? t("editor.saving") : t("editor.save")}
          </Button>
        </div>
      </div>
    </div>
  );
};
