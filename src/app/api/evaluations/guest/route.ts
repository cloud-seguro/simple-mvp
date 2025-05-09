import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRandomString } from "@/lib/utils/string-utils";
import { validateCorporateEmail } from "@/lib/utils/email-validation";
import { EvaluationType } from "@prisma/client";

// Interface for request body
interface GuestEvaluationRequest {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phoneNumber?: string;
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

    // Validate required fields
    const {
      email,
      firstName,
      lastName,
      company,
      phoneNumber,
      type: typeString,
      title,
      answers,
      interest,
    } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: "First name and last name are required" },
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
        // Store guest information in both dedicated fields and metadata
        guestFirstName: firstName,
        guestLastName: lastName,
        guestCompany: company,
        guestPhoneNumber: phoneNumber,
        // Keep metadata for backward compatibility and additional data
        metadata: {
          interest: interest || null,
          guestInfo: {
            firstName,
            lastName,
            company,
            phoneNumber,
          },
        },
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
