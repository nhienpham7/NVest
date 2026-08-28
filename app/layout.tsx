import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { inter, geistSans, geistMono, spaceGrotesk } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "NVest",
  description: "Track real-time stock prices",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html
          lang="en"
          className={cn(
              "h-full",
              "dark",
              "antialiased",
              geistSans.variable,
              geistMono.variable,
              spaceGrotesk.variable,
              "font-sans",
              inter.variable
          )}
      >
      <body className="min-h-full flex flex-col">{children}</body>
      </html>
  );
}