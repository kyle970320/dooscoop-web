import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dooscoop Web",
  description: "Dooscoop Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} bg-background`}>
        <div className="flex flex-col min-h-screen bg-background">
          <div className="flex-1 max-w-4/5 mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
