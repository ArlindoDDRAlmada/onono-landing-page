import type { Metadata } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "../index.css";
import { ThemeProvider } from "../components/theme-provider";
import I18nextProviderComponent from "../components/i18n-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Onono | AI & Digital Transformation",
  description:
    "Leading AI & Digital Transformation consultancy in Angola. We transform ideas into measurable business results.",
  icons: {
    icon: "/OnonoTech.png",
    shortcut: "/OnonoTech.png",
    apple: "/OnonoTech.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
    >
      <body
        className={`${inter.className} bg-onono-midnight-900 text-white`}
        suppressHydrationWarning={true}
      >
        <I18nextProviderComponent>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </I18nextProviderComponent>
      </body>
    </html>
  );
}
