
import { Inter, Michroma, Source_Serif_4 } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({ weight: ["400"], subsets: ["latin"], variable: "--font-michroma" });
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"], weight: "700", variable: "--font-source-serif-4" });


export default function DonateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${michroma.variable} ${sourceSerif4.variable} font-body antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
