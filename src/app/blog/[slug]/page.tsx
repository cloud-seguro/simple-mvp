import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { Metadata } from "next";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const post = getPostBySlug(params.slug);

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
  } catch (error) {
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    // Get the post data in the server component
    const post = getPostBySlug(params.slug);

    // Pass the post data to the client component
    return <BlogPostClient post={post} />;
  } catch (error) {
    console.error("Error loading post:", error);
    // In case of error, we'll let the client component handle the notFound state
    return <BlogPostClient error={true} />;
  }
}
