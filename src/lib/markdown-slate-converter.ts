import { Descendant, Element as SlateElement } from "slate";

// Convert Markdown string to Slate nodes
export const markdownToSlate = (markdown: string): Descendant[] => {
  if (!markdown || markdown.trim() === "") {
    return [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];
  }

  try {
    // Basic conversion for demonstration purposes
    // In a production app, you would want to use a more robust markdown parser
    const lines = markdown.split("\n");
    const slateNodes: Descendant[] = [];

    let currentListItems: Descendant[] = [];
    let listType: "numbered-list" | "bulleted-list" | null = null;

    const flushListItems = () => {
      if (currentListItems.length > 0) {
        slateNodes.push({
          type: listType as string,
          children: currentListItems,
        });
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
        });
      } else if (line.startsWith("## ")) {
        flushListItems();
        slateNodes.push({
          type: "heading",
          level: 2,
          children: [{ text: line.slice(3) }],
        });
      } else if (line.startsWith("### ")) {
        flushListItems();
        slateNodes.push({
          type: "heading",
          level: 3,
          children: [{ text: line.slice(4) }],
        });
      }
      // Handle blockquotes
      else if (line.startsWith("> ")) {
        flushListItems();
        slateNodes.push({
          type: "blockquote",
          children: [{ text: line.slice(2) }],
        });
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
        });
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
        });
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
        });

        // Skip to the end of the code block
        i = j;
      }
      // Handle paragraphs (default)
      else if (line.trim() !== "") {
        flushListItems();
        slateNodes.push({
          type: "paragraph",
          children: [{ text: line }],
        });
      }
      // Handle empty lines
      else {
        flushListItems();
        slateNodes.push({
          type: "paragraph",
          children: [{ text: "" }],
        });
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
      },
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

    const processNode = (node: Descendant): string => {
      if (!("type" in node)) {
        return node.text || "";
      }

      const slateElement = node as SlateElement;
      const { type, children } = slateElement;

      if (!type) {
        return children.map(processNode).join("");
      }

      switch (type) {
        case "heading":
          const level = (slateElement as any).level || 1;
          const headingMarker = "#".repeat(level);
          return `${headingMarker} ${children.map(processNode).join("")}`;

        case "paragraph":
          return children.map(processNode).join("");

        case "blockquote":
          return `> ${children.map(processNode).join("")}`;

        case "code-block":
          return `\`\`\`\n${children.map(processNode).join("")}\n\`\`\``;

        case "bulleted-list":
          return children.map((item) => processNode(item)).join("\n");

        case "numbered-list":
          return children
            .map((item, index) => `${index + 1}. ${processNode(item)}`)
            .join("\n");

        case "list-item":
          return `- ${children.map(processNode).join("")}`;

        case "link":
          const url = (slateElement as any).url || "";
          return `[${children.map(processNode).join("")}](${url})`;

        case "image":
          const imageUrl = (slateElement as any).url || "";
          const alt = (slateElement as any).alt || "";
          return `![${alt}](${imageUrl})`;

        default:
          return children.map(processNode).join("");
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
