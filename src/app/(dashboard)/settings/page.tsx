import { Metadata } from "next";
import { ClientSettingsPage } from "./components/client-settings-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Simple MVP",
  description: "Gestiona tu cuenta",
};

export default function SettingsPage() {
  return <ClientSettingsPage />;
}
