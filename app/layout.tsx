import { Metadata } from "next";
import { AI } from "./action";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generative UI Minimal Demo",
  description: "A simplified demonstration of AI RSC capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="p-4">
          <AI>{children}</AI>
        </main>
      </body>
    </html>
  );
}
