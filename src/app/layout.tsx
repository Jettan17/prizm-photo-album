import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prizm Photo Album",
  description: "A personal photo album with masonry layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
