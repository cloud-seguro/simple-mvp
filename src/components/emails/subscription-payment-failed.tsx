import React from "react";

interface SubscriptionPaymentFailedEmailProps {
  firstName: string;
  baseUrl: string;
  amount: string;
  currency: string;
  failureReason?: string;
  retryDate: string;
  subscriptionType: string;
}

export const SubscriptionPaymentFailedEmail: React.FC<
  Readonly<SubscriptionPaymentFailedEmailProps>
> = ({
  firstName,
  baseUrl,
  amount,
  currency,
  failureReason,
  retryDate,
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
                    color: "#dc2626",
                  }}
                >
                  Problema con tu pago 💳
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
                  Hemos intentado procesar el pago de tu suscripción a SIMPLE,
                  pero no hemos podido completar la transacción. No te
                  preocupes, esto puede suceder por varias razones y es fácil de
                  solucionar.
                </p>

                {/* Payment Details Box */}
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "32px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#dc2626",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    ⚠️ Detalles del pago fallido
                  </h3>
                  <div style={{ fontSize: "16px", color: "#991b1b" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Plan:</strong> {subscriptionType}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Monto:</strong> {amount} {currency.toUpperCase()}
                    </div>
                    {failureReason && (
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Motivo:</strong> {failureReason}
                      </div>
                    )}
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Próximo intento:</strong> {retryDate}
                    </div>
                    <div>
                      <strong>Estado:</strong>{" "}
                      <span style={{ color: "#dc2626" }}>❌ Pago fallido</span>
                    </div>
                  </div>
                </div>

                {/* Action Required Box */}
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
                    🔧 ¿Cómo solucionarlo?
                  </h3>
                  <div style={{ fontSize: "16px", color: "#92400e" }}>
                    <div style={{ marginBottom: "8px" }}>
                      • Verifica que tu tarjeta tenga fondos suficientes
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Confirma que la información de tu tarjeta esté
                      actualizada
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Revisa que tu tarjeta no haya expirado
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Contacta a tu banco si el problema persiste
                    </div>
                    <div>• Actualiza tu método de pago en tu cuenta</div>
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
                  <strong>¡No pierdas tu acceso premium!</strong> Tienes acceso
                  limitado por algunos días más. Actualiza tu método de pago
                  ahora para mantener todos los beneficios de SIMPLE.
                </p>

                {/* CTA Buttons */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <a
                    href={`${baseUrl}/dashboard/settings`}
                    style={{
                      display: "inline-block",
                      backgroundColor: "#dc2626",
                      color: "#ffffff",
                      padding: "16px 32px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                      marginRight: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    Actualizar Método de Pago
                  </a>
                  <a
                    href={`${baseUrl}/contacto`}
                    style={{
                      display: "inline-block",
                      backgroundColor: "#6b7280",
                      color: "#ffffff",
                      padding: "16px 32px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    Contactar Soporte
                  </a>
                </div>

                {/* Important Notice */}
                <div
                  style={{
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "32px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    📅 ¿Qué sucede ahora?
                  </h3>
                  <div style={{ fontSize: "16px", color: "#374151" }}>
                    <div style={{ marginBottom: "8px" }}>
                      • Tu acceso premium continuará por unos días más
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Intentaremos procesar el pago nuevamente el {retryDate}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      • Si el pago sigue fallando, tu cuenta será downgradeada
                      al plan gratuito
                    </div>
                    <div>
                      • Podrás reactivar tu suscripción en cualquier momento
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#374151",
                    marginBottom: "16px",
                  }}
                >
                  Si tienes alguna pregunta o necesitas ayuda para resolver este
                  problema, nuestro equipo de soporte está aquí para asistirte.
                  Responde a este email o contacta directamente a nuestro
                  equipo.
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
                  <em>Aquí para ayudarte a mantener tu seguridad.</em>
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
