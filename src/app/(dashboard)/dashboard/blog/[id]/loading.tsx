import { Loader } from "@/components/ui/loader";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";

export default function BlogPostLoading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <SecurityLoadingScreen size="lg" variant="primary" />
      <p className="text-lg font-medium text-muted-foreground">
        Cargando editor del blog...
      </p>
    </div>
  );
}
