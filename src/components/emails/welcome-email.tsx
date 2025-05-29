import * as React from "react";

export interface WelcomeEmailProps {
  firstName: string;
  baseUrl: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  firstName,
  baseUrl,
}) => {
  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      border={0}
      width="100%"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333333",
        backgroundColor: "#f8f9fa",
        margin: "0",
        padding: "0",
      }}
    >
      <tr>
        <td style={{ padding: "20px 0" }}>
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            width="100%"
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
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
                <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                  <tr>
                    <td style={{ textAlign: "center", paddingBottom: "16px" }}>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{ margin: "0 auto" }}
                      >
                        <tr>
                          <td
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: "#facc15",
                              borderRadius: "8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              fontWeight: "bold",
                              fontSize: "24px",
                              color: "#000000",
                              lineHeight: "48px",
                            }}
                          >
                            S
                          </td>
                          <td
                            style={{
                              fontSize: "28px",
                              fontWeight: "bold",
                              color: "#ffffff",
                              letterSpacing: "-0.5px",
                              verticalAlign: "middle",
                              paddingLeft: "12px",
                            }}
                          >
                            SIMPLE
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#facc15",
                        fontSize: "14px",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Ciberseguridad Simple
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Content */}
            <tr>
              <td style={{ padding: "40px 32px" }}>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: "16px",
                    lineHeight: "1.3",
                  }}
                >
                  ¡Bienvenido a SIMPLE! 🎉
                </h1>

                <p
                  style={{
                    fontSize: "16px",
                    color: "#333333",
                    marginBottom: "24px",
                    lineHeight: "1.6",
                  }}
                >
                  Hola {firstName},<br />
                  <br />
                  ¡Felicidades! Tu cuenta en SIMPLE ha sido activada
                  exitosamente. Ahora formas parte de una comunidad que está
                  transformando la manera en que las empresas abordan la
                  ciberseguridad.
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    color: "#333333",
                    marginBottom: "24px",
                    lineHeight: "1.6",
                  }}
                >
                  En SIMPLE, creemos que la ciberseguridad no debe ser
                  complicada ni costosa. Hemos diseñado nuestra plataforma para
                  que cualquier empresa, sin importar su tamaño, pueda
                  protegerse de manera efectiva.
                </p>

                {/* Buttons */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={{ textAlign: "center", margin: "32px 0" }}
                >
                  <tr>
                    <td>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{ margin: "0 auto" }}
                      >
                        <tr>
                          <td style={{ padding: "8px" }}>
                            <a
                              href={`${baseUrl}/dashboard`}
                              style={{
                                display: "inline-block",
                                backgroundColor: "#000000",
                                color: "#ffffff",
                                textDecoration: "none",
                                padding: "16px 32px",
                                borderRadius: "8px",
                                fontWeight: "600",
                                fontSize: "16px",
                                border: "2px solid #000000",
                              }}
                            >
                              Ir a mi Dashboard
                            </a>
                          </td>
                          <td style={{ padding: "8px" }}>
                            <a
                              href={`${baseUrl}/evaluation/initial`}
                              style={{
                                display: "inline-block",
                                backgroundColor: "#facc15",
                                color: "#000000",
                                textDecoration: "none",
                                padding: "16px 32px",
                                borderRadius: "8px",
                                fontWeight: "600",
                                fontSize: "16px",
                                border: "2px solid #facc15",
                              }}
                            >
                              Comenzar Evaluación
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                {/* Features Grid */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={{ margin: "32px 0" }}
                >
                  <tr>
                    <td
                      width="50%"
                      style={{ padding: "10px", verticalAlign: "top" }}
                    >
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "8px",
                          borderLeft: "4px solid #facc15",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              fontSize: "32px",
                              textAlign: "center",
                              paddingBottom: "12px",
                            }}
                          >
                            🔍
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "600",
                              color: "#000000",
                              fontSize: "16px",
                              textAlign: "center",
                              paddingBottom: "8px",
                            }}
                          >
                            Evaluaciones Completas
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              color: "#666666",
                              fontSize: "14px",
                              textAlign: "center",
                            }}
                          >
                            Analiza tu nivel de seguridad actual con nuestras
                            evaluaciones especializadas
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      width="50%"
                      style={{ padding: "10px", verticalAlign: "top" }}
                    >
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "8px",
                          borderLeft: "4px solid #facc15",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              fontSize: "32px",
                              textAlign: "center",
                              paddingBottom: "12px",
                            }}
                          >
                            📊
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "600",
                              color: "#000000",
                              fontSize: "16px",
                              textAlign: "center",
                              paddingBottom: "8px",
                            }}
                          >
                            Dashboard Intuitivo
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              color: "#666666",
                              fontSize: "14px",
                              textAlign: "center",
                            }}
                          >
                            Visualiza tu progreso y métricas de seguridad de
                            forma clara
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="50%"
                      style={{ padding: "10px", verticalAlign: "top" }}
                    >
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "8px",
                          borderLeft: "4px solid #facc15",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              fontSize: "32px",
                              textAlign: "center",
                              paddingBottom: "12px",
                            }}
                          >
                            💡
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "600",
                              color: "#000000",
                              fontSize: "16px",
                              textAlign: "center",
                              paddingBottom: "8px",
                            }}
                          >
                            Recomendaciones
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              color: "#666666",
                              fontSize: "14px",
                              textAlign: "center",
                            }}
                          >
                            Recibe consejos personalizados para mejorar tu
                            seguridad
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      width="50%"
                      style={{ padding: "10px", verticalAlign: "top" }}
                    >
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "8px",
                          borderLeft: "4px solid #facc15",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              fontSize: "32px",
                              textAlign: "center",
                              paddingBottom: "12px",
                            }}
                          >
                            👥
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "600",
                              color: "#000000",
                              fontSize: "16px",
                              textAlign: "center",
                              paddingBottom: "8px",
                            }}
                          >
                            Soporte Experto
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              color: "#666666",
                              fontSize: "14px",
                              textAlign: "center",
                            }}
                          >
                            Conecta con especialistas certificados en
                            ciberseguridad
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                {/* Steps section */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  style={{
                    backgroundColor: "#ecfdf5",
                    borderLeft: "4px solid #10b981",
                    padding: "24px",
                    margin: "32px 0",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "#065f46",
                        fontSize: "18px",
                        paddingBottom: "16px",
                      }}
                    >
                      🚀 Primeros pasos recomendados:
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                      >
                        <tr>
                          <td
                            style={{ paddingBottom: "16px", color: "#065f46" }}
                          >
                            <table cellPadding="0" cellSpacing="0" border={0}>
                              <tr>
                                <td
                                  style={{
                                    paddingRight: "12px",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      borderRadius: "50%",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "12px",
                                      lineHeight: "24px",
                                      display: "inline-block",
                                    }}
                                  >
                                    1
                                  </div>
                                </td>
                                <td
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <strong>Completa tu perfil:</strong> Añade
                                  información sobre tu empresa para recibir
                                  recomendaciones más precisas.
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ paddingBottom: "16px", color: "#065f46" }}
                          >
                            <table cellPadding="0" cellSpacing="0" border={0}>
                              <tr>
                                <td
                                  style={{
                                    paddingRight: "12px",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      borderRadius: "50%",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "12px",
                                      lineHeight: "24px",
                                      display: "inline-block",
                                    }}
                                  >
                                    2
                                  </div>
                                </td>
                                <td
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <strong>
                                    Realiza tu primera evaluación:
                                  </strong>{" "}
                                  Comienza con nuestra evaluación inicial para
                                  conocer tu nivel actual de seguridad.
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ paddingBottom: "16px", color: "#065f46" }}
                          >
                            <table cellPadding="0" cellSpacing="0" border={0}>
                              <tr>
                                <td
                                  style={{
                                    paddingRight: "12px",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      borderRadius: "50%",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "12px",
                                      lineHeight: "24px",
                                      display: "inline-block",
                                    }}
                                  >
                                    3
                                  </div>
                                </td>
                                <td
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <strong>Revisa tus resultados:</strong>{" "}
                                  Analiza las recomendaciones personalizadas que
                                  generamos para tu empresa.
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: "0", color: "#065f46" }}>
                            <table cellPadding="0" cellSpacing="0" border={0}>
                              <tr>
                                <td
                                  style={{
                                    paddingRight: "12px",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      minWidth: "24px",
                                      minHeight: "24px",
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      borderRadius: "50%",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "12px",
                                      lineHeight: "24px",
                                      display: "inline-block",
                                    }}
                                  >
                                    4
                                  </div>
                                </td>
                                <td
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    verticalAlign: "top",
                                  }}
                                >
                                  <strong>Implementa mejoras:</strong> Sigue
                                  nuestras guías paso a paso para fortalecer tu
                                  seguridad.
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p
                  style={{
                    fontSize: "16px",
                    color: "#333333",
                    marginBottom: "24px",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>¿Necesitas ayuda?</strong>
                  <br />
                  Nuestro equipo está aquí para apoyarte en cada paso. Puedes:
                </p>

                <ul
                  style={{
                    marginLeft: "20px",
                    marginBottom: "24px",
                    color: "#333333",
                  }}
                >
                  <li style={{ marginBottom: "8px" }}>
                    Responder a este email con tus preguntas
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Visitar nuestro centro de ayuda
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Programar una consulta gratuita
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Unirte a nuestra comunidad
                  </li>
                </ul>

                <p
                  style={{
                    fontSize: "16px",
                    color: "#333333",
                    marginBottom: "0",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>El equipo de SIMPLE</strong>
                  <br />
                  <em>Hacemos lo complejo de la ciberseguridad, simple.</em>
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
