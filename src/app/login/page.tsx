"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { signIn, AuthServiceError } from "@/features/auth/services/authService";
import { ROLES } from "@/config/roles.config";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const user = await signIn(values.email, values.password);

      // Redirect berdasarkan role: tujuan eksplisit (?redirectTo=...) selalu
      // diutamakan (mis. user diarahkan balik ke halaman yang tadinya mau
      // dibuka sebelum proxy.ts menendang ke /login). Kalau tidak ada,
      // baru fallback ke dashboard sesuai role.
      const redirectTo = searchParams.get("redirectTo");
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role;
      const isAdminOrAbove = role === ROLES.ADMIN || role === ROLES.SUPERADMIN;
      router.push(isAdminOrAbove ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
      setServerError(
        error instanceof AuthServiceError ? error.message : "Gagal masuk. Coba lagi."
      );
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4" noValidate>
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Website Kelas</h1>
          <p className="text-muted-foreground text-sm">Masuk ke akunmu</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="border-input h-10 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            {...register("email")}
          />
          {errors.email ? <p className="text-danger text-xs">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="border-input h-10 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-danger text-xs">{errors.password.message}</p>
          ) : null}
        </div>

        {serverError ? (
          <p role="alert" className="text-danger text-sm">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </main>
  );
}
