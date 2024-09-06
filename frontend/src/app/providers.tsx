"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import RootThemeProvider from "./theme";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <RootThemeProvider>
        <SessionProvider>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </SessionProvider>
      </RootThemeProvider>
    </AppRouterCacheProvider>
  );
}
