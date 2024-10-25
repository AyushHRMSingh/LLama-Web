"use client";
import { AuthProvider, useAuth } from "@/context/user.context";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

const Loading = () => (
  <div className="w-full h-full overflow-x-hidden">
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <div className="text-gray-900 mt-4">Loading...</div>
      </div>
    </div>
  </div>
);

const LayoutContent = ({ children }:any) => {
  const { loading }:any = useAuth();

  if (loading) {
    return <Loading />;
  }

  return children;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LayoutContent>
              <Navbar />
              {children}
            </LayoutContent>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
