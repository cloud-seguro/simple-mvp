import React from "react";

interface SubscriptionPaymentSuccessEmailProps {
  firstName: string;
  baseUrl: string;
  amount: string;
  currency: string;
  nextBillingDate: string;
  subscriptionType: string;
}

export const SubscriptionPaymentSuccessEmail: React.FC<
  Readonly<SubscriptionPaymentSuccessEmailProps>
> = ({
  firstName,
  baseUrl,
  amount,
  currency,
  nextBillingDate,
  subscriptionType,
}) => {
  return (
    <table
      style={{
        margin: "0 auto",
        maxWidth: "600px",
        backgroundColor: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <tr>
        <td>
          <table style={{ width: "100%" }}>
            {/* Header */}
            <tr>
              <td
                style={{
                  background:
                    "linear-gradient(135deg, #000000 0%, #333333 100%)",
                  padding: "32px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#facc15",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "24px",
                      color: "#000000",
                    }}
                  >
                    S
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    SIMPLE
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#facc15",
                    fontWeight: "500",
                  }}
                >
                  Ciberseguridad Simple
                </div>
              </td>
            </tr>

            {/* Content */}
            <tr>
              <td style={{ padding: "40px 32px" }}>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "24px",
                    color: "#1f2937",
                  }}
                >
                  ¡Pago procesado exitosamente! 💳
                </h1>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#374151",
                    marginBottom: "24px",
                  }}
                >
                  Hola {firstName},
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#374151",
                    marginBottom: "32px",
                  }}
                >
                  ¡Excelentes noticias! Tu pago de suscripción ha sido procesado
                  correctamente. Tu acceso premium a SIMPLE ha sido renovado
                  automáticamente.
                </p>

                {/* Payment Details Box */}
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "32px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    📄 Detalles del pago
                  </h3>
                  <div style={{ fontSize: "16px", color: "#374151" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Plan:</strong> {subscriptionType}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Monto:</strong> {amount} {currency.toUpperCase()}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Próxima facturación:</strong> {nextBillingDate}
                    </div>
                    <div>
                      <strong>Estado:</strong>{" "}
                      <span style={{ color: "#16a34a" }}>✅ Activo</span>
                    </div>
                  </div>
                </div>

                {/* Benefits Box */}
                <div
                  style={{
                    backgroundColor: "#fef3c7",
                    border: "1px solid #fbbf24",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "32px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#92400e",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    🎯 Tu acceso premium incluye:
                  </h3>
                  <div style={{ fontSize: "16px", color: "#92400e" }}>
                    <div style={{ marginBottom: "8px" }}>
                      • Evaluaciones avanzadas de ciberseguridad
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Acceso a especialistas certificados
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Reportes detallados y recomendaciones
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Soporte prioritario 24/7
                    </div>
                    <div>• Recursos exclusivos de ciberseguridad</div>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#374151",
                    marginBottom: "32px",
                  }}
                >
                  Tu suscripción se renovará automáticamente. Si necesitas
                  realizar cambios o tienes preguntas sobre tu facturación,
                  puedes gestionar tu suscripción desde tu panel de control.
                </p>

                {/* CTA Button */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <a
                    href={`${baseUrl}/dashboard`}
                    style={{
                      display: "inline-block",
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      padding: "16px 32px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Acceder a mi Dashboard
                  </a>
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#374151",
                    marginBottom: "16px",
                  }}
                >
                  Si tienes alguna pregunta sobre tu facturación o necesitas
                  ayuda, nuestro equipo de soporte está disponible para
                  asistirte.
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#374151",
                    marginBottom: "0",
                  }}
                >
                  <strong>El equipo de SIMPLE</strong>
                  <br />
                  <em>
                    Protegiendo tu negocio, simplificando la ciberseguridad.
                  </em>
                </p>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "32px 24px",
                  textAlign: "center",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <p
                  style={{
                    color: "#666666",
                    fontSize: "14px",
                    marginBottom: "16px",
                  }}
                >
                  Este email fue enviado por <strong>SIMPLE</strong> -
                  Ciberseguridad Simple
                </p>

                <div style={{ marginBottom: "16px" }}>
                  <a
                    href={`${baseUrl}/contacto`}
                    style={{
                      color: "#000000",
                      textDecoration: "none",
                      fontWeight: "500",
                      margin: "0 12px",
                      fontSize: "14px",
                    }}
                  >
                    Contacto
                  </a>
                  <a
                    href={`${baseUrl}/dashboard/settings`}
                    style={{
                      color: "#000000",
                      textDecoration: "none",
                      fontWeight: "500",
                      margin: "0 12px",
                      fontSize: "14px",
                    }}
                  >
                    Gestionar Suscripción
                  </a>
                  <a
                    href={`${baseUrl}/ayuda`}
                    style={{
                      color: "#000000",
                      textDecoration: "none",
                      fontWeight: "500",
                      margin: "0 12px",
                      fontSize: "14px",
                    }}
                  >
                    Centro de Ayuda
                  </a>
                </div>

                <p
                  style={{
                    color: "#999999",
                    fontSize: "12px",
                  }}
                >
                  © 2025 SIMPLE. Todos los derechos reservados.
                  <br />
                  Bogotá, Colombia
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};
