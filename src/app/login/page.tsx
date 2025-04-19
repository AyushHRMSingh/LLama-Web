"use client";

import { Button } from "@/components/ui/button";
import { registerUserWithEmailAndPassword, signInUserWithEmailAndPassword } from "@/lib/firebase";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    
    try {
      if (formData.get('type') === "login") {
        const result = await signInUserWithEmailAndPassword(
          formData.get("email") as string, 
          formData.get("password") as string
        );
        
        if (typeof(result) === 'object' && result.success === true) {
          toast.success("Login Successful", {
            description: "You have been logged in successfully, redirecting you now",
          });
          router.push("/dashboard");
        } else {
          toast.error("Login Failed", {
            description: "Your credentials could not be authenticated",
          });
        }
      } else if (formData.get('type') === "signup") {
        if (formData.get("password") !== formData.get("cpassword")) {
          toast.error("Passwords Do Not Match", {
            description: "Please ensure both passwords are identical",
          });
          setIsSubmitting(false);
          return;
        }
        
        const passlen = formData.get("password")?.toString().length || 0;
        if (passlen < 6) {
          toast.error("Password Too Short", {
            description: "Password must be at least 6 characters long",
          });
          setIsSubmitting(false);
          return;
        }
        
        const result = await registerUserWithEmailAndPassword(
          formData.get("email") as string,
          formData.get("password") as string
        );
        
        if (result === true) {
          toast.success("Sign Up Successful", {
            description: "Your account has been created, redirecting you now",
          });
          router.push('/dashboard');
        } else {
          toast.error("Sign Up Failed", {
            description: "There was a problem creating your account",
          });
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      toast.error("Authentication Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account or create a new one</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="login">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Log In</CardTitle>
                  <CardDescription>Enter your email and password to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <Input className="hidden" defaultValue="login" name="type" />
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="name@example.com" 
                        required 
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button type="button" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <Input 
                        type="password" 
                        name="password" 
                        id="password" 
                        required 
                        className="w-full"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Logging in...' : 'Log In'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Create an account</CardTitle>
                  <CardDescription>Enter your details to create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <Input className="hidden" defaultValue="signup" name="type" />
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="name@example.com" 
                        required 
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        type="password" 
                        name="password" 
                        id="password" 
                        required 
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpassword">Confirm Password</Label>
                      <Input 
                        type="password" 
                        name="cpassword" 
                        id="cpassword" 
                        required 
                        className="w-full"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}