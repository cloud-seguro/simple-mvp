import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const post = getPostBySlug(resolvedParams.slug);

    return {
      title: `${post.title} | SIMPLE Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        authors: [post.author],
        ...(post.coverImage && {
          images: [{ url: post.coverImage, alt: post.title }],
        }),
      },
    };
  } catch {
    return {
      title: "Post Not Found | SIMPLE Blog",
      description: "The requested blog post could not be found",
    };
  }
}

// Generate static params for all posts
export async function generateStaticParams() {
  try {
    const posts = getAllPosts();

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// The page component with simpler error handling
export default async function BlogPostPage({ params }: PageProps) {
  // Try to get the post data
  try {
    const resolvedParams = await params;
    const post = getPostBySlug(resolvedParams.slug);
    return <BlogPostClient post={post} />;
  } catch {
    // Use Next.js's built-in notFound() for handling missing posts
    notFound();
  }
}
