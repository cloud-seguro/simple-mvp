import AuthLayout from "@/components/auth/auth-layout";
import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Restablecer Contraseña
          </h1>
          <p className="text-sm text-muted-foreground">
            Crea tu nueva contraseña para poder acceder a tu cuenta.
          </p>
        </div>
        <ResetPasswordForm />
      </Card>
    </AuthLayout>
  );
}
