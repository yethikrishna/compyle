import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/utils/provider";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NextTopLoader color="#0326FF" showSpinner={false} />
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
