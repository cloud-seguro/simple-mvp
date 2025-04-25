import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import AuthLayout from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default async function ResetPasswordPage() {
  // We don't redirect the user if they are logged in because they might be using a password reset link
  // The form component will handle checking if the reset link is valid

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new secure password for your account.
          </p>
        </div>
        <ResetPasswordForm />
      </Card>
    </AuthLayout>
  );
}
