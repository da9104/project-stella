import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import LogoIcon from "./logo.svg";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI assistant | stellaN",
  description: "AI assistant for checking your writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="h-full">
          <nav className="bg-neutral-300 flex justify-center">
            <ul className="bg-transparent py-3 px-3 flex flex-row"> 
              <Image 
              src={LogoIcon}
              alt="stellaN" 
              className="h-10 w-10" 
              />
             <li className="pt-1">
              <Link href='/'>CheckYourWriting</Link>
              </li>
            </ul>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
