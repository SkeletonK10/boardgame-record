'use client';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Gowun_Dodum } from "next/font/google";

const gowunDodum = Gowun_Dodum({
  weight: '400',
  subsets: ['latin'],
});

const theme = createTheme({
  typography: {
    fontFamily: gowunDodum.style.fontFamily,
  },
});

export default function RootThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
