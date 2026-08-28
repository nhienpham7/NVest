import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["500", "700"],
    variable: "--font-space-grotesk",
});