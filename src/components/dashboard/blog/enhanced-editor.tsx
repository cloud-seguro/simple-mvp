"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlock from "@tiptap/extension-code-block";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface EnhancedEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const EnhancedEditor = ({
  content,
  onChange,
  placeholder = "Comienza a escribir...",
}: EnhancedEditorProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [isMarkdown, setIsMarkdown] = useState(true);

  // Check if content is markdown format
  useEffect(() => {
    // Simple check for common markdown patterns
    const markdownPatterns = [
      /^#+ /m, // Headers
      /\*\*.*?\*\*/, // Bold
      /\*.*?\*/, // Italic
      /\[.*?\]\(.*?\)/, // Links
      /```[\s\S]*?```/, // Code blocks
      /^\s*[-*+] /m, // Unordered lists
      /^\s*\d+\. /m, // Ordered lists
      /!\[.*?\]\(.*?\)/, // Images
    ];

    const isMarkdownContent = markdownPatterns.some((pattern) =>
      pattern.test(content)
    );

    setIsMarkdown(isMarkdownContent);
  }, [content]);

  // Initialize the Tiptap editor with extended features
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable the default code block to use our custom one
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-700",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "mx-auto rounded-lg my-4 max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 dark:border-gray-700 p-2",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "bg-gray-100 dark:bg-gray-800 font-bold border border-gray-300 dark:border-gray-700 p-2",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "rounded-md bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      // Add the Markdown extension for parsing
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ],
    content: isMarkdown ? content : content || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] px-4 py-2",
        placeholder,
      },
    },
  });

  // Update editor content when markdown changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if (isMarkdown) {
        // If markdown content detected, set the content using markdown
        editor.commands.setContent(content, true);
      }
    }
  }, [editor, content, isMarkdown]);

  // Toolbar action handlers
  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const setLink = useCallback(() => {
    // Cancel if no URL is provided
    if (!linkUrl) {
      return;
    }

    // If text is selected, set a link on that text
    if (editor?.isActive("link")) {
      editor?.chain().focus().unsetLink().run();
      return;
    }

    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor?.chain().focus().setLink({ href: url }).run();

    setLinkUrl("");
    setShowLinkPopover(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!imageUrl) {
      return;
    }

    editor?.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setShowImagePopover(false);
  }, [editor, imageUrl]);

  const addTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const setTextAlign = useCallback(
    (align: "left" | "center" | "right") => {
      editor?.chain().focus().setTextAlign(align).run();
    },
    [editor]
  );

  const undo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const redo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  const clearContent = useCallback(() => {
    if (confirm("¿Estás seguro de que quieres borrar todo el contenido?")) {
      editor?.chain().focus().clearContent().run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleBold}
          className={
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleItalic}
          className={
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleUnderline}
          className={
            editor.isActive("underline") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleStrike}
          className={
            editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => toggleHeading(1)}
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => toggleHeading(2)}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => toggleHeading(3)}
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleBulletList}
          className={
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleOrderedList}
          className={
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleBlockquote}
          className={
            editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleCodeBlock}
          className={
            editor.isActive("codeBlock") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={
                editor.isActive("link") ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-sm">
                {editor.isActive("link") ? "Edit Link" : "Add Link"}
              </h3>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                {editor.isActive("link") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setShowLinkPopover(false);
                    }}
                  >
                    Remove Link
                  </Button>
                )}
                <Button type="button" size="sm" onClick={setLink}>
                  {editor.isActive("link") ? "Update" : "Add"} Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showImagePopover} onOpenChange={setShowImagePopover}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-sm">Add Image</h3>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="flex justify-end">
                <Button type="button" size="sm" onClick={addImage}>
                  Add Image
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button type="button" variant="ghost" size="icon" onClick={addTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setTextAlign("left")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setTextAlign("center")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setTextAlign("right")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button type="button" variant="ghost" size="icon" onClick={undo}>
          <Undo className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="icon" onClick={redo}>
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearContent}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="bg-white dark:bg-gray-950 min-h-[500px]"
      />
    </div>
  );
};
