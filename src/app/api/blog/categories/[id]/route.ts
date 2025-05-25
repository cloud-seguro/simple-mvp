import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { generateSlug } from "@/lib/utils";

// Get a single blog category
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
    const category = await prisma.blogCategory.findUnique({
      where: { id: (await params).id },
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
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching blog category:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog category" },
      { status: 500 }
    );
  }
}

// Update a blog category
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

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id: (await params).id },
      select: { createdById: true },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Only superadmins or the category creator can update categories
    if (
      profile?.role !== UserRole.SUPERADMIN &&
      profile?.id !== existingCategory.createdById
    ) {
      return NextResponse.json(
        { error: "Not authorized to update this category" },
        { status: 403 }
      );
    }

    // Generate slug from name if not provided
    const slug = body.slug || generateSlug(body.name);

    // Check if name or slug already exists (excluding current category)
    const duplicateCategory = await prisma.blogCategory.findFirst({
      where: {
        AND: [
          { id: { not: (await params).id } },
          {
            OR: [{ name: body.name }, { slug }],
          },
        ],
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 400 }
      );
    }

    // Update category
    const updatedCategory = await prisma.blogCategory.update({
      where: { id: (await params).id },
      data: {
        name: body.name,
        slug,
        description: body.description,
        color: body.color,
        active: body.active,
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
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating blog category:", error);
    return NextResponse.json(
      { error: "Failed to update blog category" },
      { status: 500 }
    );
  }
}

// Delete a blog category
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

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id: (await params).id },
      select: { createdById: true },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Only superadmins or the category creator can delete categories
    if (
      profile?.role !== UserRole.SUPERADMIN &&
      profile?.id !== existingCategory.createdById
    ) {
      return NextResponse.json(
        { error: "Not authorized to delete this category" },
        { status: 403 }
      );
    }

    // Check if category has posts
    const postsCount = await prisma.blogPost.count({
      where: { categoryId: (await params).id },
    });

    if (postsCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with existing posts. Please move or delete the posts first.",
        },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.blogCategory.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return NextResponse.json(
      { error: "Failed to delete blog category" },
      { status: 500 }
    );
  }
}
