import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PrimeTrade AI | Signal Management System",
  description: "Advanced dark-themed trade signal tracking platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          {/* Main layout resets strictly to support different pages optimally via container padding */}
          <main className="flex-1 w-full max-w-7xl mx-auto container-padding pb-12">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
