import { Descendant } from "slate";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Define types for custom Slate elements
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

type BaseElement = {
  children: any[];
};

type ParagraphElement = BaseElement & {
  type: "paragraph";
  children: CustomText[];
};

type HeadingElement = BaseElement & {
  type: "heading";
  level: number;
  children: CustomText[];
};

type BlockquoteElement = BaseElement & {
  type: "blockquote";
  children: CustomText[];
};

type CodeBlockElement = BaseElement & {
  type: "code-block";
  children: CustomText[];
};

type ListItemElement = BaseElement & {
  type: "list-item";
  children: CustomText[];
};

type BulletedListElement = BaseElement & {
  type: "bulleted-list";
  children: ListItemElement[];
};

type NumberedListElement = BaseElement & {
  type: "numbered-list";
  children: ListItemElement[];
};

type LinkElement = BaseElement & {
  type: "link";
  url: string;
  children: CustomText[];
};

type ImageElement = BaseElement & {
  type: "image";
  url: string;
  alt: string;
  children: CustomText[];
};

type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BlockquoteElement
  | CodeBlockElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement
  | LinkElement
  | ImageElement;

declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Text: CustomText;
  }
}

// Convert Markdown string to Slate nodes
export const markdownToSlate = (markdown: string): Descendant[] => {
  if (!markdown || markdown.trim() === "") {
    return [
      {
        type: "paragraph",
        children: [{ text: "" }],
      } as ParagraphElement,
    ];
  }

  try {
    // Basic conversion for demonstration purposes
    // In a production app, you would want to use a more robust markdown parser
    const lines = markdown.split("\n");
    const slateNodes: Descendant[] = [];

    let currentListItems: ListItemElement[] = [];
    let listType: "numbered-list" | "bulleted-list" | null = null;

    const flushListItems = () => {
      if (currentListItems.length > 0) {
        slateNodes.push({
          type: listType as any,
          children: currentListItems,
        } as BulletedListElement | NumberedListElement);
        currentListItems = [];
        listType = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle headings
      if (line.startsWith("# ")) {
        flushListItems();
        slateNodes.push({
          type: "heading",
          level: 1,
          children: [{ text: line.slice(2) }],
        } as HeadingElement);
      } else if (line.startsWith("## ")) {
        flushListItems();
        slateNodes.push({
          type: "heading",
          level: 2,
          children: [{ text: line.slice(3) }],
        } as HeadingElement);
      } else if (line.startsWith("### ")) {
        flushListItems();
        slateNodes.push({
          type: "heading",
          level: 3,
          children: [{ text: line.slice(4) }],
        } as HeadingElement);
      }
      // Handle blockquotes
      else if (line.startsWith("> ")) {
        flushListItems();
        slateNodes.push({
          type: "blockquote",
          children: [{ text: line.slice(2) }],
        } as BlockquoteElement);
      }
      // Handle unordered lists
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        if (listType !== "bulleted-list") {
          flushListItems();
          listType = "bulleted-list";
        }
        currentListItems.push({
          type: "list-item",
          children: [{ text: line.slice(2) }],
        } as ListItemElement);
      }
      // Handle ordered lists
      else if (line.match(/^\d+\.\s/)) {
        if (listType !== "numbered-list") {
          flushListItems();
          listType = "numbered-list";
        }
        const content = line.replace(/^\d+\.\s/, "");
        currentListItems.push({
          type: "list-item",
          children: [{ text: content }],
        } as ListItemElement);
      }
      // Handle code blocks
      else if (line.startsWith("```")) {
        flushListItems();
        // Find the end of the code block
        let codeContent = "";
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith("```")) {
          codeContent += lines[j] + (j < lines.length - 1 ? "\n" : "");
          j++;
        }

        slateNodes.push({
          type: "code-block",
          children: [{ text: codeContent }],
        } as CodeBlockElement);

        // Skip to the end of the code block
        i = j;
      }
      // Handle paragraphs (default)
      else if (line.trim() !== "") {
        flushListItems();
        slateNodes.push({
          type: "paragraph",
          children: [{ text: line }],
        } as ParagraphElement);
      }
      // Handle empty lines
      else {
        flushListItems();
        slateNodes.push({
          type: "paragraph",
          children: [{ text: "" }],
        } as ParagraphElement);
      }
    }

    flushListItems();
    return slateNodes;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return [
      {
        type: "paragraph",
        children: [{ text: markdown }],
      } as ParagraphElement,
    ];
  }
};

// Convert Slate nodes to Markdown string
export const slateToMarkdown = (nodes: Descendant[]): string => {
  if (!nodes || nodes.length === 0) {
    return "";
  }

  try {
    let markdown = "";

    const processNode = (node: any): string => {
      if (!("type" in node)) {
        return node.text || "";
      }

      const { type, children } = node;

      if (!type) {
        return (children as any[]).map(processNode).join("");
      }

      switch (type) {
        case "heading":
          const level = node.level || 1;
          const headingMarker = "#".repeat(level);
          return `${headingMarker} ${(children as any[]).map(processNode).join("")}`;

        case "paragraph":
          return (children as any[]).map(processNode).join("");

        case "blockquote":
          return `> ${(children as any[]).map(processNode).join("")}`;

        case "code-block":
          return `\`\`\`\n${(children as any[]).map(processNode).join("")}\n\`\`\``;

        case "bulleted-list":
          return (children as any[])
            .map((item) => processNode(item))
            .join("\n");

        case "numbered-list":
          return (children as any[])
            .map((item, index) => `${index + 1}. ${processNode(item)}`)
            .join("\n");

        case "list-item":
          return `- ${(children as any[]).map(processNode).join("")}`;

        case "link":
          const url = node.url || "";
          return `[${(children as any[]).map(processNode).join("")}](${url})`;

        case "image":
          const imageUrl = node.url || "";
          const alt = node.alt || "";
          return `![${alt}](${imageUrl})`;

        default:
          return (children as any[]).map(processNode).join("");
      }
    };

    for (const node of nodes) {
      markdown += processNode(node) + "\n";
    }

    return markdown.trim();
  } catch (error) {
    console.error("Error generating markdown:", error);
    return "";
  }
};
