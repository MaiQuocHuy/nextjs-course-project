"use client";

import React from "react";

interface EmojiPickerProps {
  isVisible: boolean;
  onEmojiSelect: (emoji: string) => void;
  emojiMap: Record<string, string>;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isVisible,
  onEmojiSelect,
  emojiMap,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-12 right-0 z-50 bg-white border rounded shadow p-2 w-48 max-w-[90vw] max-h-[200px] overflow-y-auto">
      <div className="grid grid-cols-6 gap-2">
        {Object.keys(emojiMap).map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="p-1 hover:bg-muted rounded text-lg flex-shrink-0"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
