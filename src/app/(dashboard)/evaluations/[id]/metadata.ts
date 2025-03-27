import { getEvaluationById } from "@/lib/evaluation-utils";

interface EvaluationPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EvaluationPageProps) {
  try {
    const { id } = await params;
    const evaluation = await getEvaluationById(id);

    if (!evaluation) {
      return {
        title: "Evaluación no encontrada",
      };
    }

    return {
      title: `${evaluation.title} | Dashboard`,
      description: `Resultados de la evaluación de ciberseguridad para ${evaluation.profile.firstName || "Usuario"}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error al cargar evaluación",
    };
  }
}
