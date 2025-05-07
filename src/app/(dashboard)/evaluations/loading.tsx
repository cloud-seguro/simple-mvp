import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";

export default function EvaluationsLoading() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <SecurityLoadingScreen message="Cargando evaluaciones..." />
        <p className="text-muted-foreground mt-4">
          Estamos recuperando tu historial de evaluaciones...
        </p>
      </div>
    </div>
  );
}
