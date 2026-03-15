import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fuck The Business Plan | Podcast de Emprendimiento",
  description:
    "Conversaciones sin filtro sobre emprendimiento real con Christian Dominguez y Juan Carlos Rico. Nuevos episodios cada semana.",
  openGraph: {
    title: "Fuck The Business Plan",
    description:
      "El podcast de negocios sin filtro. Sin el discurso de LinkedIn.",
    images: ["/images/ftbp-cover.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuck The Business Plan",
    description: "El podcast de negocios sin filtro.",
    images: ["/images/ftbp-cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
