import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostEditor } from "@/components/dashboard/blog/blog-post-editor";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { BlogPostStatus } from "@prisma/client";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = "force-dynamic";

type PostParams = {
  id: string;
};

// Define the Post type to match the structure we're creating
type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  tags: string[];
  description?: string;
  featuredImage?: string;
  status: BlogPostStatus;
};

export default async function BlogPostPage({ params }: any) {
  const paramValues = params as PostParams;
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Check if this is a new post or an existing one
  const isNewPost = paramValues.id === "new";

  // Initialize post with the correct type annotation
  let post: Post | null = null;

  if (!isNewPost) {
    // Fetch the existing post
    const dbPost = await prisma.blogPost.findUnique({
      where: { id: paramValues.id },
      include: {
        author: true,
      },
    });

    if (!dbPost) {
      notFound();
    }

    // Convert null to undefined for optional properties to match the expected type
    post = {
      id: dbPost.id,
      title: dbPost.title,
      slug: dbPost.slug,
      excerpt: dbPost.excerpt,
      content: dbPost.content,
      coverImage: dbPost.coverImage || undefined,
      published: dbPost.published,
      tags: dbPost.tags || [],
      description: dbPost.description || undefined,
      featuredImage: dbPost.featuredImage || undefined,
      status: dbPost.status,
    };
  }

  // Get the current user's profile
  const userProfile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!userProfile) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {isNewPost ? "Crear nuevo artículo" : "Editar artículo"}
          </h1>
          <p className="text-muted-foreground">
            {isNewPost
              ? "Crea un nuevo artículo para el blog"
              : `Editando: ${post?.title}`}
          </p>
        </div>
      </div>

      <BlogPostEditor post={post} authorId={userProfile.id} />
    </div>
  );
}
