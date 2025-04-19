'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"
import { signOutUser } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/user.context"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SignCheck() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const imgpath = "/userimg.svg";
  const loadingpath = "/loading.svg";
  const { currentUser, loading }: any = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading || !isClient) {
    return (
      <Avatar className="animate-spin" aria-label="Loading user profile">
        <AvatarImage src={loadingpath} alt="Loading animation" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
  }

  const isLoggedIn = currentUser && currentUser !== null && currentUser !== "false";
  let email = "";
  
  if (isLoggedIn) {
    try {
      const jsonuser = JSON.parse(JSON.stringify(currentUser));
      email = jsonuser["email"] || "";
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  return (
    <>
      {currentUser === "false" ? (
        <Avatar className="animate-spin" aria-label="Loading user profile">
          <AvatarImage src={loadingpath} alt="Loading animation" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ) : (
        <>
          {isLoggedIn ? (
            <AvatarComponent imgpath={imgpath} email={email} router={router} />
          ) : (
            <LoginComponent />
          )}
        </>
      )}
    </>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-2 md:p-3 h-12 md:h-16 max-w-screen-xl mx-auto">
        {/* Logo and Main Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="font-extrabold tracking-tight text-xl md:text-2xl lg:text-3xl mr-2 md:mr-4 transition-colors hover:text-primary" aria-label="LLama-Web Home">
            LLama-Web
          </Link>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <Link href="/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenu>
        </div>
        
        {/* Right-side Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />
          <div className="hidden md:block">
            <SignCheck />
          </div>
          
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:w-80">
              <div className="flex flex-col gap-6 pt-4">
                <div className="flex justify-center">
                  <SignCheck />
                </div>
                
                <nav className="flex flex-col gap-2">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function AvatarComponent({ imgpath, email, router }: { imgpath: string, email: string, router: AppRouterInstance }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
          <Avatar>
            <AvatarImage src={imgpath} alt="User profile" />
            <AvatarFallback>{email.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-1 w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{email}</p>
            <p className="text-xs leading-none text-muted-foreground">Logged in</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={() => {
              signOutUser()
              .then(() => {
                setTimeout(() => {
                  router.push('/');
                }, 1000);
              });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LoginComponent() {
  return (
    <Link href="/login" className={navigationMenuTriggerStyle()}>
      Log In
    </Link>
  );
}