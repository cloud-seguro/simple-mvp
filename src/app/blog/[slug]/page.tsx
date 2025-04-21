import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/mdx";
import BlogPostClient from "@/components/blog/BlogPostClient";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const slug = params.slug;

    // Fetch the post from the database
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });

    if (!post) {
      return {
        title: "Post no encontrado | SIMPLE",
      };
    }

    return {
      title: `${post.title} | SIMPLE Blog`,
      description: post.excerpt,
      openGraph: {
        title: `${post.title} | SIMPLE Blog`,
        description: post.excerpt,
        type: "article",
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for post ${params.slug}:`, error);
    return {
      title: "Blog | SIMPLE",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const slug = params.slug;

    // Fetch the post from the database
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!dbPost) {
      notFound();
    }

    // Transform the post data to match the expected format
    const date = new Date(dbPost.createdAt);
    const formattedDate = format(date, "MMMM dd, yyyy", { locale: es });
    const readingTime = calculateReadingTime(dbPost.content);

    const post = {
      slug: dbPost.slug,
      title: dbPost.title,
      date: date.toISOString(),
      formattedDate,
      excerpt: dbPost.excerpt,
      content: dbPost.content,
      author:
        dbPost.author.firstName && dbPost.author.lastName
          ? `${dbPost.author.firstName} ${dbPost.author.lastName}`
          : "SIMPLE",
      coverImage: dbPost.coverImage,
      tags: dbPost.tags,
      readingTime,
    };

    return <BlogPostClient post={post} />;
  } catch (error) {
    console.error(`Error loading post ${params.slug}:`, error);
    notFound();
  }
}
