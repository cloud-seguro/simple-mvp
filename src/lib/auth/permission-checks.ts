import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

/**
 * Gets the current user from a request, using Supabase auth
 */
export async function getCurrentUser(req?: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user || null;
}

/**
 * Checks if the requester is authorized to access this user's data
 * Returns true if one of these is true:
 * 1. The requester is the same user (userId matches)
 * 2. The requester is a SUPERADMIN
 */
export async function canAccessUserData(
  requestingUserId: string,
  targetUserId: string
) {
  // If asking about their own data, always allow
  if (requestingUserId === targetUserId) {
    return true;
  }

  // Check if the user is a SUPERADMIN
  const profile = await prisma.profile.findUnique({
    where: { userId: requestingUserId },
    select: { role: true },
  });

  return profile?.role === UserRole.SUPERADMIN;
}

/**
 * Checks if a user can access specific evaluation data
 */
export async function canAccessEvaluation(
  requestingUserId: string,
  evaluationId: string
) {
  // First check if user exists
  const profile = await prisma.profile.findUnique({
    where: { userId: requestingUserId },
    select: { id: true, role: true },
  });

  if (!profile) return false;

  // SUPERADMIN can access all evaluations
  if (profile.role === UserRole.SUPERADMIN) {
    return true;
  }

  // Regular users can only access their own evaluations
  const evaluation = await prisma.evaluation.findFirst({
    where: {
      id: evaluationId,
      profileId: profile.id,
    },
  });

  return !!evaluation;
}

/**
 * Checks if a user can access a specific blog post
 * (Everyone can access published posts, only authors and admins can access drafts)
 */
export async function canAccessBlogPost(
  requestingUserId: string | null,
  postId: string
) {
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: { status: true, authorId: true },
  });

  if (!post) return false;

  // Published posts are accessible to everyone
  if (post.status === "PUBLISHED") {
    return true;
  }

  // If not published, only the author or SUPERADMIN can access
  if (!requestingUserId) return false;

  const profile = await prisma.profile.findUnique({
    where: { userId: requestingUserId },
    select: { id: true, role: true },
  });

  if (!profile) return false;

  return profile.role === UserRole.SUPERADMIN || profile.id === post.authorId;
}

/**
 * Generic resource permission check
 */
export async function canAccessResource(
  requestingUserId: string,
  resourceType:
    | "profile"
    | "evaluation"
    | "blogPost"
    | "specialist"
    | "engagement",
  resourceId: string
) {
  // First, validate the requesting user exists
  const profile = await prisma.profile.findUnique({
    where: { userId: requestingUserId },
    select: { id: true, role: true },
  });

  if (!profile) return false;

  // SUPERADMIN can access everything
  if (profile.role === UserRole.SUPERADMIN) {
    return true;
  }

  // For other roles, check specific resource types
  switch (resourceType) {
    case "profile":
      // Check if this is their own profile or if they have permission
      const targetProfile = await prisma.profile.findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });
      return targetProfile?.userId === requestingUserId;

    case "evaluation":
      const evaluation = await prisma.evaluation.findFirst({
        where: {
          id: resourceId,
          profileId: profile.id,
        },
      });
      return !!evaluation;

    case "engagement":
      const engagement = await prisma.engagement.findFirst({
        where: {
          id: resourceId,
          profileId: profile.id,
        },
      });
      return !!engagement;

    default:
      return false;
  }
}
