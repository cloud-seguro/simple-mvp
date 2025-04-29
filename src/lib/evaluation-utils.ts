import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface EvaluationMetadata {
  interest?: {
    reason: string;
    otherReason?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Checks if a user can access advanced evaluations based on their role
 * @param userRole - The role of the user
 * @returns Boolean indicating if the user can access advanced evaluations
 */
export function canAccessAdvancedEvaluation(userRole?: string | null): boolean {
  return userRole === "PREMIUM" || userRole === "SUPERADMIN";
}

/**
 * Checks if a user can access the dashboard based on their role
 * @param userRole - The role of the user
 * @returns Boolean indicating if the user can access the dashboard
 */
export function canAccessDashboard(userRole?: string | null): boolean {
  return userRole === "PREMIUM" || userRole === "SUPERADMIN";
}

/**
 * Calculates the security score based on evaluation answers
 * @param answers - JSON object containing question IDs and selected option values
 * @returns A score between 0 and 100
 */
export function calculateSecurityScore(
  answers: Record<string, number>
): number {
  if (!answers || Object.keys(answers).length === 0) {
    return 0;
  }

  // Get all the values (selected option scores)
  const values = Object.values(answers);

  // Calculate the total possible score (assuming max value of 3 per question)
  const maxPossibleScore = Object.keys(answers).length * 3;

  // Calculate the actual score
  const actualScore = values.reduce((sum, value) => sum + value, 0);

  // Convert to a 0-100 scale
  return Math.round((actualScore / maxPossibleScore) * 100);
}

/**
 * Creates a new evaluation in the database
 * @param data - Evaluation data including answers and user information
 * @returns The created evaluation
 */
export async function createEvaluation(data: {
  type: "INITIAL" | "ADVANCED";
  title: string;
  answers: Record<string, number>;
  profileId: string;
  userRole: string;
  interest?: {
    reason: string;
    otherReason?: string;
  } | null;
}) {
  // Validate input data
  if (!data.profileId) {
    throw new Error("Profile ID is required for creating an evaluation");
  }

  if (!data.answers || Object.keys(data.answers).length === 0) {
    throw new Error("Evaluation answers are required and cannot be empty");
  }

  // Validate interest data if provided
  if (data.interest) {
    if (!data.interest.reason) {
      throw new Error(
        "Interest reason is required when interest data is provided"
      );
    }
    if (data.interest.reason === "other" && !data.interest.otherReason) {
      throw new Error("Other reason is required when reason is 'other'");
    }
  }

  // Validate that advanced evaluations require PREMIUM or SUPERADMIN role
  // Temporarily disabled premium requirement for advanced evaluations
  if (data.type === "ADVANCED") {
    // Always allow advanced evaluations for now
    console.log("Premium check for advanced evaluations temporarily disabled");
  }

  try {
    // Calculate the security score
    const score = calculateSecurityScore(data.answers);

    // Create the evaluation with interest data if provided
    const evaluation = await prisma.evaluation.create({
      data: {
        type: data.type,
        title: data.title,
        score,
        profileId: data.profileId,
        answers: data.answers,
        completedAt: new Date(),
        metadata: data.interest
          ? {
              interest: {
                reason: data.interest.reason,
                otherReason: data.interest.otherReason,
              },
            }
          : undefined,
      },
    });

    return evaluation;
  } catch (error) {
    console.error("Error creating evaluation:", error);
    if (error instanceof Error) {
      // Rethrow with more context
      throw new Error(`Failed to create evaluation: ${error.message}`);
    }
    throw new Error("Unknown error occurred while creating evaluation");
  }
}

/**
 * Retrieves evaluations for a user profile
 * @param profileId - The ID of the user profile
 * @returns Array of evaluations
 */
export async function getUserEvaluations(profileId: string) {
  if (!profileId) {
    throw new Error("Profile ID is required");
  }

  const evaluations = await prisma.evaluation.findMany({
    where: {
      profileId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return evaluations;
}

/**
 * Retrieves a specific evaluation by ID
 * @param id - The ID of the evaluation
 * @returns The evaluation or null if not found
 */
export async function getEvaluationById(id: string) {
  if (!id) {
    throw new Error("Evaluation ID is required");
  }

  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id,
      },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            company: true,
            company_role: true,
          },
        },
      },
    });

    if (evaluation) {
      // Get the expected questions based on evaluation type
      const expectedQuestions =
        evaluation.type === "INITIAL"
          ? 15 // Initial evaluation has 15 questions
          : 25; // Advanced evaluation has 25 questions

      console.log(`Found evaluation with ID ${id}:`, {
        type: evaluation.type,
        title: evaluation.title,
        score: evaluation.score,
        answersType: typeof evaluation.answers,
        answersIsArray: Array.isArray(evaluation.answers),
        answersKeys: evaluation.answers
          ? Object.keys(evaluation.answers as object)
          : [],
        answersCount: evaluation.answers
          ? Object.keys(evaluation.answers as object).length
          : 0,
        expectedQuestions,
        missingKeys: evaluation.answers
          ? expectedQuestions - Object.keys(evaluation.answers as object).length
          : expectedQuestions,
        hasMetadata: Boolean(evaluation.metadata),
        metadataType: evaluation.metadata
          ? typeof evaluation.metadata
          : "undefined",
        hasInterestData: evaluation.metadata
          ? Boolean((evaluation.metadata as EvaluationMetadata)?.interest)
          : false,
      });
    } else {
      console.log(`No evaluation found with ID ${id}`);
    }

    return evaluation;
  } catch (error) {
    console.error(`Error fetching evaluation with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Retrieves a specific evaluation by ID and access code
 * @param id - The ID of the evaluation
 * @param accessCode - The access code for the evaluation
 * @returns The evaluation or null if not found or access code is invalid
 */
export async function getEvaluationByAccessCode(
  id: string,
  accessCode: string
) {
  if (!id || !accessCode) {
    throw new Error("Evaluation ID and access code are required");
  }

  try {
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        id,
        accessCode,
      },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            company: true,
            company_role: true,
          },
        },
      },
    });

    if (evaluation) {
      console.log(
        `Successfully accessed evaluation with access code: ${accessCode}`
      );

      // Create a "fake" profile if this is a guest evaluation without a profile
      if (!evaluation.profile && evaluation.guestEmail) {
        // @ts-ignore - Add a synthetic profile for guest users
        evaluation.profile = {
          firstName: "Usuario",
          lastName: "",
          email: evaluation.guestEmail,
          company: "",
          company_role: "",
        };
      }
    } else {
      console.log(
        `No evaluation found with ID ${id} and access code ${accessCode}`
      );
    }

    return evaluation;
  } catch (error) {
    console.error(`Error fetching evaluation with access code:`, error);
    throw error;
  }
}
