"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Dark mode diimplementasikan lewat class `.dark` di <html>, cocok dengan
 * token yang sudah didefinisikan di src/app/globals.css. `attribute="class"`
 * memberi tahu next-themes untuk toggle class itu, bukan atribut lain.
 *
 * suppressHydrationWarning di <html> (src/app/layout.tsx) WAJIB ada
 * berdampingan dengan provider ini — next-themes membaca preferensi
 * tema sebelum React hydrate, yang secara sah membuat markup server vs
 * client sempat berbeda sesaat.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
