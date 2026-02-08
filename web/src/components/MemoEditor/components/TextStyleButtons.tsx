import { Button } from "@/components/ui/button";
import { BoldIcon, ItalicIcon, Code2Icon, HeadingIcon, Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, Heading6Icon, ChevronDown, Link2Icon, } from "lucide-react";
import { insertHyperlink, TEXT_STYLE as TextStyle, toggleTextStyle } from "../Editor/shortcuts";
import { TextStyleButtonsProps } from "../types/components";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type TextStyleKey = keyof typeof TextStyle;
type TextStyle = typeof TextStyle[TextStyleKey];

const HEADING_ICONS = {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon
} as const
type HeadingIconKey = keyof typeof HEADING_ICONS;

function TextStyleButtons({ editorRef }: TextStyleButtonsProps) {
  if (!editorRef.current) return null;
  const editor = editorRef.current;

  const handleToggleStyle = (STYLE: TextStyle) => {
    toggleTextStyle(editor, STYLE.delimiter);
  }

  const handleAddHeading = (headingNumber: number) => {
    const isCurrentContentEmpty = !editor.getContent().trim().length;
    const headingText = `${!isCurrentContentEmpty ? '\n' : ''
      }${new Array(headingNumber).fill('#').join('')} `;
    const cursorPosition = editor.getCursorPosition();
    editor.insertText(headingText);
    const newCursorPosition = cursorPosition + headingText.length;
    editor.setCursorPosition(newCursorPosition, newCursorPosition);
  }

  return (
    <>
      <Button variant="ghost" onClick={() => handleToggleStyle(TextStyle.BOLD)}>
        <BoldIcon />
      </Button>
      <Button variant="ghost" onClick={() => handleToggleStyle(TextStyle.ITALIC)}>
        <ItalicIcon />
      </Button>
      <Button variant="ghost" onClick={() => handleToggleStyle(TextStyle.CODE)}>
        <Code2Icon />
      </Button>
      <Button variant="ghost" onClick={() => insertHyperlink(editor)}>
        <Link2Icon />
      </Button>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shadow-none">
            <HeadingIcon className="size-4" />
            <ChevronDown className="size-3 -ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {new Array(6).fill(null).map((_, i, arr) => arr[i] = i + 1).map((headingNumber) => {
            const ICON = HEADING_ICONS[`Heading${headingNumber}Icon` as HeadingIconKey]
            return (
              <DropdownMenuItem key={headingNumber} onClick={() => handleAddHeading(headingNumber)}>
                <ICON className="w-4 h-4" />
                <span>Heading {headingNumber}</span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TextStyleButtons
