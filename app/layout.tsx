import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeProvider";

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

export const metadata: Metadata = {
    title: "QA verse",
    description:
        "A community driven platform for asking and answering questions. Get help, share knowledge and colloborate with developers around the world. Explore topics in web development, mobile app development, algorithms, data structures etc.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
            </body>
        </html>
    );
}
