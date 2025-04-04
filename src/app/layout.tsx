"use client";
import { AuthProvider, useAuth } from "@/context/user.context";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Loading } from "@/components/Loader";
import { redirect, usePathname } from 'next/navigation'

const inter = Inter({ subsets: ["latin"] });



const LayoutContent = ({ children }:any) => {
  const { currentUser, loading }:any = useAuth();
  console.log("loading", loading);
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  console.log("ellum1nt")
  console.log("currentUser", currentUser);
  console.log("ellum2nt")
  if (currentUser == null) {
    const pathname = usePathname()
    console.log("pathname", pathname);
    if (pathname != "/login" && pathname != '/') {
      redirect('/login');
    }
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
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
