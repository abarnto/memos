import type { EditorRefActions } from "./index";

export const TEXT_STYLE = {
  BOLD: { key: "b", delimiter: "**" },
  ITALIC: { key: "i", delimiter: "_" },
  CODE: { key: "m", delimiter: "`" },
  LINK: { key: "k", delimiter: "" },
} as const;
type KeyType = (typeof TEXT_STYLE)[keyof typeof TEXT_STYLE]["key"];

const URL_PLACEHOLDER = "url";
const URL_REGEX = /^https?:\/\/[^\s]+$/;
const LINK_OFFSET = 3; // Length of "]()"

export function handleMarkdownShortcuts(event: KeyboardEvent, editor: EditorRefActions): void {
  const key = event.key.toLowerCase();
  if (
    Object.values(TEXT_STYLE)
      .map((s) => s.key)
      .includes(key as KeyType)
  ) {
    event.preventDefault();
  }

  switch (key) {
    case TEXT_STYLE.BOLD.key:
      toggleTextStyle(editor, TEXT_STYLE.BOLD.delimiter);
      break;
    case TEXT_STYLE.ITALIC.key:
      toggleTextStyle(editor, TEXT_STYLE.ITALIC.delimiter);
      break;
    case TEXT_STYLE.CODE.key:
      toggleTextStyle(editor, TEXT_STYLE.CODE.delimiter);
      break;
    case TEXT_STYLE.LINK.key:
      insertHyperlink(editor);
      break;
  }
}

export function toggleTextStyle(editor: EditorRefActions, delimiter: string): void {
  const selectedContent = editor.getSelectedContent();
  const isStyled = editor.isTextStyled(delimiter);

  if (isStyled) {
    // Remove delimiters around the selection
    const cursorPosition = editor.getCursorPosition();
    const delimiterLen = delimiter.length;
    // Remove the delimiter before the selection
    editor.removeText(cursorPosition - delimiterLen, delimiterLen);
    // Remove the delimiter after the selection (now shifted by delimiterLen)
    const endPosition = cursorPosition + selectedContent.length - delimiterLen;
    editor.removeText(endPosition, delimiterLen);
    // Restore selection without delimiters
    editor.setCursorPosition(cursorPosition - delimiterLen, endPosition);
  } else {
    // Add delimiters around the selection
    const cursorPosition = editor.getCursorPosition();
    editor.insertText(`${delimiter}${selectedContent}${delimiter}`);
    editor.setCursorPosition(
      cursorPosition + delimiter.length,
      cursorPosition + delimiter.length + selectedContent.length,
    );
  }
}

export function insertHyperlink(editor: EditorRefActions, url?: string): void {
  const cursorPosition = editor.getCursorPosition();
  const selectedContent = editor.getSelectedContent();
  const isUrlSelected = !url && URL_REGEX.test(selectedContent.trim());

  if (isUrlSelected) {
    editor.insertText(`[](${selectedContent})`);
    editor.setCursorPosition(cursorPosition + 1, cursorPosition + 1);
    return;
  }

  const href = url ?? URL_PLACEHOLDER;
  editor.insertText(`[${selectedContent}](${href})`);

  if (href === URL_PLACEHOLDER) {
    const urlStart = cursorPosition + selectedContent.length + LINK_OFFSET;
    editor.setCursorPosition(urlStart, urlStart + href.length);
  }
}

export function hyperlinkHighlightedText(editor: EditorRefActions, url: string): void {
  const selectedContent = editor.getSelectedContent();
  const cursorPosition = editor.getCursorPosition();

  editor.insertText(`[${selectedContent}](${url})`);

  const newPosition = cursorPosition + selectedContent.length + url.length + 4;
  editor.setCursorPosition(newPosition, newPosition);
}
