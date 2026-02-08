import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOCUS_MODE_STYLES } from "../constants";
import type { FocusModeToggleButtonProps, FocusModeOverlayProps } from "../types";
import { useTranslation } from "react-i18next";

export function FocusModeOverlay({ isActive, onToggle }: FocusModeOverlayProps) {
  if (!isActive) return null;

  return <button type="button" className={FOCUS_MODE_STYLES.backdrop} onClick={onToggle} aria-label="Exit focus mode" />;
}

export function FocusModeToggleButton({ isActive, onToggle }: FocusModeToggleButtonProps) {
  const { t } = useTranslation();
  const ICON = isActive ? Minimize2Icon : Maximize2Icon
  return (
    <Button variant="ghost" size="icon" className={FOCUS_MODE_STYLES.toggleButton} onClick={onToggle} title={isActive ? t("editor.exit-focus-mode") : t('editor.focus-mode')}>
      <ICON className="w-4 h-4" />
    </Button>
  );
}
