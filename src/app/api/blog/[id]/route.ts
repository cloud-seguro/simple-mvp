import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { generateSlug } from "@/lib/utils";

// Get a single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: (await params).id },
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

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get user profile to check permissions
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });

    // Only superadmins or the post author can see unpublished posts
    if (
      !post.published &&
      profile?.role !== UserRole.SUPERADMIN &&
      profile?.id !== post.authorId
    ) {
      return NextResponse.json(
        { error: "Not authorized to view this post" },
        { status: 403 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Get user profile to check permissions
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: (await params).id },
      select: { authorId: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only superadmins or the post author can update posts
    if (
      profile?.role !== UserRole.SUPERADMIN &&
      profile?.id !== existingPost.authorId
    ) {
      return NextResponse.json(
        { error: "Not authorized to update this post" },
        { status: 403 }
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

    // Convert "none" to null for categoryId
    const categoryId = body.categoryId === "none" ? null : body.categoryId;

    // Update post
    const updatedPost = await prisma.blogPost.update({
      where: { id: (await params).id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        published: body.status === "PUBLISHED",
        status: body.status,
        description: body.description,
        featuredImage: body.featuredImage,
        slug,
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

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: (await params).id },
      select: { authorId: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only superadmins or the post author can delete posts
    if (
      profile?.role !== UserRole.SUPERADMIN &&
      profile?.id !== existingPost.authorId
    ) {
      return NextResponse.json(
        { error: "Not authorized to delete this post" },
        { status: 403 }
      );
    }

    // Delete post
    await prisma.blogPost.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
