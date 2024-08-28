"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import RootThemeProvider from "./theme";
import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <RootThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </RootThemeProvider>
    </AppRouterCacheProvider>
  );
}
