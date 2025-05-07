import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRandomString } from "@/lib/utils/string-utils";
import { validateCorporateEmail } from "@/lib/utils/email-validation";
import { EvaluationType } from "@prisma/client";

// Interface for request body
interface GuestEvaluationRequest {
  email: string;
  type: string;
  title?: string;
  answers: Record<string, number>;
  interest?: {
    reason: string;
    otherReason?: string;
  } | null;
}

export async function POST(req: NextRequest) {
  try {
    const body: GuestEvaluationRequest = await req.json();

    // Validate email
    const { email, type: typeString, title, answers, interest } = body;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const emailValidation = validateCorporateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { message: emailValidation.reason || "Invalid email address" },
        { status: 400 }
      );
    }

    // Convert string type to EvaluationType enum
    const type =
      typeString === "INITIAL"
        ? EvaluationType.INITIAL
        : EvaluationType.ADVANCED;

    // Generate a unique access code for retrieving the evaluation later
    const accessCode = getRandomString(12);

    // Save the evaluation in the database
    const evaluation = await prisma.evaluation.create({
      data: {
        type,
        title:
          title ||
          (type === "INITIAL" ? "Evaluación Inicial" : "Evaluación Avanzada"),
        answers: JSON.stringify(answers),
        score: Object.values(answers).reduce((sum, val) => sum + val, 0),
        accessCode,
        guestEmail: email,
        metadata: interest ? { interest } : undefined,
      },
    });

    return NextResponse.json({
      message: "Evaluation saved successfully",
      evaluation: {
        id: evaluation.id,
        type: evaluation.type,
        score: evaluation.score,
        accessCode: evaluation.accessCode,
      },
    });
  } catch (error) {
    console.error("Error saving guest evaluation:", error);
    return NextResponse.json(
      { message: "An error occurred while saving evaluation" },
      { status: 500 }
    );
  }
}
