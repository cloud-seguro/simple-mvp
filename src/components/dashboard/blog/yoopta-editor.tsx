"use client";

import { useEffect, useState } from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

interface YooptaEditorComponentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const YooptaEditorComponent = ({
  content,
  onChange,
  placeholder = "Start typing...",
}: YooptaEditorComponentProps) => {
  // Create a new editor instance with React and history plugins
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  // Initialize with empty paragraph
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  // Update editor content when content prop changes
  useEffect(() => {
    if (content && content.trim() !== "") {
      try {
        // Simple conversion from markdown to slate format
        setValue([
          {
            type: "paragraph",
            children: [{ text: content }],
          },
        ]);
      } catch (error) {
        console.error("Error converting content:", error);
      }
    }
  }, [content]);

  // Handle editor changes
  const handleChange = (newValue: any) => {
    setValue(newValue);

    // Convert slate value to markdown/text
    const plainText = newValue.map((n: any) => Node.string(n)).join("\n");

    if (plainText !== content) {
      onChange(plainText);
    }
  };

  return (
    <div className="yoopta-editor-container">
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Editable placeholder={placeholder} className="yoopta-editable" />
      </Slate>
    </div>
  );
};
