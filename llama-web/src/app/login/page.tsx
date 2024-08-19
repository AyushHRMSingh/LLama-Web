"use client"
import { Button } from "@/components/ui/button";
import { registerUserWithEmailAndPassword, signInUserWithEmailAndPassword } from "@/lib/firebase";
import { FormEvent } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    // console.log(formData);
    // console.log("submit");
    if (formData.get('type') == "login") {
      try {
        const result = await signInUserWithEmailAndPassword(formData.get("email") as string, formData.get("password") as string)
        if(result) {
          toast({
            title: "Login Successfull",
            description: "You have been logged in successfully, wait to be redirected",
          });
          router.push("/dashboard")
        }
      }
      catch(err) {
        console.log(err);
      }
    }
    else if (formData.get('type') == "signup") {
      try {
        if (formData.get("password") !== formData.get("cpassword")) {
          // console.log("passwords do not match");
          return;
        }
        const result = await registerUserWithEmailAndPassword(formData.get("email") as string, formData.get("password") as string)
        if(result) {
          // console.log("success");
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
      <div className="signbox flex w-2/5 p-20 self-center rounded-3xl">
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
