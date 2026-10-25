import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { Suspense } from "react";

export const metadata = {
  title: "Proton Shop",
  description: "A professional e-commerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Providers>
          <Suspense fallback={<div className="h-16 bg-white shadow-sm" />}>
            <Navbar />
          </Suspense>

          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
