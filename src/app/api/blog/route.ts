import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { BlogPostStatus } from "@/types/blog";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get profile to check permissions
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    // Determine if user is a superadmin, which can see unpublished posts
    const isSuperAdmin = profile?.role === UserRole.SUPERADMIN;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    // Regular users can only see published posts, using both published flag and status
    const where = isSuperAdmin
      ? {}
      : {
          status: BlogPostStatus.PUBLISHED,
          published: true,
        };

    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
