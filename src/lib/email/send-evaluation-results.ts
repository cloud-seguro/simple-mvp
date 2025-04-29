import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Interface for sendEvaluationResults parameters
interface SendEvaluationResultsParams {
  to: string;
  evaluationId: string;
  accessCode: string;
  type: "INITIAL" | "ADVANCED";
  score: number;
  firstName?: string;
}

/**
 * Sends evaluation results to the specified email
 */
export async function sendEvaluationResults({
  to,
  evaluationId,
  accessCode,
  type,
  score,
  firstName = "Usuario",
}: SendEvaluationResultsParams) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resultsUrl = `${baseUrl}/results/${evaluationId}?code=${accessCode}`;

  const evaluationType = type === "INITIAL" ? "inicial" : "avanzada";

  try {
    const { data, error } = await resend.emails.send({
      from: "Ciberseguridad Simple <info@ciberseguridadsimple.com>",
      to: [to],
      subject: `Tus resultados de evaluación de ciberseguridad ${evaluationType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">¡Hola ${firstName}!</h1>
          <p>Gracias por completar nuestra evaluación de ciberseguridad ${evaluationType}.</p>
          
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Tu puntuación: ${score} puntos</h2>
            <p>Hemos analizado tus respuestas y preparado un informe detallado sobre el estado actual de ciberseguridad en tu organización.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resultsUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Ver Resultados Completos</a>
          </div>
          
          <p>Este enlace contiene acceso a tu informe personalizado con:</p>
          <ul style="padding-left: 20px;">
            <li>Análisis detallado de tu nivel de madurez en ciberseguridad</li>
            <li>Áreas de fortaleza y oportunidades de mejora</li>
            <li>Recomendaciones prácticas para fortalecer tu postura de seguridad</li>
          </ul>
          
          <p>Si deseas recibir asesoría personalizada o implementar soluciones específicas para tu organización, no dudes en responder a este correo o contactarnos.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #777; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Ciberseguridad Simple. Todos los derechos reservados.<br/>
            Si no solicitaste esta evaluación, puedes ignorar este correo.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending evaluation results email:", error);
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Exception sending evaluation results email:", error);
    throw error;
  }
}
