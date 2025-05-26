import { prisma } from "@/lib/prisma";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { Metadata } from "next";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { calculateReadingTime } from "@/lib/mdx";
import type { BlogPost } from "@/lib/mdx";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre ciberseguridad, privacidad y protección de datos",
  openGraph: {
    title: "Blog",
    description:
      "Artículos sobre ciberseguridad, privacidad y protección de datos",
    type: "website",
  },
};

export default async function BlogPage() {
  try {
    // Fetch published blog posts from the database
    const dbPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    // Fetch all active categories for filtering
    const categories = await prisma.blogCategory.findMany({
      where: {
        active: true,
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform the post data to match the expected format
    const posts: BlogPost[] = dbPosts.map((post) => {
      const date = new Date(post.createdAt);
      const formattedDate = format(date, "MMMM dd, yyyy", { locale: es });
      const readingTime = calculateReadingTime(post.content);

      return {
        slug: post.slug,
        title: post.title,
        date: date.toISOString(),
        formattedDate,
        excerpt: post.excerpt,
        content: post.content,
        author:
          post.author.firstName && post.author.lastName
            ? `${post.author.firstName} ${post.author.lastName}`
            : "SIMPLE",
        coverImage: post.coverImage || undefined,
        tags: post.tags || [],
        readingTime,
        category: post.category
          ? {
              id: post.category.id,
              name: post.category.name,
              slug: post.category.slug,
              color: post.category.color || "#6B7280",
            }
          : undefined,
      };
    });

    return <BlogIndexClient posts={posts} categories={categories} />;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return <BlogIndexClient posts={[]} categories={[]} />;
  }
}
