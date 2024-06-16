import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, useTheme } from "@/context/ThemeProvider";

const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-spaceGrotesk",
});

import "./globals.css";
import "../styles/prism.css";
import { Suspense, useEffect } from "react";
import "./pacman.css";

export const metadata: Metadata = {
    title: "Coders Hub | Surya",
    description:
        "A community driven platform for asking and answering questions. Get help, share knowledge and colloborate with developers around the world. Explore topics in web development, mobile app development, algorithms, data structures etc.",
};

const FallBackUi = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0a0425]">
            <div className="pacman flex items-center">
                <div className="text-white mr-8 font-mono font-bold">
                    Loading
                </div>
                <div className="">
                    <div className="pacman-top"></div>
                    <div className="pacman-bottom"></div>
                </div>
                <div className="feed"></div>
            </div>
        </div>
    );
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
                {/* <FallBackUi /> */}
                <Suspense fallback={<FallBackUi />}>
                    <ClerkProvider
                        appearance={{
                            elements: {
                                formButtonPrimary: "primary-gradient",
                                footerActionLink:
                                    "primary-text-gradient hover:text-primary-500",
                            },
                        }}
                    >
                        <ThemeProvider>{children}</ThemeProvider>
                    </ClerkProvider>
                </Suspense>
            </body>
        </html>
    );
}
