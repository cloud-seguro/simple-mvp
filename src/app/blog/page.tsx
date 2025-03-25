import { getAllPosts } from "@/lib/mdx";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | SIMPLE",
  description:
    "Artículos sobre ciberseguridad, privacidad y protección de datos",
  openGraph: {
    title: "Blog | SIMPLE",
    description:
      "Artículos sobre ciberseguridad, privacidad y protección de datos",
    type: "website",
  },
};

export default function BlogPage() {
  try {
    const posts = getAllPosts();
    return <BlogIndexClient posts={posts} />;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return <BlogIndexClient posts={[]} />;
  }
}
