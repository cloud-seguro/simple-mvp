import { type NextRequest, NextResponse } from "next/server";
import {
  withApiAuth,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/middleware/api-authorization";
import { canAccessEvaluation } from "@/lib/auth/permission-checks";
import { prisma } from "@/lib/prisma";

/*
Function getInitialMaturityLevel and getAdvancedMaturityLevel are defined 
but not used in this file. They may be used elsewhere, 
so we're commenting them out rather than deleting them.
*/

// function getInitialMaturityLevel(score: number) {...}
// function getAdvancedMaturityLevel(score: number) {...}

// Update the type declaration for route handlers
type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteParams) {
  return withApiAuth(req, async (req, user) => {
    try {
      const evaluationId = (await context.params).id;

      // Must be authenticated to access evaluations
      if (!user) {
        return unauthorizedResponse();
      }

      // Check if the user has permission to access this evaluation
      const hasAccess = await canAccessEvaluation(user.id, evaluationId);

      if (!hasAccess) {
        return forbiddenResponse();
      }

      // Get the evaluation
      const evaluation = await prisma.evaluation.findUnique({
        where: { id: evaluationId },
      });

      if (!evaluation) {
        return NextResponse.json(
          { error: "Evaluation not found" },
          { status: 404 }
        );
      }

      // Return the evaluation
      return NextResponse.json({ evaluation });
    } catch (error) {
      console.error("Error in evaluation GET:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(req: NextRequest, context: RouteParams) {
  return withApiAuth(req, async (req, user) => {
    try {
      const evaluationId = (await context.params).id;

      // Must be authenticated to update evaluations
      if (!user) {
        return unauthorizedResponse();
      }

      // Check if the user has permission to access this evaluation
      const hasAccess = await canAccessEvaluation(user.id, evaluationId);

      if (!hasAccess) {
        return forbiddenResponse();
      }

      // Parse the request body
      const body = await req.json();

      // Update the evaluation
      const evaluation = await prisma.evaluation.update({
        where: { id: evaluationId },
        data: {
          // Only allow updating certain fields
          // This prevents users from changing fields they shouldn't
          title: body.title,
          answers: body.answers,
          // Don't allow changing profileId or other sensitive fields
        },
      });

      // Return the updated evaluation
      return NextResponse.json({ evaluation });
    } catch (error) {
      console.error("Error in evaluation PATCH:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
