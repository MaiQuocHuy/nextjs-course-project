import { useCallback } from "react";

// Small emoji dictionary: emoji character -> textual short code
const EMOJI_MAP: Record<string, string> = {
  "😀": ":grinning:",
  "😁": ":grin:",
  "😂": ":joy:",
  "😊": ":blush:",
  "😅": ":sweat_smile:",
  "😍": ":heart_eyes:",
  "😎": ":sunglasses:",
  "😢": ":cry:",
  "😡": ":rage:",
  "👍": ":thumbsup:",
  "👎": ":thumbsdown:",
  "🙏": ":pray:",
  "🎉": ":tada:",
  "❤️": ":heart:",
  "🔥": ":fire:",
};

// Reverse map for rendering: textual short code -> emoji character
const SHORTCODE_TO_EMOJI: Record<string, string> = Object.keys(
  EMOJI_MAP
).reduce((acc, emoji) => {
  const code = EMOJI_MAP[emoji];
  acc[code] = emoji;
  return acc;
}, {} as Record<string, string>);

export const useEmojiUtils = () => {
  const convertEmojiToText = useCallback((text: string) => {
    let out = text;
    Object.keys(EMOJI_MAP).forEach((emoji) => {
      const code = EMOJI_MAP[emoji];
      out = out.split(emoji).join(code);
    });
    return out;
  }, []);

  const escapeRegExp = useCallback(
    (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    []
  );

  const convertShortcodesToEmoji = useCallback(
    (text: string) => {
      if (!text) return text;
      const codes = Object.keys(SHORTCODE_TO_EMOJI);
      if (codes.length === 0) return text;

      codes.sort((a, b) => b.length - a.length);
      const pattern = codes.map(escapeRegExp).join("|");
      const re = new RegExp(`(${pattern})`, "g");
      return text.replace(re, (match) => SHORTCODE_TO_EMOJI[match] || match);
    },
    [escapeRegExp]
  );

  const insertEmojiIntoMessage = useCallback(
    (
      emoji: string,
      messageText: string,
      setMessageText: (text: string) => void,
      textareaRef: React.RefObject<HTMLTextAreaElement | null>
    ) => {
      const cursorPos = textareaRef.current?.selectionStart ?? messageText.length;
      const before = messageText.slice(0, cursorPos);
      const after = messageText.slice(cursorPos);
      const newText = before + emoji + after;
      setMessageText(newText);
      
      setTimeout(() => {
        try {
          if (textareaRef.current) {
            const pos = cursorPos + emoji.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(pos, pos);
          }
        } catch (e) {
          // ignore
        }
      }, 0);
    },
    []
  );

  return {
    EMOJI_MAP,
    convertEmojiToText,
    convertShortcodesToEmoji,
    insertEmojiIntoMessage,
  };
};
