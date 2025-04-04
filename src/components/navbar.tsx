'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"
import { signOutUser } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard } from "lucide-react"
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


export function SignCheck() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const imgpath = "/userimg.svg";
  const loadingpath = "/loading.svg";
  const { currentUser, loading }: any = useAuth(); // Use the AuthContext to get currentUser
  console.log("loading", loading);
  if (loading) {
    return (
      <Avatar className="animate-spin">
        <AvatarImage src={loadingpath} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
  }
  console.log("currentUser", currentUser);

  useEffect(() => {
    setIsClient(true); // Indicate that client-side rendering is now possible
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server side
  }
  var email = "";
  var loggedin = false;
  console.log("currentUser", currentUser);
  if (currentUser && currentUser != null) {
    var jsonuser = JSON.parse(JSON.stringify(currentUser));
    email = jsonuser["email"];
    console.log("isloggedin");
    console.log(jsonuser);
    loggedin = true;
  }
  const url = new URL('/login', window.location.href);
  return (
    <>
    {currentUser == "false" ? (
      <Avatar className="animate-spin">
        <AvatarImage src={loadingpath} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ) : (
      <>
        {loggedin ? (
          avatarComp(imgpath, email, router)
        ) : (
          loginComp()
        )}
      </>
    )}
    </>
  )
};

export function Navbar() {
  return (
    <div className="navb flex justify-between p-3">
      <div className="left grid grid-cols-2 gap-3">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">LLama-Web</h1>
        <NavigationMenu>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenu>
      </div>
      <div className="right grid grid-cols-2 gap-2">
        <ModeToggle />
        <SignCheck />
      </div>
    </div>
  )
}

export function avatarComp(imgpath:string, email:string, router:AppRouterInstance) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={imgpath} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-1">
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span>
          <Button variant="destructive" className="w-full" onClick={
            () => {
              // console.log('Signed out')
              signOutUser()
              .then(() => {
                setTimeout(()=>{
                  const url = new URL('/', window.location.href);
                  router.push(url.toString())
                },1000)
              })
            }
          }>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function loginComp() {
  return (
    <NavigationMenu className="-ml-4">
      <Link href="/login" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Log In
        </NavigationMenuLink>
      </Link>
    </NavigationMenu>
  )
}