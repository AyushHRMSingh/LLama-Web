"use client"
import { Button } from "@/components/ui/button";
import { registerUserWithEmailAndPassword, signInUserWithEmailAndPassword } from "@/lib/firebase";
import { FormEvent } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter()
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    if (formData.get('type') == "login") {
      try {
        const result = await signInUserWithEmailAndPassword(formData.get("email") as string, formData.get("password") as string)
        if(typeof(result) == 'object' && result.success == true) {
          toast.success("Login Successfull",{
            description: "You have been logged in successfully, wait to be redirected",
          });
          router.push("/dashboard")
        } else {
          toast.error("Login Unsuccessful",{
            // variant:"destructive",
            description: "Login could not be authenticated",
          });
        }
      }
      catch(err) {
        console.log("err2");
        console.log(err);
      }
    }
    else if (formData.get('type') == "signup") {
      try {
        if (formData.get("password") !== formData.get("cpassword")) {
          toast.error("Passwords Do Not match", {
            // variant:"destructive",
          });
          return;
        }
        const passlen = formData.get("password")?.toString().length || 0;
        if (formData.get("password") &&  passlen <6) {
          toast.error("Password must be longer than 6 characters", {
            // variant:"destructive",
          });
          return
        }
        const result = await registerUserWithEmailAndPassword(formData.get("email") as string, formData.get("password") as string)
        if(result == true) {
          toast.success("Sign Up Successfull", {
            description: "You have signed up successfully, wait to be redirected",
          });
          router.push('/dashboard');
        }
      }
      catch(err) {
        console.log(err);
      }
    }
    else {
      console.log("error")
    }
  }
  return (
    <div className="biglogdiv flex justify-center h-screen">
      <div className="signbox flex sm:w-4/5 md:w-2/5 p-20 self-center rounded-3xl">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="w-full">Log In</TabsTrigger>
            <TabsTrigger value="signup" className="w-full">Sign Up</TabsTrigger>
          </TabsList>
          <Card className="mt-8">
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Log In</CardTitle>
                <CardDescription>Log in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="py-3">
                  <Input className="hidden" defaultValue="login" name="type" />
                  <div className="inputitems grid gap-4 ">
                    <Label htmlFor="email">Email</Label>
                    <Input type="text" name="email" id="email" className="col-start-1" />
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" id="password" className="mb-6"/>
                    <Button type="submit">Login</Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Sign up for a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="py-3">
                  <Input className="hidden" defaultValue="signup" name="type" />
                  <div className="inputitems grid gap-4 ">
                    <Label htmlFor="email">Email</Label>
                    <Input type="text" name="email" id="email" className="col-start-1" />
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" id="password" />
                    <Label htmlFor="cpassword">Confirm Password</Label>
                    <Input type="password" name="cpassword" id="cpassword" className="mb-6"/>
                    <Button type="submit">Register</Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
