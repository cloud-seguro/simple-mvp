import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Ciberseguridad Simple",
  description:
    "Términos y condiciones de uso de la plataforma Ciberseguridad Simple",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
