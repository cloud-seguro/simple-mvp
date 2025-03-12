import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
}) {
  // Validate input data
  if (!data.profileId) {
    throw new Error("Profile ID is required for creating an evaluation");
  }

  if (!data.answers || Object.keys(data.answers).length === 0) {
    throw new Error("Evaluation answers are required and cannot be empty");
  }

  // Validate that advanced evaluations require PREMIUM or SUPERADMIN role
  if (data.type === "ADVANCED" && !canAccessAdvancedEvaluation(data.userRole)) {
    throw new Error("Advanced evaluations require a premium subscription");
  }

  try {
    // Calculate the security score
    const score = calculateSecurityScore(data.answers);

    // Create the evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        type: data.type,
        title: data.title,
        score,
        profileId: data.profileId,
        answers: data.answers,
        completedAt: new Date(),
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
      console.log(`Found evaluation with ID ${id}:`, {
        type: evaluation.type,
        title: evaluation.title,
        score: evaluation.score,
        answersType: typeof evaluation.answers,
        answersIsArray: Array.isArray(evaluation.answers),
        answersKeys: evaluation.answers ? Object.keys(evaluation.answers as object) : [],
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
