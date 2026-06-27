import { Geist, Geist_Mono, Zalando_Sans_Expanded } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const zalandoSans = Zalando_Sans_Expanded({
  variable: "--font-zalando-expanded",
  subsets: ["latin"],
  fallback: ["Arial", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clemonade - Designer // Streamer",
  description:
    "Clemonade's personal website and portfolio. Showcasing design work, streaming content, and creative projects.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${zalandoSans.variable} ${geistMono.variable} `}
    >
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
