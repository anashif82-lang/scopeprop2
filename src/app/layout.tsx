import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScopeProp – AI-Powered Proposal Generator",
  description:
    "Generate smart, high-converting proposals, scopes of work, and pricing for freelancers and agencies in minutes.",
  keywords: ["proposal generator", "freelance proposals", "scope of work", "AI proposals"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
