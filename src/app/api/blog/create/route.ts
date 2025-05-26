import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole, BlogPostStatus } from "@prisma/client";
import { generateSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user profile to check permissions
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });

    // Only superadmins can create posts
    if (profile?.role !== UserRole.SUPERADMIN) {
      return NextResponse.json(
        { error: "Only superadmins can create blog posts" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        { error: "Title, content, and excerpt are required" },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (body.categoryId && body.categoryId !== "none") {
      const categoryExists = await prisma.blogCategory.findUnique({
        where: { id: body.categoryId },
        select: { id: true },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: "Invalid category selected" },
          { status: 400 }
        );
      }
    }

    // Generate slug from title if not provided
    const slug = body.slug || generateSlug(body.title);

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    // Convert "none" to null for categoryId
    const categoryId = body.categoryId === "none" ? null : body.categoryId;

    // Create post
    const newPost = await prisma.blogPost.create({
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        published: body.status === "PUBLISHED",
        status: body.status || BlogPostStatus.DRAFT,
        description: body.description,
        featuredImage: body.featuredImage,
        slug,
        authorId: profile.id,
        tags: body.tags || [],
        categoryId: categoryId,
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

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
